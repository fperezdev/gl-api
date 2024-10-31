const { getDB } = require("../../db");
const { redisClient } = require("../../redis");

// Las consultas a la API de Itunes tienen un rate limit de 20 por minuto,
// así que es importante cachear las respuestas.

const BASE_ITUNES_API_URL = "https://itunes.apple.com";
const MAX_SONGS_PER_REQUEST = 25;
const CACHE_EXPIRATION = 60; // 60 segundos

async function get(req, res) {
  const { query } = req;
  const { name } = query;
  if (!name)
    return res.status(400).send("Falta un nombre de artista para buscar");

  // Buscar respuesta en caché
  const cacheKey = `get-tracks-${name}`;
  const cacheValue = await redisClient.get(cacheKey);
  if (cacheValue) return res.status(200).send(JSON.parse(cacheValue));

  // Si no hay caché, se hace la consulta a Itunes Search API
  const itunesResponse = await fetch(
    `${BASE_ITUNES_API_URL}/search?term=${name}&entity=song&attribute=artistTerm&limit=${MAX_SONGS_PER_REQUEST}`
  );

  if (itunesResponse.status < 200 || itunesResponse.status >= 300) {
    console.log(
      "Error en consulta a Itunes Search API",
      name,
      itunesResponse.status
    );
    return res.status(400).send("Consulta mal formada");
  }

  const itunesResponseBody = await itunesResponse.json();

  if (!itunesResponseBody.results || itunesResponseBody.resultCount === 0)
    return res.status(404).send("No se encontraron resultados");

  const { results: itunesResults } = itunesResponseBody;

  const songs = itunesResults
    // Asegurarse que el nombre del artista sea exacto
    .filter(
      (result) =>
        result.artistName.trim().toLowerCase() === name.trim().toLowerCase()
    )
    // La API de Itunes puede retornar más canciones de las que se piden
    .slice(0, MAX_SONGS_PER_REQUEST)
    // Parsear los resultados a al formato establecido
    .map((song) => ({
      cancion_id: song.trackId,
      nombre_album: song.collectionName,
      nombre_tema: song.trackName,
      nombre_banda: song.artistName,
      preview_url: song.previewUrl,
      fecha_lanzamiento: song.releaseDate,
      precio: {
        valor: song.trackPrice,
        moneda: song.currency,
      },
      img: song.artworkUrl100,
    }));

  // Lista de álbumes únicos en la respuesta
  const uniqAlbums = [...new Set(songs.map((result) => result.nombre_album))];

  const response = {
    total_albumes: uniqAlbums.length,
    total_canciones: songs.length,
    albumes: uniqAlbums,
    canciones: songs,
  };

  redisClient.set(cacheKey, JSON.stringify(response), { EX: CACHE_EXPIRATION });

  return res.status(200).send(response);
}

async function setFavorite(req, res) {
  const { body } = req;

  const { nombre_banda, cancion_id, usuario, ranking } = body;
  if (!nombre_banda || !cancion_id || !usuario || !ranking)
    return res.status(400).send("Faltan valores en el cuerpo de la consulta");

  // Buscar en caché si ya se ha validado esta canción y artista
  const cacheKey = `set-favorite-${cancion_id}-${nombre_banda}`;
  const cacheValue = await redisClient.get(cacheKey);

  if (!cacheValue) {
    // Si no hay caché de esta consulta, se valida con la API de Itunes
    // que la canción existe y que el artista es el correcto
    const itunesResponse = await fetch(
      `${BASE_ITUNES_API_URL}/lookup?id=${cancion_id}&entity=song`
    );

    if (itunesResponse.status < 200 || itunesResponse.status >= 300) {
      console.log(
        "Error en consulta a Itunes Lookup API",
        cancion_id,
        itunesResponse.status
      );
      return res.status(400).send("Consulta mal formada");
    }

    const itunesResponseBody = await itunesResponse.json();

    if (!itunesResponseBody.results || itunesResponseBody.resultCount === 0)
      return res.status(404).send("No se encontraron resultados");

    const itunesResult = itunesResponseBody.results[0];

    if (
      itunesResult.artistName.trim().toLowerCase() !==
      nombre_banda.trim().toLowerCase()
    )
      return res
        .status(400)
        .send("El nombre del artista no corresponde a la canción");

    // Cachear validación de canción y artista por 60 segundos
    redisClient.set(cacheKey, "exists", { EX: CACHE_EXPIRATION });
  }

  // Guardar favorito en base de datos sanitizando las variables
  const db = getDB();
  const insert = db.prepare(
    "INSERT OR REPLACE INTO favorito (cancion_id, nombre_banda, usuario, ranking) VALUES (?, ?, ?, ?)"
  );
  insert.run(cancion_id, nombre_banda, usuario, ranking);

  return res.status(201).send("Favorito guardado");
}

async function deleteFavorite(req, res) {
  const { body } = req;

  const { cancion_id, usuario } = body;
  if (!cancion_id || !usuario)
    return res.status(400).send("Faltan valores en el cuerpo de la consulta");

  // Eliminar favorito de base de datos sanitizando las variables
  const db = getDB();
  const insert = db.prepare(
    "DELETE FROM favorito WHERE cancion_id = ? AND usuario = ?"
  );
  insert.run(cancion_id, usuario);

  return res.status(200).send("Favorito eliminado");
}

module.exports = {
  get,
  setFavorite,
  deleteFavorite,
};

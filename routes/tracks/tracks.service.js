const { getDB } = require("../../db");

async function get(req, res) {
  const { query } = req;
  const { name } = query;
  if (!name) return res.status(400).send("Name is required as query parameter");

  const itunesResponse = await fetch(
    `https://itunes.apple.com/search?term=${name}&entity=song&attribute=artistTerm&limit=200`
  );
  const itunesResponseBody = await itunesResponse.json();
  const { results: itunesResults } = itunesResponseBody;
  if (!itunesResults) return res.status(404).send("Not found");

  // No se puede obtener resultado exacto de nombre de artista con
  // la Search API de Itunes asi que se filtra acá
  const songs = itunesResults
    .filter(
      (result) =>
        result.artistName.trim().toLowerCase() === name.trim().toLowerCase()
    )
    .slice(0, 25)
    .map((song) => ({
      cancion_id: song.trackId,
      nombre_album: song.collectionName,
      nombre_tema: song.trackName,
      preview_url: song.previewUrl,
      fecha_lanzamiento: song.releaseDate,
      precio: {
        valor: song.trackPrice,
        moneda: song.currency,
      },
    }));

  const uniqAlbums = [...new Set(songs.map((result) => result.nombre_album))];

  const response = {
    total_albumes: uniqAlbums.length,
    total_canciones: songs.length,
    albumes: uniqAlbums,
    canciones: songs,
  };

  return res.status(200).send(response);
}

async function setFavorite(req, res) {
  const { body } = req;

  const { nombre_banda, cancion_id, usuario, ranking } = body;
  if (!nombre_banda || !cancion_id || !usuario || !ranking)
    return res.status(400).send("Bad request body");

  const itunesResponse = await fetch(
    `https://itunes.apple.com/lookup?id=${cancion_id}&entity=song`
  );
  if (itunesResponse.status < 200 || itunesResponse.status >= 300)
    return res.status(400).send("Bad request");

  const itunesResponseBody = await itunesResponse.json();
  if (itunesResponseBody.resultCount === 0)
    return res.status(404).send("Not found");

  if (
    itunesResponseBody.results[0].artistName.trim().toLowerCase() !==
    nombre_banda.trim().toLowerCase()
  )
    return res.status(400).send("Bad artist name");
  // Hasta aquí se valida que la cancion exista y sea del artista correcto

  let rankingNumber = 0;
  try {
    rankingNumber = parseInt(ranking);
  } catch (error) {
    return res.status(400).send("Bad ranking");
  }

  if (rankingNumber < 1 || rankingNumber > 5)
    return res.status(400).send("Bad ranking");

  const db = getDB();
  const insert = db.prepare(
    "INSERT OR REPLACE INTO favorito (cancion_id, nombre_banda, usuario, ranking) VALUES (?, ?, ?, ?)"
  );
  const result = insert.run(cancion_id, nombre_banda, usuario, rankingNumber);

  return res.status(201).send(result);
}

module.exports = {
  get,
  setFavorite,
};

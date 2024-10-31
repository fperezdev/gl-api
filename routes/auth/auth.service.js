const { getDB } = require("../../db");

async function login(req, res) {
  const { body } = req;

  const { nombre_usuario } = body;
  if (!nombre_usuario)
    return res.status(400).send("Debe enviar un nombre de usuario");

  if (nombre_usuario.length < 3)
    return res.status(400).send("El nombre de usuario es muy corto");

  const db = getDB();
  const query = db.prepare("SELECT * FROM usuario WHERE nombre = ?");
  const user = query.get(nombre_usuario);
  if (user) {
    const favQuery = db.prepare("SELECT * FROM favorito WHERE usuario = ?");
    const favoritos = favQuery.all(nombre_usuario);
    const response = {
      usuario: user.nombre,
      favoritos: favoritos.map((fav) => ({
        cancion_id: fav.cancion_id,
        ranking: fav.ranking,
      })),
    };
    return res.status(200).send(response);
  }

  const insert = db.prepare("INSERT INTO usuario (nombre) VALUES (?)");
  insert.run(nombre_usuario);
  const response = {
    usuario: nombre_usuario,
    favoritos: [],
  };

  return res.status(201).send(response);
}

module.exports = { login };

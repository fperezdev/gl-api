const { DatabaseSync } = require("node:sqlite");

const db = new DatabaseSync("db.sqlite");
db.exec(`
  CREATE TABLE IF NOT EXISTS usuario (
    nombre TEXT PRIMARY KEY
  );
`);
db.exec(`
    CREATE TABLE IF NOT EXISTS favorito (
        cancion_id BIGINT,
        nombre_banda TEXT,
        usuario TEXT,
        ranking TEXT,
        PRIMARY KEY (cancion_id, usuario),
        FOREIGN KEY (usuario) REFERENCES usuario (nombre) ON DELETE CASCADE
    );
`);
console.log("DB initialized");

function getDB() {
  return db;
}

module.exports = { getDB };

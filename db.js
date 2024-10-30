const { DatabaseSync } = require("node:sqlite");

const db = new DatabaseSync("db.sqlite");
db.exec(`
    CREATE TABLE IF NOT EXISTS favorito (
        cancion_id BIGINT,
        nombre_banda TEXT,
        usuario TEXT,
        ranking INTEGER,
        PRIMARY KEY (cancion_id, usuario)
    );
`);
console.log("DB initialized");

function getDB() {
  return db;
}

module.exports = { getDB };

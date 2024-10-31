const { getDB } = require("../../db");

const authetincate = async (req, res, next) => {
  const { headers } = req;
  const { authorization } = headers;

  if (!authorization || authorization === "")
    return res.status(401).send("No autorizado");

  const db = getDB();
  const query = db.prepare("SELECT * FROM usuario WHERE nombre = ?");
  const user = query.get(authorization);

  if (!user) return res.status(401).send("No autorizado");

  next();
};

module.exports = { authetincate };

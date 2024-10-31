const { Router } = require("express");
const { login } = require("./auth.service");

const authRouter = Router();

// Endpoint para loguear un usuario, si no existe lo crea
// Como primera versión no tiene autenticación
authRouter.post("/login", login);

module.exports = authRouter;

const { Router } = require("express");
const { get, setFavorite } = require("./tracks.service");
const { authetincate } = require("../auth/auth.middleware");

const trackRouter = Router();

// Endpoint para obtener las canciones de un artista en específico
trackRouter.get("/search_tracks", authetincate, get);

// Endpoint para agregar una canción a favoritos del usuario
trackRouter.post("/favoritos", authetincate, setFavorite);

module.exports = trackRouter;

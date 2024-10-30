const { Router } = require("express");
const { get, setFavorite } = require("./tracks.service");

const trackRouter = Router();

// Endpoint para obtener las canciones de un artista en específico
trackRouter.get("/search_tracks", get);

// Endpoint para agregar una canción a favoritos del usuario
trackRouter.post("/favoritos", setFavorite);

module.exports = trackRouter;

const { Router } = require("express");
const { get, setFavorite, deleteFavorite } = require("./tracks.service");
const { authetincate } = require("../auth/auth.middleware");

const trackRouter = Router();

// Endpoint para obtener las canciones de un artista en específico
trackRouter.get("/search_tracks", authetincate, get);

// Endpoint para agregar una canción a favoritos del usuario
trackRouter.post("/favoritos", authetincate, setFavorite);

// Endpoint para eliminar una canción de favoritos del usuario
trackRouter.delete("/favoritos", authetincate, deleteFavorite);

module.exports = trackRouter;

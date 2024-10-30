const { Router } = require("express");
const { get, setFavorite } = require("./tracks.service");

const trackRouter = Router();

trackRouter.get("/search_tracks", get);

trackRouter.post("/favoritos", setFavorite);

module.exports = trackRouter;

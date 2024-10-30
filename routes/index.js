const { Router } = require("express");
const trackRouter = require("./tracks/tracks.controller");

const router = Router();

router.get("/", (_, res) => {
  res.send("Hi there! This is GL API");
});

router.use(trackRouter);

module.exports = router;

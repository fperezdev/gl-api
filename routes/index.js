const { Router } = require("express");
const trackRouter = require("./tracks/tracks.controller");

const router = Router();

router.get("/", (_, res) => {
  res.send("Hola! - GL API");
});

router.use(trackRouter);

module.exports = router;

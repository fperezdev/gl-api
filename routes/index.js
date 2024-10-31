const { Router } = require("express");
const trackRouter = require("./tracks/tracks.controller");
const authRouter = require("./auth/auth.controller");

const router = Router();

router.get("/", (_, res) => {
  res.send("Hola! - GL API");
});

router.use(trackRouter);
router.use("/auth", authRouter);

module.exports = router;

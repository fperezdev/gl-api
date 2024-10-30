const express = require("express");
const router = require("./routes/index.js");

const app = express();
const port = 3000;

app.use(express.json());

app.use(router);

app.listen(port, () => {
  console.log(`GL API listening on port ${port}`);
});

const express = require("express");
const cors = require("cors");
const router = require("./routes/index.js");

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(router);

app.listen(PORT, () => {
  console.log(`GL API listening on port ${PORT}`);
});

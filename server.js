const express = require("express");
const router = require("./routes/index.js");

console.log("process.env", process.env.PORT, process.env.REDIS_URL);
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(router);

app.listen(PORT, () => {
  console.log(`GL API listening on port ${PORT}`);
});

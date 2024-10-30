const { createClient } = require("redis");

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on("error", (err) => console.log("Error en cliente de redis", err));

redisClient.connect();

module.exports = { redisClient };

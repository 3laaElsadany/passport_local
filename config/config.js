require("dotenv").config();

module.exports = {
  port: process.env.PORT,
  url: process.env.MONGO_URL,
  secret: process.env.SECRET
}
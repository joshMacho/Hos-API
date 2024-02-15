require("dotenv").config();
const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    trustedConnection: true,
    enableArithAort: true,
    trustServerCertificate: true,
  },
  port: parseInt(process.env.DB_PORT),
};

module.exports = config;

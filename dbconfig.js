const config = {
  user: "sa",
  password: "macho123",
  server: "MACHO\\SQLEXPRESS",
  database: "hospital",
  options: {
    trustedConnection: true,
    enableArithAort: true,
    instanceName: "SQLEXPRESS",
    trustServerCertificate: true,
  },
  port: 49687,
};

module.exports = config;

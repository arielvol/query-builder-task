const { Sequelize } = require("sequelize");

//Docker Mode
const sequelize = new Sequelize({
  dialect: "postgres",
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  username: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

// for local use within a Docker container:
// const sequelize = new Sequelize({
//   dialect: "postgres",
//   host: "host.docker.internal",
//   database: "postgres",
//   username: "postgres",
//   password: "admin",
//   port: 5432,
// });

// For local use:
// const sequelize = new Sequelize({
//   dialect: "postgres",
//   host: "localhost",
//   database: "postgres",
//   username: "postgres",
//   password: "admin",
//   port: 5432,
// });

module.exports = sequelize;

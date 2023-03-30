const { Sequelize } = require("sequelize");

// Create a new Sequelize instance with your PostgreSQL connection details
// Docker Mode
// const sequelize = new Sequelize({
//   dialect: "postgres",
//   host: process.env.PGHOST,
//   database: process.env.PGDATABASE,
//   username: process.env.PGUSER,
//   password: process.env.PGPASSWORD,
//   port: process.env.PGPORT,
// });

//Local mode
const sequelize = new Sequelize({
    dialect: "postgres",
    host: "localhost",
    database: "postgres",
    username: "postgres",
    password: "admin",
    port: 5432,
  });

module.exports = sequelize;
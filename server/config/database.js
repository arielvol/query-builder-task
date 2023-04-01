const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
    dialect: "postgres",
    host: "localhost",
    database: "postgres",
    username: "postgres",
    password: "admin",
    port: 5432,
  });

module.exports = sequelize;
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Users = require('./Users');

const Queries = sequelize.define('Queries', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    body: {
      type: DataTypes.JSON,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    }
  });
  Users.hasMany(Queries, { foreignKey: 'userId' });
  Queries.belongsTo(Users, { foreignKey: 'userId' });

  module.exports = Queries;
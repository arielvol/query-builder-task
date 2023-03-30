const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require('./User');

const Query = sequelize.define('Query', {
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
  User.hasMany(Query, { foreignKey: 'userId' });
  Query.belongsTo(User, { foreignKey: 'userId' });

  module.exports = Query;
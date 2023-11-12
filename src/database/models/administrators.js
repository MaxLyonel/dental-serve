'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class administrator extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      administrator.belongsTo(models.user, {
        foreignKey: 'userId',
        targetKey: 'id'
      });
      administrator.belongsTo(models.role, {
        foreignKey: 'roleId',
        targetKey: 'id'
      });
      administrator.hasMany(models.treatment, {
        foreignKey: 'administratorId'
      });
      administrator.hasMany(models.payment, {
        foreignKey: 'administratorId'
      });
    }
  }
  administrator.init({
    userId: DataTypes.INTEGER,
    roleId: DataTypes.INTEGER,
    password: DataTypes.STRING,
    active: DataTypes.BOOLEAN,
    superAdmin: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'administrator',
  });
  return administrator;
};
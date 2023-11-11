'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      role.hasMany(models.rolePermission, {
        foreignKey: 'roleId'
      })
      role.hasMany(models.administrator, {
        foreignKey: 'roleId'
      })
    }
  }
  role.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    state: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'role',
  });
  return role;
};
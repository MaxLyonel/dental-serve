'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class rolePermission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      rolePermission.belongsTo(models.role, {
        foreignKey: 'id',
        target_key: 'roleId'
      });
      rolePermission.belongsTo(models.permission, {
        foreignKey: 'id',
        target_key: 'permissionId'
      });
    }
  }
  rolePermission.init({
    roleId: DataTypes.INTEGER,
    permissionId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'rolePermission',
  });
  return rolePermission;
};
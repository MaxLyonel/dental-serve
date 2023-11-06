'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class thethTreataments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  thethTreataments.init({
    treatmentId: DataTypes.INTEGER,
    thethId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'thethTreataments',
  });
  return thethTreataments;
};
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class treatments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      treatments.hasMany(models.payments, {
        foreignKey: 'treatmentId'
      })
    }
  }
  treatments.init({
    userId: DataTypes.INTEGER,
    stageTypeId: DataTypes.INTEGER,
    medicalHistoriesId: DataTypes.INTEGER,
    description: DataTypes.STRING,
    date: DataTypes.DATE,
    state: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'treatments',
  });
  return treatments;
};
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class treatment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      treatment.belongsTo(models.administrator, {
        foreignKey: 'administratorId',
        targetKey: 'id'
      });
      treatment.belongsTo(models.stageType, {
        foreignKey: 'stageTypeId',
        targetKey: 'id'
      });
      treatment.belongsTo(models.medicalHistory, {
        foreignKey: 'medicalHistoryId',
        targetKey: 'id'
      });
      treatment.hasMany(models.thethTreatament, {
        foreignKey: 'treatmentId'
      });
      treatment.hasMany(models.payment, {
        foreignKey: 'treatmentId'
      });
    }
  }
  treatment.init({
    administratorId: DataTypes.INTEGER,
    stageTypeId: DataTypes.INTEGER,
    medicalHistoryId: DataTypes.INTEGER,
    description: DataTypes.STRING,
    date: DataTypes.DATE,
    totalAmount: DataTypes.FLOAT,
    state: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'treatment',
  });
  return treatment;
};
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class medicalHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      medicalHistory.belongsTo(models.patient, {
        foreignKey: 'patientId',
        targetKey: 'id'
      });
      medicalHistory.hasMany(models.treatment, {
        foreignKey: 'medicalHistoryId'
      });
    }
  }
  medicalHistory.init({
    patientId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'medicalHistory',
  });
  return medicalHistory;
};
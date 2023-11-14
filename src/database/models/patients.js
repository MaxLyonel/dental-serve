'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class patient extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      patient.belongsTo(models.user, {
        foreignKey: 'userId',
        targetKey: 'id'
      });
      patient.hasMany(models.treatment, {
        foreignKey: 'patientId'
      });
    }
  }
  patient.init({
    userId: DataTypes.INTEGER,
    responsableId: DataTypes.INTEGER,
    allergies: DataTypes.STRING,
    bloodType: DataTypes.STRING,
    active: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'patient',
  });
  return patient;
};
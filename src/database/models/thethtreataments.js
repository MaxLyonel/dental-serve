'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class thethTreatament extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      thethTreatament.belongsTo(models.treatment, {
        foreignKey: 'treatmentId',
        targetKey: 'id'
      });
      thethTreatament.belongsTo(models.theth, {
        foreignKey: 'thethId',
        targetKey: 'id'
      });
    }
  }
  thethTreatament.init({
    treatmentId: DataTypes.INTEGER,
    thethId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'thethTreatament',
  });
  return thethTreatament;
};
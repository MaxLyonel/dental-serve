'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      payment.belongsTo(models.treatment, {
        foreignKey: 'treatmentId',
        targetKey: 'id'
      });
      payment.belongsTo(models.administrator, {
        foreignKey: 'administratorId',
        targetKey: 'id'
      });
    }
  }
  payment.init({
    treatmentId: DataTypes.INTEGER,
    administratorId: DataTypes.INTEGER,
    amount: DataTypes.FLOAT,
    discount: DataTypes.FLOAT,
    typeDiscount: DataTypes.STRING,
    state: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'payment',
  });
  return payment;
};
'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('payments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      treatmentId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'treatments',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      administratorId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'administrators',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      amount: {
        type: Sequelize.FLOAT
      },
      discount: {
        type: Sequelize.FLOAT,
        defaultValue: 0.0
      },
      typeDiscount: {
        type: Sequelize.STRING,
        defaultValue: 'monto'
      },
      state: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('payments');
  }
};
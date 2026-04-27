'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('sow_inputs', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      sow_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'sows',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      module_no: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      module_description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      payable_amount: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      milestone_no: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('sow_inputs');
  },
};

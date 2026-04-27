'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('sows', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      project_leads_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'project_bids',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      project_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      hours_proposed: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      scope_of_work: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      remarks: {
        type: Sequelize.STRING(1255),
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: 'pending',
      },
      milestones: {
        type: Sequelize.JSON,
        allowNull: true,
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
    await queryInterface.dropTable('sows');
  },
};

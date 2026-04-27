'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('candidate_profiles', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      project_bid_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'project_bids',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      candidate_name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      candidate_total_experience: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      candidate_relavent_experience: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      candidate_resume: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      notice_period_min: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      notice_period_max: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      bid_amount: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'pending',
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
    await queryInterface.dropTable('candidate_profiles');
  },
};

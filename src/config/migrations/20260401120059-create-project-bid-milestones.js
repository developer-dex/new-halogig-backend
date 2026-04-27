'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('project_bid_milestones', {
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
      hours: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      scope: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      is_paid: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      admin_approved_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'pending',
      },
      freelancer_remarks: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      client_remarks: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      freelancer_approved_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      client_approved_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      created_by: {
        type: Sequelize.STRING(255),
        allowNull: false,
        defaultValue: 'freelancer',
      },
      admin_update_at: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null,
      },
      admin_hours: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      admin_scope: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      admin_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      admin_remarks: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('project_bid_milestones');
  },
};

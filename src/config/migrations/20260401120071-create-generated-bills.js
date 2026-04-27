'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('generated_bills', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      projectbid_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      bill_number: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      bill_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      bill_amount: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      bill_status: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      bill_type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      client_billing_details: {
        type: Sequelize.JSON,
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
      milestone_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'project_bid_milestones',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      is_gst_applied: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      igst_amount: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      sgst_amount: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      cgst_amount: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      total_amount: {
        type: Sequelize.FLOAT,
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
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('generated_bills');
  },
};

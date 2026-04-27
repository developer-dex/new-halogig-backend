'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('project_bids', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      client_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      delivery_timeline: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      display_status: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      bid_amount: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      from_user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      lead_status: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      message: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      notify: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      project_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'client_projects',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      sales_comm_amount: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      subject: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      technologty_pre: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      total_proposal_value: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: 'pending',
      },
      gst_image_path: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      gst_note: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      is_gst_applied: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      is_bid_visible: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      admin_modified_bid_amount: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      admin_modified_delivery_timeline: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      admin_modified_message: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      is_admin_modified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      admin_modified_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      approved_by_admin: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
    await queryInterface.dropTable('project_bids');
  },
};

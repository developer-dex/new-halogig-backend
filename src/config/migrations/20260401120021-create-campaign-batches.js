'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('campaign_batches', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      campaign_id: {
        type: Sequelize.STRING(36),
        allowNull: false,
        unique: true,
      },
      batch_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      total_emails: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      emails_generated: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      emails_validated: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      emails_sent: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      emails_failed: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      html_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      slug_url: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING(50),
        allowNull: true,
        defaultValue: 'processing',
      },
      started_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      completed_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.addIndex('campaign_batches', ['campaign_id'], { name: 'idx_campaign_id' });
    await queryInterface.addIndex('campaign_batches', ['batch_name'], { name: 'idx_batch_name' });
    await queryInterface.addIndex('campaign_batches', ['status'], { name: 'idx_status' });
    await queryInterface.addIndex('campaign_batches', ['started_at'], { name: 'idx_started_at' });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('campaign_batches');
  },
};

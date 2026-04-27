'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('processing_batches', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      batch_id: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      total_records: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      processed_records: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      successful_records: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      failed_records: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      status: {
        type: Sequelize.STRING(50),
        allowNull: true,
        defaultValue: 'pending',
      },
      error_message: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      started_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      completed_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      batch_name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      total_emails: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      processed_count: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      validation_total: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      validation_deliverable: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      validation_accept_all: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      validation_undeliverable: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      validation_unknown: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      neverbounce_job_id: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      neverbounce_status: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      validation_completed_at: {
        type: Sequelize.DATE,
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

    await queryInterface.addIndex('processing_batches', ['batch_id'], { name: 'idx_batch_id' });
    await queryInterface.addIndex('processing_batches', ['status'], { name: 'idx_status' });
    await queryInterface.addIndex('processing_batches', ['batch_name'], { name: 'idx_batch_name' });
    await queryInterface.addIndex('processing_batches', ['created_at'], { name: 'idx_created_at' });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('processing_batches');
  },
};

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('web_rot_job_results', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      job_id: {
        type: Sequelize.STRING(36),
        allowNull: false,
        references: {
          model: 'web_rot_jobs',
          key: 'job_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      service_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      service_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      industry_to_update: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      batch_used: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      success: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      error: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      processed_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    await queryInterface.addIndex('web_rot_job_results', ['job_id'], { name: 'idx_job_id' });
    await queryInterface.addIndex('web_rot_job_results', ['success'], { name: 'idx_success' });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('web_rot_job_results');
  },
};

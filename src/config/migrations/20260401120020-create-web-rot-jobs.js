'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('web_rot_jobs', {
      job_id: {
        type: Sequelize.STRING(36),
        primaryKey: true,
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'queued',
      },
      total: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      done: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      success_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      failed_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      queued_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      started_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      completed_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    await queryInterface.addIndex('web_rot_jobs', ['status'], { name: 'idx_status' });
    await queryInterface.addIndex('web_rot_jobs', ['queued_at'], { name: 'idx_queued' });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('web_rot_jobs');
  },
};

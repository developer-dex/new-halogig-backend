'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('activities', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      session_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'work_sessions',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      timestamp: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      keyboard_events: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      mouse_events: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      idle_time_seconds: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      active_window_title: {
        type: Sequelize.STRING(500),
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

    await queryInterface.addIndex('activities', ['session_id'], { name: 'idx_activity_session' });
    await queryInterface.addIndex('activities', ['timestamp'], { name: 'idx_activity_timestamp' });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('activities');
  },
};

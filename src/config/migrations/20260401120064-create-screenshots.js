'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('screenshots', {
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
      screenshot_id: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      taken_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      file_path: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      file_url: {
        type: Sequelize.STRING(1000),
        allowNull: true,
      },
      file_size: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      storage_type: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'local',
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'Uploaded',
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

    await queryInterface.addIndex('screenshots', ['screenshot_id'], { unique: true, name: 'idx_screenshot_id' });
    await queryInterface.addIndex('screenshots', ['session_id'], { name: 'idx_screenshot_session' });
    await queryInterface.addIndex('screenshots', ['taken_at'], { name: 'idx_screenshot_taken_at' });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('screenshots');
  },
};

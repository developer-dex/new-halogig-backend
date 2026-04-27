'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('devices', {
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
      device_id: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      device_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      os: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      app_version: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'Active',
      },
      last_active_at: {
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

    await queryInterface.addIndex('devices', ['device_id'], { unique: true, name: 'idx_device_id' });
    await queryInterface.addIndex('devices', ['user_id'], { name: 'idx_device_user' });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('devices');
  },
};

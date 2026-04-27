'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('chat_rooms', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      chat_type: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'group',
      },
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      created_by_type: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'active',
      },
      max_members: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 50,
      },
      is_private: {
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

    await queryInterface.addIndex('chat_rooms', ['created_by'], { name: 'idx_chat_room_created_by' });
    await queryInterface.addIndex('chat_rooms', ['status'], { name: 'idx_chat_room_status' });
    await queryInterface.addIndex('chat_rooms', ['chat_type'], { name: 'idx_chat_room_type' });
    await queryInterface.addIndex('chat_rooms', ['is_private'], { name: 'idx_chat_room_private' });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('chat_rooms');
  },
};

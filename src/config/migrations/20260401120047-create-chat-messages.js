'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('chat_messages', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      room_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'chat_rooms',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      sender_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      by_admin: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      original_message: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      message_type: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'text',
      },
      meeting_type: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      file_url: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      file_name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      file_size: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      reply_to: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'chat_messages',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      is_edited: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      edited_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      is_deleted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      deleted_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      privacy_masked: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      read_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
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

    await queryInterface.addIndex('chat_messages', ['room_id', 'created_at'], { name: 'idx_chat_message_room_created' });
    await queryInterface.addIndex('chat_messages', ['sender_id'], { name: 'idx_chat_message_sender' });
    await queryInterface.addIndex('chat_messages', ['reply_to'], { name: 'idx_chat_message_reply_to' });
    await queryInterface.addIndex('chat_messages', ['is_deleted', 'room_id'], { name: 'idx_chat_message_deleted' });
    await queryInterface.addIndex('chat_messages', ['by_admin'], { name: 'idx_chat_message_by_admin' });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('chat_messages');
  },
};

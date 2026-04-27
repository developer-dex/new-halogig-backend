module.exports = (sequelize, DataTypes) => {
  const ChatMessageRead = sequelize.define('ChatMessageRead', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    message_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Reference to chat message',
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'User who read the message',
    },
    room_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Reference to chat room (for efficient querying)',
    },
    read_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: 'When the message was read',
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'chat_message_reads',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        name: 'idx_chat_message_read_message_user',
        fields: ['message_id', 'user_id'],
        unique: true,
      },
      {
        name: 'idx_chat_message_read_user_room',
        fields: ['user_id', 'room_id'],
      },
      {
        name: 'idx_chat_message_read_room_time',
        fields: ['room_id', 'read_at'],
      },
    ],
  });

  ChatMessageRead.associate = (models) => {
    // Association with ChatMessage
    ChatMessageRead.belongsTo(models.ChatMessage, {
      foreignKey: 'message_id',
      as: 'message',
    });

    // Association with User
    ChatMessageRead.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'reader',
    });

    // Association with ChatRoom
    ChatMessageRead.belongsTo(models.ChatRoom, {
      foreignKey: 'room_id',
      as: 'room',
    });
  };

  return ChatMessageRead;
};

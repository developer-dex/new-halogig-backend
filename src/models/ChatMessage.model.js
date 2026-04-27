module.exports = (sequelize, DataTypes) => {
  const ChatMessage = sequelize.define('ChatMessage', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    room_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Reference to chat room',
    },
    sender_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'User ID who sent the message',
    },
    by_admin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Flag to indicate if message was sent by an admin',
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'Message content (with privacy masking applied)',
    },
    original_message: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Original message before masking (for admin reference)',
    },
    message_type: {
      type: DataTypes.ENUM('text', 'image', 'file', 'system', 'google_meet'),
      allowNull: false,
      defaultValue: 'text',
      comment: 'Type of message',
    },
    meeting_type: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Meeting provider type for meeting messages (e.g. google_meet, zoom)',
    },
    file_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'URL of attached file (if message_type is file or image)',
    },
    file_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Original file name',
    },
    file_size: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'File size in bytes',
    },
    reply_to: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Reference to message being replied to',
    },
    is_edited: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Whether message has been edited',
    },
    edited_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'When message was last edited',
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Soft delete flag',
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'When message was deleted',
    },
    deleted_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'User ID who deleted the message',
    },
    privacy_masked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Whether message contains masked content',
    },
    read_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Number of users who have read this message',
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
    tableName: 'chat_messages',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        name: 'idx_chat_message_room_created',
        fields: ['room_id', 'created_at'],
      },
      {
        name: 'idx_chat_message_sender',
        fields: ['sender_id'],
      },
      {
        name: 'idx_chat_message_reply_to',
        fields: ['reply_to'],
      },
      {
        name: 'idx_chat_message_deleted',
        fields: ['is_deleted', 'room_id'],
      },
      {
        name: 'idx_chat_message_by_admin',
        fields: ['by_admin'],
      },
    ],
  });

  ChatMessage.associate = (models) => {
    // Association with ChatRoom
    ChatMessage.belongsTo(models.ChatRoom, {
      foreignKey: 'room_id',
      as: 'room',
    });

    // Association with User (sender)
    ChatMessage.belongsTo(models.User, {
      foreignKey: 'sender_id',
      as: 'sender',
      constraints: false,
    });

    // Association with Admin (sender) - for admin messages
    ChatMessage.belongsTo(models.Admin, {
      foreignKey: 'sender_id',
      as: 'adminSender',
      constraints: false, // No foreign key constraint since sender_id can refer to both User and Admin
    });

    // Association with User (deleted by)
    ChatMessage.belongsTo(models.User, {
      foreignKey: 'deleted_by',
      as: 'deletedBy',
    });

    // Self-association for reply_to
    ChatMessage.belongsTo(models.ChatMessage, {
      foreignKey: 'reply_to',
      as: 'replyToMessage',
    });

    // Association with ChatMessageReads
    ChatMessage.hasMany(models.ChatMessageRead, {
      foreignKey: 'message_id',
      as: 'reads',
    });
  };

  return ChatMessage;
};

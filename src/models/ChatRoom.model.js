module.exports = (sequelize, DataTypes) => {
  const ChatRoom = sequelize.define('ChatRoom', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true, // Nullable for individual chats (auto-generated)
      comment: 'Name of the chat room (null for individual chats)',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Optional description of the chat room',
    },
    chat_type: {
      type: DataTypes.ENUM('individual', 'group', 'project', 'support'),
      allowNull: false,
      defaultValue: 'group',
      comment: 'Type of chat: individual (1-to-1) or group/project/support',
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true, // Nullable for individual chats
      comment: 'Admin ID who created the room (only for group chats)',
    },
    created_by_type: {
      type: DataTypes.ENUM('admin', 'user'),
      allowNull: true,
      comment: 'Type of creator: admin for group chats, user for individual chats',
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'archived', 'suspended'),
      allowNull: false,
      defaultValue: 'active',
      comment: 'Status of the chat room',
    },
    max_members: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 50,
      comment: 'Maximum number of members (null for individual chats = 2)',
    },
    is_private: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Whether the chat room is private',
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
    tableName: 'chat_rooms',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        name: 'idx_chat_room_created_by',
        fields: ['created_by'],
      },
      {
        name: 'idx_chat_room_status',
        fields: ['status'],
      },
      {
        name: 'idx_chat_room_type',
        fields: ['chat_type'],
      },
      {
        name: 'idx_chat_room_private',
        fields: ['is_private'],
      },
    ],
  });

  ChatRoom.associate = (models) => {
    // Association with Admin model (for group chats created by admin)
    ChatRoom.belongsTo(models.Admin, {
      foreignKey: 'created_by',
      as: 'adminCreator',
      constraints: false,
    });

    // Association with User model (for individual chats)
    ChatRoom.belongsTo(models.User, {
      foreignKey: 'created_by',
      as: 'userCreator',
      constraints: false,
    });

    // Association with ChatRoomMembers
    ChatRoom.hasMany(models.ChatRoomMember, {
      foreignKey: 'room_id',
      as: 'members',
    });

    // Association with ChatMessages
    ChatRoom.hasMany(models.ChatMessage, {
      foreignKey: 'room_id',
      as: 'messages',
    });
  };

  return ChatRoom;
};

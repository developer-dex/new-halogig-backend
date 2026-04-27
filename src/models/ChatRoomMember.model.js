module.exports = (sequelize, DataTypes) => {
  const ChatRoomMember = sequelize.define('ChatRoomMember', {
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
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Reference to user',
    },
    role: {
      type: DataTypes.ENUM('admin', 'member', 'moderator'),
      allowNull: false,
      defaultValue: 'member',
      comment: 'Role of the user in the chat room',
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'removed', 'left'),
      allowNull: false,
      defaultValue: 'active',
      comment: 'Status of the member in the room',
    },
    joined_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: 'When the user joined the room',
    },
    added_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Admin user ID who added this member',
    },
    last_seen_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Last time the user was active in the room',
    },
    notifications_enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Whether user receives notifications for this room',
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
    tableName: 'chat_room_members',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        name: 'idx_chat_room_member_room_user',
        fields: ['room_id', 'user_id'],
        unique: true,
      },
      {
        name: 'idx_chat_room_member_user_status',
        fields: ['user_id', 'status'],
      },
      {
        name: 'idx_chat_room_member_room_status',
        fields: ['room_id', 'status'],
      },
    ],
  });

  ChatRoomMember.associate = (models) => {
    // Association with ChatRoom
    ChatRoomMember.belongsTo(models.ChatRoom, {
      foreignKey: 'room_id',
      as: 'room',
    });

    // Association with User (member)
    ChatRoomMember.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });

    // Association with User (added by)
    ChatRoomMember.belongsTo(models.User, {
      foreignKey: 'added_by',
      as: 'addedBy',
    });
  };

  return ChatRoomMember;
};

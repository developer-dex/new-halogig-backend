module.exports = (sequelize, DataTypes) => {
  const ChatMeeting = sequelize.define('ChatMeeting', {
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
    created_by_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'User/Admin ID who created the meeting',
    },
    created_by_type: {
      type: DataTypes.ENUM('user', 'admin'),
      allowNull: false,
      comment: 'Type of creator',
    },
    meeting_type: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'Meeting provider type as string (e.g. google_meet, zoom, teams)',
    },
    meeting_link: {
      type: DataTypes.STRING(500),
      allowNull: false,
      comment: 'Meeting URL',
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Meeting title',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Meeting description',
    },
    start_time: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Meeting start time',
    },
    end_time: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Meeting end time',
    },
    timezone: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Timezone for the meeting times',
    },
    external_event_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'External provider event ID (e.g. Google Calendar event ID)',
    },
    organizer_email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'Email of the meeting organizer',
    },
    status: {
      type: DataTypes.ENUM('scheduled', 'cancelled', 'completed', 'failed'),
      allowNull: false,
      defaultValue: 'scheduled',
      comment: 'Status of the meeting',
    },
    chat_message_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Reference to chat message that contains the meeting link',
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
    tableName: 'chat_meetings',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  ChatMeeting.associate = (models) => {
    ChatMeeting.belongsTo(models.ChatRoom, {
      foreignKey: 'room_id',
      as: 'room',
    });

    ChatMeeting.belongsTo(models.ChatMessage, {
      foreignKey: 'chat_message_id',
      as: 'message',
    });
  };

  return ChatMeeting;
};

module.exports = (sequelize, DataTypes) => {
  const InAppNotification = sequelize.define('InAppNotification', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    notification_type: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'Logical type key (matches IN_APP_NOTIFICATION_TYPE constants)',
    },
    sender_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'users.id who triggered the event; null for admin, system, or cron (use params for display text)',
    },
    receiver_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Recipient user id',
    },
    title: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING(2048),
      allowNull: true,
    },
    is_seen: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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
    tableName: 'in_app_notifications',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  InAppNotification.associate = (models) => {
    InAppNotification.belongsTo(models.User, {
      foreignKey: 'sender_id',
      as: 'sender',
      constraints: false,
    });
    InAppNotification.belongsTo(models.User, {
      foreignKey: 'receiver_id',
      as: 'receiver',
      constraints: false,
    });
  };

  return InAppNotification;
};

module.exports = (sequelize, DataTypes) => {
  const AdminNotification = sequelize.define('AdminNotification', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    notification_type: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'Logical type key (typically matches IN_APP_NOTIFICATION_TYPE constants)',
    },
    sender_user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'users.id who triggered the event; null for system/cron',
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
      comment: 'Optional deep link or admin route',
    },
    is_seen: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  }, {
    underscored: true,
    tableName: 'admin_notifications',
  });

  AdminNotification.associate = (models) => {
    AdminNotification.belongsTo(models.User, {
      foreignKey: 'sender_user_id',
      as: 'senderUser',
      constraints: false,
    });
  };

  return AdminNotification;
};

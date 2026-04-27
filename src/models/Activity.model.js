/**
 * Activity Model
 * Represents heartbeat activity data (keyboard/mouse events, idle time)
 */
module.exports = (sequelize, DataTypes) => {
  const Activity = sequelize.define('Activity', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    sessionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'work_sessions',
        key: 'id',
      },
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: 'When the activity was recorded',
    },
    keyboardEvents: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Number of keyboard events',
    },
    mouseEvents: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Number of mouse events',
    },
    idleTimeSeconds: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Idle time in seconds since last heartbeat',
    },
    activeWindowTitle: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'Active window title (optional)',
    },
  }, {
    tableName: 'activities',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    underscored: true,
    indexes: [
      {
        name: 'idx_activity_session',
        fields: ['sessionId'],
      },
      {
        name: 'idx_activity_timestamp',
        fields: ['timestamp'],
      },
    ],
  });

  Activity.associate = (models) => {
    // Activity belongs to a work session
    Activity.belongsTo(models.WorkSession, {
      foreignKey: 'sessionId',
      as: 'workSession',
    });
  };

  return Activity;
};

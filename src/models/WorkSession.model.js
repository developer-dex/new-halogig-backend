/**
 * WorkSession Model
 * Represents a work session (check-in to check-out) for time tracking
 */
module.exports = (sequelize, DataTypes) => {
  const WorkSession = sequelize.define('WorkSession', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    sessionId: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      comment: 'Unique session identifier',
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'projects',
        key: 'id',
      },
    },
    deviceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'devices',
        key: 'id',
      },
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: 'Check-in timestamp',
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Check-out timestamp (null if session is active)',
    },
    totalDurationSeconds: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: 'Total duration in seconds',
    },
    activeDurationSeconds: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: 'Active working duration (excluding idle time)',
    },
    idleDurationSeconds: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: 'Total idle time in seconds',
    },
    status: {
      type: DataTypes.ENUM('Active', 'Completed', 'Abandoned'),
      allowNull: false,
      defaultValue: 'Active',
    },
  }, {
    tableName: 'work_sessions',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    underscored: true,
    indexes: [
      {
        name: 'idx_session_id',
        fields: ['sessionId'],
        unique: true,
      },
      {
        name: 'idx_session_user',
        fields: ['userId'],
      },
      {
        name: 'idx_session_project',
        fields: ['projectId'],
      },
      {
        name: 'idx_session_status',
        fields: ['status'],
      },
    ],
  });

  WorkSession.associate = (models) => {
    // Work session belongs to a user
    WorkSession.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });

    // Work session belongs to a project
    WorkSession.belongsTo(models.Project, {
      foreignKey: 'projectId',
      as: 'project',
    });

    // Work session belongs to a device
    WorkSession.belongsTo(models.Device, {
      foreignKey: 'deviceId',
      as: 'device',
    });

    // Work session has many activity records
    WorkSession.hasMany(models.Activity, {
      foreignKey: 'sessionId',
      as: 'activities',
      onDelete: 'CASCADE',
    });

    // Work session has many screenshots
    WorkSession.hasMany(models.Screenshot, {
      foreignKey: 'sessionId',
      as: 'screenshots',
      onDelete: 'CASCADE',
    });
  };

  return WorkSession;
};

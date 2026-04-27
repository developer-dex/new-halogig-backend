/**
 * Device Model
 * Represents Windows devices used by freelancers for time tracking
 */
module.exports = (sequelize, DataTypes) => {
  const Device = sequelize.define('Device', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    deviceId: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      comment: 'Unique device identifier (UUID)',
    },
    deviceName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'User-friendly device name',
    },
    os: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'Operating system (e.g., Windows 10)',
    },
    appVersion: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'Desktop app version',
    },
    status: {
      type: DataTypes.ENUM('Active', 'Inactive', 'Blocked'),
      allowNull: false,
      defaultValue: 'Active',
    },
    lastActiveAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Last time this device was active',
    },
  }, {
    tableName: 'devices',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    underscored: true,
    indexes: [
      {
        name: 'idx_device_id',
        fields: ['deviceId'],
        unique: true,
      },
      {
        name: 'idx_device_user',
        fields: ['userId'],
      },
    ],
  });

  Device.associate = (models) => {
    // Device belongs to a user
    Device.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });

    // Device has many work sessions
    Device.hasMany(models.WorkSession, {
      foreignKey: 'deviceId',
      as: 'workSessions',
    });
  };

  return Device;
};

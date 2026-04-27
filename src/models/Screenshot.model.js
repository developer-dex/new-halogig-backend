/**
 * Screenshot Model
 * Represents captured screenshots during work sessions
 */
module.exports = (sequelize, DataTypes) => {
  const Screenshot = sequelize.define('Screenshot', {
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
    screenshotId: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      comment: 'Unique screenshot identifier',
    },
    takenAt: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: 'When the screenshot was taken',
    },
    filePath: {
      type: DataTypes.STRING(500),
      allowNull: false,
      comment: 'Local or S3 file path',
    },
    fileUrl: {
      type: DataTypes.STRING(1000),
      allowNull: true,
      comment: 'Public URL for screenshot access',
    },
    fileSize: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'File size in bytes',
    },
    storageType: {
      type: DataTypes.ENUM('local', 's3'),
      allowNull: false,
      defaultValue: 'local',
    },
    status: {
      type: DataTypes.ENUM('Uploaded', 'Processing', 'Failed'),
      allowNull: false,
      defaultValue: 'Uploaded',
    },
  }, {
    tableName: 'screenshots',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    underscored: true,
    indexes: [
      {
        name: 'idx_screenshot_id',
        fields: ['screenshotId'],
        unique: true,
      },
      {
        name: 'idx_screenshot_session',
        fields: ['sessionId'],
      },
      {
        name: 'idx_screenshot_taken_at',
        fields: ['takenAt'],
      },
    ],
  });

  Screenshot.associate = (models) => {
    // Screenshot belongs to a work session
    Screenshot.belongsTo(models.WorkSession, {
      foreignKey: 'sessionId',
      as: 'workSession',
    });
  };

  return Screenshot;
};

module.exports = (sequelize, DataTypes) => {
  const WebRotJob = sequelize.define('WebRotJob', {
    job_id: {
      type: DataTypes.STRING(36),
      primaryKey: true,
      allowNull: false,
      comment: 'UUID v4',
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'queued',
      comment: 'queued | processing | completed',
    },
    total: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    done: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    success_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    failed_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    queued_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    started_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    completed_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: 'web_rot_jobs',
    timestamps: false,
    underscored: true,
    indexes: [
      {
        name: 'idx_status',
        fields: ['status'],
      },
      {
        name: 'idx_queued',
        fields: ['queued_at'],
      },
    ],
  });

  WebRotJob.associate = (models) => {
    WebRotJob.hasMany(models.WebRotJobResult, {
      foreignKey: 'job_id',
      as: 'results',
    });
  };

  return WebRotJob;
};

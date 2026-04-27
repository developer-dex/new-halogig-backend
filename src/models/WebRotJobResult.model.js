module.exports = (sequelize, DataTypes) => {
  const WebRotJobResult = sequelize.define('WebRotJobResult', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    job_id: {
      type: DataTypes.STRING(36),
      allowNull: false,
      comment: 'FK to web_rot_jobs.job_id',
    },
    service_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    service_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    industry_to_update: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    batch_used: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    success: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    error: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    processed_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: 'web_rot_job_results',
    timestamps: false,
    underscored: true,
    indexes: [
      {
        name: 'idx_job_id',
        fields: ['job_id'],
      },
      {
        name: 'idx_success',
        fields: ['success'],
      },
    ],
  });

  WebRotJobResult.associate = (models) => {
    WebRotJobResult.belongsTo(models.WebRotJob, {
      foreignKey: 'job_id',
      targetKey: 'job_id',
      as: 'job',
    });
  };

  return WebRotJobResult;
};

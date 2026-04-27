module.exports = (sequelize, DataTypes) => {
  const WebRotHistory = sequelize.define('WebRotHistory', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    service_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Service identifier',
    },
    service_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    industry: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    current_batch: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'batch_1',
      comment: 'Currently active batch for this service x industry',
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'web_rot_history',
    timestamps: false,
    underscored: true,
    indexes: [
      {
        name: 'uq_service_industry',
        unique: true,
        fields: ['service_id', 'industry'],
      },
      {
        name: 'idx_service_id',
        fields: ['service_id'],
      },
      {
        name: 'idx_industry',
        fields: ['industry'],
      },
    ],
  });

  return WebRotHistory;
};

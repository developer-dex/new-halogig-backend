module.exports = (sequelize, DataTypes) => {
  const CampaignBatch = sequelize.define('CampaignBatch', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    campaign_id: {
      type: DataTypes.STRING(36),
      allowNull: false,
      unique: true,
    },
    batch_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    total_emails: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    emails_generated: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    emails_validated: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    emails_sent: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    emails_failed: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    html_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    slug_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: 'processing',
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
    tableName: 'campaign_batches',
    underscored: true,
    timestamps: true,
    createdAt: false,
    updatedAt: 'updated_at',
    indexes: [
      { name: 'idx_campaign_id', fields: ['campaign_id'] },
      { name: 'idx_batch_name', fields: ['batch_name'] },
      { name: 'idx_status', fields: ['status'] },
      { name: 'idx_started_at', fields: ['started_at'] },
    ],
  });

  CampaignBatch.associate = (models) => {
    CampaignBatch.hasMany(models.EmailCampaign, {
      foreignKey: 'campaign_id',
      sourceKey: 'campaign_id',
      as: 'emailCampaigns',
      onDelete: 'CASCADE',
    });
  };

  return CampaignBatch;
};

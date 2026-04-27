module.exports = (sequelize, DataTypes) => {
  const EmailCampaign = sequelize.define('EmailCampaign', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    batch_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    campaign_id: {
      type: DataTypes.STRING(36),
      allowNull: false,
      references: {
        model: 'campaign_batches',
        key: 'campaign_id',
      },
      onDelete: 'CASCADE',
    },
    recipient_email: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    recipient_domain: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    recipient_business_name: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    recipient_business_description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    recipient_business_nature: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    html_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    template_type: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    special_category_type: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    special_category_value: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    category_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    sub_category_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    sub_category_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    slug_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    full_slug_url: {
      type: DataTypes.STRING(1000),
      allowNull: true,
    },
    email_subject: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    email_html_content: {
      type: DataTypes.TEXT('long'),
      allowNull: true,
    },
    sendgrid_message_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    sendgrid_status: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    sendgrid_response: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: 'pending',
    },
    generation_attempts: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    validation_attempts: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    send_attempts: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    error_message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    last_error_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    html_generated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    html_validated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    sent_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: 'email_campaigns',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      { name: 'idx_campaign_id', fields: ['campaign_id'] },
      { name: 'idx_batch_name', fields: ['batch_name'] },
      { name: 'idx_recipient_email', fields: ['recipient_email'] },
      { name: 'idx_status', fields: ['status'] },
      { name: 'idx_category_name', fields: ['category_name'] },
      { name: 'idx_special_category_value', fields: ['special_category_value'] },
      { name: 'idx_created_at', fields: ['created_at'] },
    ],
  });

  EmailCampaign.associate = (models) => {
    EmailCampaign.belongsTo(models.CampaignBatch, {
      foreignKey: 'campaign_id',
      targetKey: 'campaign_id',
      as: 'campaignBatch',
      onDelete: 'CASCADE',
    });
  };

  return EmailCampaign;
};

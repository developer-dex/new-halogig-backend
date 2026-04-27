module.exports = (sequelize, DataTypes) => {
  const EmailDomainAnalysis = sequelize.define('EmailDomainAnalysis', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    domain: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    website: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    business_description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    business_nature: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    business_model: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    key_products: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    special_category_1: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    special_category_2: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    special_category_3: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: 'pending',
    },
    error_message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    batch_id: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    neverbounce_status: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    neverbounce_result: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    validation_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: 'email_domain_analysis',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      { name: 'idx_email', fields: ['email'] },
      { name: 'idx_domain', fields: ['domain'] },
      { name: 'idx_batch_id', fields: ['batch_id'] },
      { name: 'idx_status', fields: ['status'] },
      { name: 'idx_name', fields: ['name'] },
      { name: 'idx_special_category_1', fields: ['special_category_1'] },
      { name: 'idx_special_category_2', fields: ['special_category_2'] },
      { name: 'idx_special_category_3', fields: ['special_category_3'] },
      { name: 'idx_neverbounce_result', fields: ['neverbounce_result'] },
      { unique: true, name: 'unique_email_batch', fields: ['email', 'batch_id'] },
    ],
  });

  return EmailDomainAnalysis;
};

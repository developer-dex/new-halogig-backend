module.exports = (sequelize, DataTypes) => {
  const SalesReferralLead = sequelize.define('SalesReferralLead', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Reference to users.id for the lead generator',
    },
    company_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    contact_person: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    designation: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    email_address: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    mobile_number: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    website_address: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    customer_industry_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Reference to industries.id',
    },
    customer_industry: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Customer industry label or id as string',
    },
    requirement_details: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    has_spoken_to_customer: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Whether lead generator has spoken to the customer',
    },
    commission_type: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'e.g. percentage, fixed',
    },
    expected_commission_value: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: 'Expected commission amount or percentage',
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'pending',
      comment: 'Lead status: pending, approved, rejected',
    },
  }, {
    tableName: 'sales_referral_leads',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: true,
    deletedAt: 'deleted_at',
    underscored: true,
  });

  SalesReferralLead.associate = (models) => {
    SalesReferralLead.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
    SalesReferralLead.belongsTo(models.Industry, {
      foreignKey: 'customer_industry_id',
      as: 'industry',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
  };

  return SalesReferralLead;
};

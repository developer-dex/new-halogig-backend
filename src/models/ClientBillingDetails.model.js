module.exports = (sequelize, DataTypes) => {
  const ClientBillingDetails = sequelize.define('ClientBillingDetails', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      comment: 'Reference to User table',
    },
    billing_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'Name for billing purposes',
    },
    billing_address: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'Complete billing address',
    },
    billing_email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'Email address for billing communications',
    },
    billing_contact_number: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: 'Contact number for billing purposes',
    },
    gst_number: {
      type: DataTypes.STRING(15),
      allowNull: true,
      comment: 'GST registration number',
    },
    gst_exemted_file: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Path to GST exemption certificate file',
    },
    want_to_add_gst_number: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      comment: 'Whether GST number is want to add',
    },
    want_to_add_gst_exempted_file: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      comment: 'Whether GST exemption certificate file is want to add',
    },
    billing_state: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Billing state',
    },
    billing_country: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Billing country',
    },

  }, {
    tableName: 'client_billing_details',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: true, // Enable soft deletion
    deletedAt: 'deleted_at',
  });

  ClientBillingDetails.associate = (models) => {
    // One-to-One relationship with User
    // Each user has one billing detail, each billing detail belongs to one user
    ClientBillingDetails.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
      onDelete: 'CASCADE',
    });
  };

  return ClientBillingDetails;
};

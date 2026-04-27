module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define('Payment', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
    },
    date_of_transaction: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      comment: 'Date of the transaction',
    },
    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'client_projects',
        key: 'id',
      },
      comment: 'Foreign key reference to client_projects',
    },
    freelancer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      comment: 'Foreign key reference to users (freelancer)',
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: 'Payment amount',
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Payment status',
    },
    invoice_number: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Invoice number',
    },
    tax_type: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Tax type',
    },
    tax_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: 'Tax amount',
    },
  }, {
    underscored: true,
    timestamps: true,
  });

  Payment.associate = (models) => {
    Payment.belongsTo(models.ClientProject, {
      foreignKey: 'project_id',
      as: 'project',
    });
    Payment.belongsTo(models.User, {
      foreignKey: 'freelancer_id',
      as: 'freelancer',
    });
  };

  return Payment;
};

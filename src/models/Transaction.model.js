module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    clientId: {
      type: DataTypes.STRING,
    },
    orderId: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    amount: {
      type: DataTypes.INTEGER,
    },
    freelancerId: {
      type: DataTypes.INTEGER,
    },
    projectId: {
      type: DataTypes.INTEGER,
    },
    bidId: {
      type: DataTypes.INTEGER,
    },
    paymentId: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    signature: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
    },
    milestone_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'project_bid_milestones',
        key: 'id',
      },
      comment: 'Reference to the milestone being paid',
    },
    gateway: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'razorpay',
      comment: 'Payment gateway used for this transaction',
    },
    provider_event_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Provider webhook/event id for idempotency',
    },
  }, {
    underscored: true,
  });

  Transaction.associate = (models) => {
    Transaction.belongsTo(models.ProjectBidMilestone, {
      foreignKey: 'milestone_id',
      as: 'milestone',
    });
  };

  return Transaction;
};

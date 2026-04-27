module.exports = (sequelize, DataTypes) => {
  const Dispute = sequelize.define('Dispute', {
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
    dispute_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'User ID who raised the dispute',
    },
    dispute_for: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'User ID against whom the dispute is raised',
    },
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Reference to client project',
    },
    project_bid_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Reference to project bid',
    },
    raised_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: 'Date when the dispute was raised',
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending',
      comment: 'Status of the dispute (pending, resolved, etc.)',
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Dispute kind (e.g. change_freelancer, refund)',
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Optional message/description about the dispute',
    },
  }, {
    underscored: true,
    tableName: 'disputes',
  });

  Dispute.associate = (models) => {
    Dispute.belongsTo(models.User, {
      foreignKey: 'dispute_by',
      as: 'disputedBy',
      onDelete: 'cascade',
    });

    Dispute.belongsTo(models.User, {
      foreignKey: 'dispute_for',
      as: 'disputedFor',
      onDelete: 'cascade',
    });

    Dispute.belongsTo(models.ClientProject, {
      foreignKey: 'projectId',
      onDelete: 'cascade',
    });

    Dispute.belongsTo(models.ProjectBid, {
      foreignKey: 'project_bid_id',
      onDelete: 'cascade',
    });
  };

  return Dispute;
};

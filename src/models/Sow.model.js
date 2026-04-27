module.exports = (sequelize, DataTypes) => {
  const Sow = sequelize.define(
    'Sow',
    {
      user_id: {
        type: DataTypes.INTEGER,
      },
      project_leads_id: {
        type: DataTypes.INTEGER,
      },
      project_id: {
        type: DataTypes.INTEGER,
        allowNull: false, // Use allowNull instead of required
      },
      hours_proposed: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      scope_of_work: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      remarks: {
        type: DataTypes.STRING(1255),
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: 'pending',
      },
      milestones: {
        type: DataTypes.JSON,
        allowNull: true,
      },
    },
    {
      underscored: true,
    },
  );
  Sow.associate = (models) => {
    Sow.hasMany(models.SowInput, {
      foreignKey: 'sowId',
    });
    Sow.belongsTo(models.ProjectBid, {
      foreignKey: 'project_leads_id',
      targetKey: 'id',
      as: 'bidder',
    });

    // Add relationship to milestones
    Sow.hasMany(models.ProjectBidMilestone, {
      foreignKey: 'project_bid_id',
      sourceKey: 'project_leads_id',
      as: 'projectMilestones',
    });
  };
  return Sow;
};

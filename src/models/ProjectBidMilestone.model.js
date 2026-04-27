module.exports = (sequelize, DataTypes) => {
  const ProjectBidMilestone = sequelize.define('ProjectBidMilestone', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    project_bid_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'project_bids',
        key: 'id',
      },
    },
    hours: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Hours allocated for this milestone',
    },
    scope: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'Scope description for this milestone',
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: 'Amount allocated for this milestone',
    },
    is_paid: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Whether this milestone has been paid',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    admin_approved_date: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Date when this milestone was approved by admin',
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending',
      comment: 'Status of this milestone',
    },
    freelancer_remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Remarks by freelancer',
    },
    client_remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Remarks by admin',
    },
    freelancer_approved_date: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Date when this milestone was approved by freelancer',
    },
    client_approved_date: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Date when this milestone was approved by client',
    },
    created_by: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: 'freelancer',
      comment: 'Who created this milestone (admin/freelancer/client)',
    },
    admin_update_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
      comment: 'Timestamp when admin last updated this milestone',
    },
    admin_hours: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Admin modified version of hours for this milestone',
    },
    admin_scope: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Admin modified version of scope for this milestone',
    },
    admin_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: 'Admin modified version of amount for this milestone',
    },
    admin_remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Admin remarks for this milestone',
    },

  }, {
    tableName: 'project_bid_milestones',
    underscored: false,
    timestamps: true,
  });

  ProjectBidMilestone.associate = (models) => {
    ProjectBidMilestone.belongsTo(models.ProjectBid, {
      foreignKey: 'project_bid_id',
      as: 'projectBid',
    });

    ProjectBidMilestone.hasMany(models.Transaction, {
      foreignKey: 'milestone_id',
      as: 'transactions',
    });
  };

  return ProjectBidMilestone;
};

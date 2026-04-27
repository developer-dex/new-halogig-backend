module.exports = (sequelize, DataTypes) => {
  const ProjectBid = sequelize.define('ProjectBid', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    client_id: {
      type: DataTypes.INTEGER,
    },
    delivery_timeline: {
      type: DataTypes.STRING,
    },
    display_status: {
      type: DataTypes.STRING,
    },
    bid_amount: {
      type: DataTypes.STRING,
    },
    from_user_id: {
      type: DataTypes.INTEGER,
    },
    lead_status: {
      type: DataTypes.STRING,
    },
    message: {
      type: DataTypes.STRING(500),
    },
    notify: {
      type: DataTypes.STRING,
    },
    project_id: {
      type: DataTypes.INTEGER,
    },
    sales_comm_amount: {
      type: DataTypes.STRING,
    },
    subject: {
      type: DataTypes.STRING,
    },
    technologty_pre: {
      type: DataTypes.STRING,
    },
    total_proposal_value: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'pending',
    },
    gst_image_path: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'Path to GST image file',
    },
    gst_note: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Note related to GST details',
    },
    is_gst_applied: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Whether GST has been applied to this bid',
    },
    is_bid_visible: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Whether the bid is visible to the client',
    },
    admin_modified_bid_amount: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Modified bid amount by admin',
    },
    admin_modified_delivery_timeline: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Modified delivery timeline by admin',
    },
    admin_modified_message: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'Modified message by admin',
    },
    is_admin_modified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Whether the bid has been modified by admin',
    },
    admin_modified_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Modified at by admin',
    },
    approved_by_admin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Whether the project bid has been approved by admin',
    },
    is_dispute: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Whether this bid has an active or raised dispute',
    },
  }, {
    underscored: true,
  });

  ProjectBid.associate = (models) => {
    ProjectBid.belongsTo(models.User, {
      foreignKey: 'from_user_id',
      as: 'freelancer',
    });
    ProjectBid.belongsTo(models.User, {
      foreignKey: 'client_id',
      as: 'client',
    });
    ProjectBid.belongsTo(models.ClientProject, {
      foreignKey: 'project_id',
    });
    ProjectBid.hasMany(models.CandidateProfile, {
      foreignKey: 'project_bid_id',
      as: 'candidateProfiles',
    });
    ProjectBid.hasMany(models.Sow, {
      foreignKey: 'project_leads_id',
      as: 'sows',
    });

    ProjectBid.hasMany(models.ProjectBidMilestone, {
      foreignKey: 'project_bid_id',
      as: 'milestones',
    });
    ProjectBid.hasMany(models.Dispute, {
      foreignKey: 'project_bid_id',
      onDelete: 'cascade',
    });
  };
  return ProjectBid;
};

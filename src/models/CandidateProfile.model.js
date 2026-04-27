module.exports = (sequelize, DataTypes) => {
  const CandidateProfile = sequelize.define('CandidateProfile', {
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
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    candidate_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    candidate_total_experience: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    candidate_relavent_experience: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    candidate_resume: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    notice_period_min: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    notice_period_max: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    bid_amount: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
      allowNull: false,
      defaultValue: 'pending',
    },
  }, {
    tableName: 'candidate_profiles',
    underscored: true,
  });

  CandidateProfile.associate = (models) => {
    CandidateProfile.belongsTo(models.ProjectBid, {
      foreignKey: 'project_bid_id',
      as: 'projectBid',
    });
  };

  return CandidateProfile;
};

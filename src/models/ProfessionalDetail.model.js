module.exports = (sequelize, DataTypes) => {
  const ProfessionalDetail = sequelize.define('ProfessionalDetail', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
    },
    profile_headline: {
      type: DataTypes.STRING,
    },
    project_category: {
      type: DataTypes.STRING,
    },
    project_sub_category: {
      type: DataTypes.STRING,
    },
    technologty_pre: {
      type: DataTypes.STRING,
    },
    model_engagement: {
      type: DataTypes.STRING,
    },
    rateperhour: {
      type: DataTypes.INTEGER,
    },
    rateperhour_2: {
      type: DataTypes.STRING,
    },
    currency: {
      type: DataTypes.STRING,
    },
    languages: {
      type: DataTypes.STRING, // Store languages as JSON or CSV format
      defaultValue: null,
    },
    support_project: {
      type: DataTypes.STRING,
    },
    development_project: {
      type: DataTypes.STRING,
    },
    upwork_platform: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
      comment: 'Whether user uses Upwork platform',
    },
    upwork_platform_profile_link: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'Upwork profile URL',
    },
    fiver_platform: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
      comment: 'Whether user uses Fiverr platform',
    },
    fiver_platform_profile_link: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'Fiverr profile URL',
    },
    freelancer_platform: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
      comment: 'Whether user uses Freelancer platform',
    },
    freelancer_platform_profile_link: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'Freelancer profile URL',
    },
    pph_platform: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
      comment: 'Whether user uses PeoplePerHour platform',
    },
    pph_platform_profile_link: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'PeoplePerHour profile URL',
    },
    truelancer_platform: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
      comment: 'Whether user uses Truelancer platform',
    },
    truelancer_platform_profile_link: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'Truelancer profile URL',
    },
    other_platform: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Name of other freelancing platforms',
    },
    other_platform_profile_link: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'Other platform profile URL',
    },
  }, {
    underscored: true,
  });
  ProfessionalDetail.associate = (models) => {
    ProfessionalDetail.belongsTo(models.User, {
      foreignKey: 'userId', onDelete: 'cascade',
    });

    ProfessionalDetail.belongsTo(models.Category, {
      foreignKey: 'project_category', onDelete: 'cascade',
    });

    // Many-to-many relationship with SubCategory through junction table
    ProfessionalDetail.belongsToMany(models.SubCategory, {
      through: models.ProfessionalDetailSubCategory,
      foreignKey: 'professional_experience_id',
      otherKey: 'sub_category_id',
      as: 'subCategories',
    });

    // Has many relationship with ProfessionalDetailSubCategory
    ProfessionalDetail.hasMany(models.ProfessionalDetailSubCategory, {
      foreignKey: 'professional_experience_id',
      as: 'professionalDetailSubCategories',
    });
  };
  return ProfessionalDetail;
};

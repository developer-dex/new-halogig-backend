module.exports = (sequelize, DataTypes) => {
  const ClientProject = sequelize.define('ClientProject', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    project_uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
    },
    customer_industry: {
      type: DataTypes.INTEGER,
    },
    model_engagement: {
      type: DataTypes.STRING,
    },
    notice_period: {
      type: DataTypes.STRING,
    },
    notice_period_min: {
      type: DataTypes.STRING,
    },
    notice_period_max: {
      type: DataTypes.STRING,
    },
    posted_by_user_id: {
      type: DataTypes.INTEGER,
    },
    project_amount: {
      type: DataTypes.STRING,
    },
    project_category: {
      type: DataTypes.INTEGER,
    },
    project_duration_max: {
      type: DataTypes.STRING,
    },
    project_duration_min: {
      type: DataTypes.STRING,
    },
    project_sub_category: {
      type: DataTypes.STRING,
    },
    project_summary: {
      type: DataTypes.STRING,
    },
    project_title: {
      type: DataTypes.STRING,
    },
    project_amount_min: {
      type: DataTypes.STRING,
    },
    project_amount_max: {
      type: DataTypes.STRING,
    },
    technologty_pre: {
      type: DataTypes.STRING,
    },
    client_project_link: {
      type: DataTypes.STRING,
    },
    type_of_project: {
      type: DataTypes.STRING,
    },
    currency_symbol: {
      type: DataTypes.STRING,
      defaultValue: '₹',
    },
    currency_type: {
      type: DataTypes.STRING,
      defaultValue: 'INR',
    },
    approved_by_admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    is_published: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    created_by_admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    generated_by_ai: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    location_preferancer: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Preferred location for the freelancer/project',
    },
    status: { type: DataTypes.INTEGER },
  }, {
    underscored: true,
  });

  ClientProject.associate = (models) => {
    ClientProject.belongsTo(models.User, {
      foreignKey: 'posted_by_user_id',
    });
    ClientProject.belongsTo(models.Category, {
      foreignKey: 'project_category',
    });
    ClientProject.belongsTo(models.Industry, {
      foreignKey: 'customer_industry',
    });
    // Many-to-many relationship with SubCategory through junction table
    ClientProject.belongsToMany(models.SubCategory, {
      through: models.ClientProjectSubCategory,
      foreignKey: 'client_project_id',
      otherKey: 'sub_category_id',
      as: 'subCategories',
    });
    // Has many relationship with ClientProjectSubCategory (for direct querying of junction table)
    ClientProject.hasMany(models.ClientProjectSubCategory, {
      foreignKey: 'client_project_id',
      as: 'clientProjectSubCategories',
    });
    ClientProject.hasMany(models.ProjectBid, {
      foreignKey: 'project_id',
    });
    ClientProject.hasMany(models.Payment, {
      foreignKey: 'project_id',
      as: 'payments',
    });
    ClientProject.hasMany(models.Dispute, {
      foreignKey: 'projectId',
      onDelete: 'cascade',
    });
  };

  return ClientProject;
};

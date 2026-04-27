module.exports = (sequelize, DataTypes) => {
  const ProjectDetail = sequelize.define('ProjectDetail', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    appName: {
      type: DataTypes.STRING,
    },
    industry: {
      type: DataTypes.STRING,
    },
    softwareVersion: {
      type: DataTypes.STRING,
    },
    technology: {
      type: DataTypes.STRING,
    },
    features: {
      type: DataTypes.STRING,
    },
    deliveryTime: {
      type: DataTypes.STRING,
    },
    sourceCode: {
      type: DataTypes.STRING,
    },
    price: {
      type: DataTypes.STRING,
    },
    currency_type: {
      type: DataTypes.STRING,
      defaultValue: 'USD',
    },
    description: {
      type: DataTypes.STRING(900),
    },
    headline: {
      type: DataTypes.STRING(100),
    },
    is_mobile_platform: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    is_web_platform: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    is_desktop_platform: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    is_customizable: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    is_published: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    is_embedding_platform: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    underscored: true,
  });

  ProjectDetail.associate = (models) => {
    ProjectDetail.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'cascade',
    });
    ProjectDetail.hasOne(models.Thumbnail, {
      foreignKey: 'projectDetailId',
      as: 'Thumbnail',
    });
    ProjectDetail.hasOne(models.InternalData, {
      foreignKey: 'projectDetailId',
      as: 'InternalData',
    });
  };

  return ProjectDetail;
};

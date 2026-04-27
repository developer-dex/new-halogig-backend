module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define('Project', {
    user_id: {
      type: DataTypes.INTEGER,
    },
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    project_name: {
      type: DataTypes.STRING,
    },
    project_type: {
      type: DataTypes.STRING,
    },
    duration: {
      type: DataTypes.STRING,
    },
    technologty_pre: {
      type: DataTypes.STRING,
    },
    industry: {
      type: DataTypes.STRING,
    },
    project_details: {
      type: DataTypes.STRING(900),
    },
    upload_file: {
      type: DataTypes.STRING,
    },
    project_link: {
      type: DataTypes.STRING,
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
    is_embedding_platform: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    project_location: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Project location/country',
    },
  }, {
    underscored: true,
  });
  Project.associate = (models) => {
    Project.belongsTo(models.User, {
      foreignKey: 'user_id',
    });
    // Association with Industry for resume/profile views
    Project.belongsTo(models.Industry, {
      foreignKey: 'industry',
      as: 'industryData',
    });
  };
  return Project;
};

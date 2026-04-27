module.exports = (sequelize, DataTypes) => {
  const Thumbnail = sequelize.define('Thumbnail', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    project_detail_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.TEXT,
    },
    appId: {
      type: DataTypes.STRING,
    },
    images: {
      type: DataTypes.TEXT,
    },
  }, {
    underscored: true,
  });

  Thumbnail.associate = (models) => {
    Thumbnail.hasMany(models.ThumbnailImage, {
      foreignKey: 'thumbnailId',
      as: 'thumbnailImages',
    });
    Thumbnail.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'cascade',
    });
    Thumbnail.belongsTo(models.ProjectDetail, {
      foreignKey: 'projectDetailId',
      onDelete: 'cascade',
    });
  };

  return Thumbnail;
};

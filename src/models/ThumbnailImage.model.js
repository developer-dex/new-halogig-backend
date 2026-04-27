module.exports = (sequelize, DataTypes) => {
  const ThumbnailImage = sequelize.define('ThumbnailImage', {
    thumbnailId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'thumbnails',
        key: 'id',
      },
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    underscored: true,
    tableName: 'thumbnail_images',
  });

  ThumbnailImage.associate = (models) => {
    ThumbnailImage.belongsTo(models.Thumbnail, {
      foreignKey: 'thumbnailId',
      as: 'thumbnail',
    });
  };

  return ThumbnailImage;
};

module.exports = (sequelize, DataTypes) => {
  const Video = sequelize.define('Video', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    projectDetailId: {
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
    videoUrl: {
      type: DataTypes.TEXT,
    },
  }, {
    underscored: true,
  });

  Video.associate = (models) => {
    Video.belongsTo(models.User, {
      foreignKey: 'userId', onDelete: 'cascade',
    });
  };

  return Video;
};

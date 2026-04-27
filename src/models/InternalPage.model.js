module.exports = (sequelize, DataTypes) => {
  const InternalPage = sequelize.define('InternalPage', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    projectDetailId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
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
    content: {
      type: DataTypes.TEXT,
    },
  }, {
    underscored: true,
  });

  InternalPage.associate = (models) => {
    InternalPage.hasMany(models.InternalImage, {
      foreignKey: 'internalPageId',
      as: 'internalPageImages',
    });
    InternalPage.belongsTo(models.User, {
      foreignKey: 'userId', onDelete: 'cascade',
    });
  };

  return InternalPage;
};

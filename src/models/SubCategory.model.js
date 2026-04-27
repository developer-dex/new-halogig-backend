module.exports = (sequelize, DataTypes) => {
  const SubCategory = sequelize.define(
    'SubCategory',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      categoryId: {
        type: DataTypes.INTEGER,
      },
      name: {
        type: DataTypes.STRING,
      },
    },
    {
      underscored: true,
    },
  );
  SubCategory.associate = (models) => {
    SubCategory.belongsTo(models.Category, {
      foreignKey: 'categoryId', onDelete: 'cascade',
    });
  };
  return SubCategory;
};

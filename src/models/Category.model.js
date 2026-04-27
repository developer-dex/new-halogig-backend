module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define(
    'Category',
    {
      name: {
        type: DataTypes.STRING,
      },
    },
    {
      underscored: true,
    },
  );
  Category.associate = (models) => {
    Category.hasMany(models.SubCategory, {
      foreignKey: 'categoryId', onDelete: 'cascade',
    });
  };
  return Category;
};

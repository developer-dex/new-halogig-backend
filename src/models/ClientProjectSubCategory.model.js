module.exports = (sequelize, DataTypes) => {
  const ClientProjectSubCategory = sequelize.define('ClientProjectSubCategory', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    client_project_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Reference to client project',
    },
    posted_by_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Reference to user who posted the project',
    },
    sub_category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Reference to sub category',
    },
  }, {
    underscored: true,
    tableName: 'client_project_sub_categories',
  });

  ClientProjectSubCategory.associate = (models) => {
    ClientProjectSubCategory.belongsTo(models.ClientProject, {
      foreignKey: 'client_project_id',
      onDelete: 'cascade',
    });

    ClientProjectSubCategory.belongsTo(models.User, {
      foreignKey: 'posted_by_user_id',
      onDelete: 'cascade',
    });

    ClientProjectSubCategory.belongsTo(models.SubCategory, {
      foreignKey: 'sub_category_id',
      onDelete: 'cascade',
    });
  };

  return ClientProjectSubCategory;
};

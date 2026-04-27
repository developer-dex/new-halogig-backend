module.exports = (sequelize, DataTypes) => {
  const ProfessionalDetailSubCategory = sequelize.define('ProfessionalDetailSubCategory', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Reference to user',
    },
    professional_experience_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Reference to professional detail',
    },
    sub_category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Reference to sub category',
    },
  }, {
    underscored: true,
    tableName: 'professional_detail_sub_categories',
  });

  ProfessionalDetailSubCategory.associate = (models) => {
    ProfessionalDetailSubCategory.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'cascade',
    });

    ProfessionalDetailSubCategory.belongsTo(models.ProfessionalDetail, {
      foreignKey: 'professional_experience_id',
      onDelete: 'cascade',
    });

    ProfessionalDetailSubCategory.belongsTo(models.SubCategory, {
      foreignKey: 'sub_category_id',
      onDelete: 'cascade',
    });
  };

  return ProfessionalDetailSubCategory;
};

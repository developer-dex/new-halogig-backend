module.exports = (sequelize, DataTypes) => {
  const CategoryDatabase = sequelize.define('CategoryDatabase', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    category: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'Category name',
    },
    normalized_key: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      comment: 'Normalized key for the category',
    },
    examples: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Examples related to the category',
    },
  }, {
    tableName: 'category_database',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['category'],
        name: 'idx_category',
      },
      {
        fields: ['normalized_key'],
        name: 'idx_normalized_key',
      },
    ],
  });

  return CategoryDatabase;
};

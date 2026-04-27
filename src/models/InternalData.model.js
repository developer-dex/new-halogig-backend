module.exports = (sequelize, DataTypes) => {
  const InternalData = sequelize.define('InternalData', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
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
    app_id: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.TEXT,
    },
  }, {
    tableName: 'internal_data',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  InternalData.associate = (models) => {
    InternalData.hasMany(models.InternalImage, {
      foreignKey: 'internal_data_id',
      sourceKey: 'id',
      as: 'internalImages',
    });
    InternalData.belongsTo(models.User, {
      foreignKey: 'user_id',
      targetKey: 'id',
      onDelete: 'cascade',
    });
    InternalData.belongsTo(models.ProjectDetail, {
      foreignKey: 'project_detail_id',
      targetKey: 'id',
      onDelete: 'cascade',
    });
  };

  return InternalData;
};

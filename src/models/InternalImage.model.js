module.exports = (sequelize, DataTypes) => {
  const InternalImage = sequelize.define('InternalImage', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    internal_data_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'internal_data',
        key: 'id',
      },
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: 'internal_images',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  InternalImage.associate = (models) => {
    InternalImage.belongsTo(models.InternalData, {
      foreignKey: 'internal_data_id',
      targetKey: 'id',
      as: 'internalData',
    });
  };

  return InternalImage;
};

module.exports = (sequelize, DataTypes) => {
  const UserFunction = sequelize.define('UserFunction', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    industry_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'industries',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    function: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    url_slug: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    slug_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'website_data',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    ip_address: {
      type: DataTypes.STRING(45),
      allowNull: true,
      comment: 'IP address of the user (supports both IPv4 and IPv6)',
    },
  }, {
    tableName: 'user_functions',
    underscored: true,
    indexes: [
      {
        fields: ['industry_id'],
      },
      {
        fields: ['slug_id'],
      },
      {
        fields: ['url_slug'],
      },
    ],
  });

  UserFunction.associate = (models) => {
    // Association with Industry
    UserFunction.belongsTo(models.Industry, {
      foreignKey: 'industry_id',
      targetKey: 'id',
      as: 'industry',
    });

    // Association with WebsiteData
    UserFunction.belongsTo(models.WebsiteData, {
      foreignKey: 'slug_id',
      targetKey: 'id',
      as: 'websiteData',
    });
  };

  return UserFunction;
};

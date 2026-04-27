module.exports = (sequelize, DataTypes) => {
  const Industry = sequelize.define('Industry', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    industry: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.ENUM('active', 'deleted', 'inactive'),
      defaultValue: 'active',
    },
  }, {
    underscored: true,
  });

  Industry.associate = (models) => {
    Industry.hasMany(models.ClientProject, {
      foreignKey: 'customer_industry',
    });
  };

  return Industry;
};

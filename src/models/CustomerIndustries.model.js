module.exports = (sequelize, DataTypes) => {
  const Technology = sequelize.define('Technology', {
    name: {
      type: DataTypes.STRING,
    },
    customer_industry_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
  }, {
    underscored: true,
  });

  return Technology;
};

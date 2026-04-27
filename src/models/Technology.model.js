module.exports = (sequelize, DataTypes) => {
  const Technology = sequelize.define('Technology', {
    name: {
      type: DataTypes.STRING,
    },
  }, {
    underscored: true,
  });

  return Technology;
};

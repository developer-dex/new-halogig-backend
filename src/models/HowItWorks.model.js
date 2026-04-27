module.exports = (sequelize, DataTypes) => {
  const HowItWorks = sequelize.define('HowItWorks', {
    title: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.TEXT,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'deleted'),
      defaultValue: 'active',
    },
    cmsId: {
      type: DataTypes.INTEGER,
    },
  }, {
    underscored: true,
  });

  return HowItWorks;
};

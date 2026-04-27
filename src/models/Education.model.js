module.exports = (sequelize, DataTypes) => {
  const Education = sequelize.define('Education', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
    },
    delete_id: {
      type: DataTypes.STRING,
    },
    education_type: {
      type: DataTypes.STRING,
    },
    graduation_type: {
      type: DataTypes.STRING,
    },
    university_name: {
      type: DataTypes.STRING,
    },
    month: {
      type: DataTypes.STRING,
    },
    year: {
      type: DataTypes.STRING,
    },
    degree: {
      type: DataTypes.STRING,
    },
  }, {
    underscored: true,
  });

  return Education;
};

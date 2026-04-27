module.exports = (sequelize, DataTypes) => {
  const Certificate = sequelize.define(
    'Certificate',
    {
      certificate_no: {
        type: DataTypes.STRING,
      },
      certificate_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.TEXT,
      },
      from_date: {
        type: DataTypes.TEXT,
      },
      till_date: {
        type: DataTypes.TEXT,
      },
      institutename: {
        type: DataTypes.TEXT,
      },
      userId: {
        type: DataTypes.INTEGER,
      },
    },
    {
      underscored: true,
    },
  );
  return Certificate;
};

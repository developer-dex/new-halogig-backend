module.exports = (sequelize, DataTypes) => {
  const Designation = sequelize.define('Designation', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    is_admin_approved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    from_others: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }, {
    underscored: true,
  });

  return Designation;
};

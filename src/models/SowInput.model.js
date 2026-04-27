module.exports = (sequelize, DataTypes) => {
  const SowInput = sequelize.define(
    'SowInput',
    {
      sowId: {
        type: DataTypes.INTEGER,
      },
      module_no: {
        type: DataTypes.STRING,
      },
      module_description: {
        type: DataTypes.STRING,
        allowNull: false, // Use allowNull instead of required
      },
      payable_amount: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      milestone_no: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      underscored: true,
    },
  );

  return SowInput;
};

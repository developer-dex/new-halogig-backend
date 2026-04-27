module.exports = (sequelize, DataTypes) => {
  const ReportProblem = sequelize.define('ReportProblem', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      comment: 'Foreign key to users table',
    },
    first_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    mobile_number: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    company_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {
    underscored: true,
    tableName: 'report_problems',
  });

  ReportProblem.associate = (models) => {
    ReportProblem.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });
  };

  return ReportProblem;
};

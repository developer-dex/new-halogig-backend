module.exports = (sequelize, DataTypes) => {
  const UserActivity = sequelize.define('UserActivity', {
    url: {
      type: DataTypes.STRING,
      allowNull: true, // Nullable as per your requirement
    },
    time_spent: {
      type: DataTypes.INTEGER,
      allowNull: true, // Nullable as per your requirement
    },
    ip_address: {
      type: DataTypes.STRING(45), // Accommodates IPv6
      allowNull: true, // Nullable as per your requirement
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true, // Nullable as per your requirement
    },
    device_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    start_time: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    end_time: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    page_load_time: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    telecom_provider: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    browser: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    user_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    underscored: true,
  });

  return UserActivity;
};

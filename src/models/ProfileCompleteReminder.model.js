module.exports = (sequelize, DataTypes) => {
  const ProfileCompleteReminder = sequelize.define('ProfileCompleteReminder', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    first_reminder_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    second_reminder_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    third_reminder_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    underscored: true,
    tableName: 'profile_complete_reminders',
  });

  ProfileCompleteReminder.associate = (models) => {
    ProfileCompleteReminder.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });
  };

  return ProfileCompleteReminder;
};

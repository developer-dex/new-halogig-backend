module.exports = (sequelize, DataTypes) => {
  const FreelancerCurrentCountryPreference = sequelize.define('FreelancerCurrentCountryPreference', {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Reference to User table',
    },
    country: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'Country name for freelancer preference',
    },
    add_by_admin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Indicates if this preference was added by admin',
    },
    is_currrently_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Indicates if this preference is currently active',
    },
    added_from: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Indicates if this preference was added from admin or user',
    },
  }, {
    tableName: 'freelancer_current_country_preferences',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  FreelancerCurrentCountryPreference.associate = (models) => {
    // Many-to-One relationship: Many preferences belong to one user
    FreelancerCurrentCountryPreference.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
      onDelete: 'CASCADE',
    });
  };

  return FreelancerCurrentCountryPreference;
};

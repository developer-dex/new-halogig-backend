module.exports = (sequelize, DataTypes) => {
  const FreelancerCv = sequelize.define('FreelancerCv', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    category_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    service_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    full_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    designation: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    gender: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    rate_per_hour: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    experience: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    technologies: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    total_jobs: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    total_hours: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    languages: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    brief_description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'freelancer_cvs',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        name: 'idx_category',
        fields: ['category_name'],
      },
      {
        name: 'idx_service',
        fields: ['service_name'],
      },
      {
        name: 'idx_gender',
        fields: ['gender'],
      },
      {
        name: 'idx_designation',
        fields: ['designation'],
      },
    ],
  });

  return FreelancerCv;
};

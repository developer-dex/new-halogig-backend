module.exports = (sequelize, DataTypes) => {
  const Feedback = sequelize.define('Feedback', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    client_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      comment: 'Foreign key reference to the client user',
    },
    freelancer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      comment: 'Foreign key reference to the freelancer user',
    },
    ratings: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
      comment: 'Rating given by client (1-5 scale)',
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Feedback comment from client',
    },
    project_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'client_projects',
        key: 'id',
      },
      comment: 'Foreign key reference to the project (nullable)',
    },
  }, {
    tableName: 'feedbacks',
    timestamps: true,
    indexes: [
      {
        fields: ['client_id'],
      },
      {
        fields: ['freelancer_id'],
      },
      {
        fields: ['projectId'],
      },
      {
        fields: ['ratings'],
      },
    ],
  });

  Feedback.associate = (models) => {
    // Association with User as client
    Feedback.belongsTo(models.User, {
      foreignKey: 'client_id',
      as: 'client',
    });

    // Association with User as freelancer
    Feedback.belongsTo(models.User, {
      foreignKey: 'freelancer_id',
      as: 'freelancer',
    });

    // Association with ClientProject
    Feedback.belongsTo(models.ClientProject, {
      foreignKey: 'projectId',
      as: 'project',
    });
  };

  return Feedback;
};

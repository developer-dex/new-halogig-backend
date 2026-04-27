module.exports = (sequelize, DataTypes) => {
  const SavedProject = sequelize.define(
    'SavedProject',
    {
      userId: {
        type: DataTypes.INTEGER,
      },
      projectId: {
        type: DataTypes.INTEGER,
      },
    },
    {
      underscored: true,
    },
  );

  SavedProject.associate = (models) => {
    SavedProject.belongsTo(models.ClientProject, {
      foreignKey: 'projectId', onDelete: 'cascade',
    });
  };

  return SavedProject;
};

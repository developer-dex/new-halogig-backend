module.exports = (sequelize, DataTypes) => {
  const HtmlTemplate = sequelize.define('HtmlTemplate', {
    html_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    template_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    general_template: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
    },
    dummy_template: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 1,
    },
  }, {
    tableName: 'html_template',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      { name: 'idx_template_name', fields: ['template_name'] },
      { name: 'idx_is_active', fields: ['is_active'] },
    ],
  });

  return HtmlTemplate;
};

module.exports = (sequelize, DataTypes) => {
  const WebRotData = sequelize.define('WebRotData', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    service_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Service identifier',
    },
    service_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    slug_link: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    industry: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    batch_no: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: 'Batch identifier (batch_1 ... batch_7)',
    },
    service_list: {
      type: DataTypes.TEXT('long'),
      allowNull: true,
      comment: 'JSON array of 5 items [{title, description}]',
    },
    main_application_list: {
      type: DataTypes.TEXT('long'),
      allowNull: true,
      comment: 'JSON array of 4 items [{title, description}]',
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'inactive',
      comment: 'active | inactive',
    },
  }, {
    tableName: 'web_rot_data',
    timestamps: false,
    underscored: true,
    indexes: [
      {
        name: 'uq_service_industry_batch',
        unique: true,
        fields: ['service_id', 'industry', 'batch_no'],
      },
      {
        name: 'idx_service_id',
        fields: ['service_id'],
      },
      {
        name: 'idx_industry',
        fields: ['industry'],
      },
      {
        name: 'idx_batch_no',
        fields: ['batch_no'],
      },
      {
        name: 'idx_status',
        fields: ['status'],
      },
    ],
  });

  return WebRotData;
};

module.exports = (sequelize, DataTypes) => {
  const ProcessingBatch = sequelize.define('ProcessingBatch', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    batch_id: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    total_records: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    processed_records: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    successful_records: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    failed_records: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: 'pending',
    },
    error_message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    started_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    completed_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    batch_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    total_emails: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    processed_count: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    validation_total: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    validation_deliverable: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    validation_accept_all: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    validation_undeliverable: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    validation_unknown: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    neverbounce_job_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    neverbounce_status: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    validation_completed_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: 'processing_batches',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      { name: 'idx_batch_id', fields: ['batch_id'] },
      { name: 'idx_status', fields: ['status'] },
      { name: 'idx_batch_name', fields: ['batch_name'] },
      { name: 'idx_created_at', fields: ['created_at'] },
    ],
  });

  return ProcessingBatch;
};

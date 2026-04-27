module.exports = (sequelize, DataTypes) => {
  const LogManager = sequelize.define('LogManager', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // Can be null for system-level errors
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    api_endpoint: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'The API endpoint that was called (e.g., /freelancer/bids)',
    },
    http_method: {
      type: DataTypes.ENUM('GET', 'POST', 'PUT', 'DELETE', 'PATCH'),
      allowNull: true,
      comment: 'HTTP method used for the request',
    },
    log_level: {
      type: DataTypes.ENUM('ERROR', 'WARN', 'INFO', 'DEBUG'),
      allowNull: false,
      defaultValue: 'INFO',
      comment: 'Log severity level',
    },
    log_type: {
      type: DataTypes.ENUM('API_ERROR', 'VALIDATION_ERROR', 'DATABASE_ERROR', 'AUTH_ERROR', 'SYSTEM_ERROR', 'FILE_UPLOAD_ERROR', 'BUSINESS_LOGIC_ERROR'),
      allowNull: false,
      defaultValue: 'SYSTEM_ERROR',
      comment: 'Type of error or log entry',
    },
    error_code: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'Custom error code or HTTP status code',
    },
    error_message: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Detailed error message or description',
    },
    stack_trace: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Full stack trace for debugging',
    },
    request_data: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Request body, query params, and headers (sanitized)',
    },
    response_data: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Response data or error response',
    },
    ip_address: {
      type: DataTypes.STRING(45),
      allowNull: true,
      comment: 'Client IP address',
    },
    user_agent: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'User agent string from request',
    },
    session_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Session identifier if available',
    },
    execution_time: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'API execution time in milliseconds',
    },
    memory_usage: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Memory usage in bytes',
    },
    environment: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: 'development',
      comment: 'Environment where error occurred (development, staging, production)',
    },
    module: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Module or component where error occurred',
    },
    function_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Function name where error occurred',
    },
    line_number: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Line number in the code where error occurred',
    },
    is_resolved: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Whether the issue has been resolved',
    },
    resolved_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      comment: 'User ID who resolved the issue',
    },
    resolved_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'When the issue was resolved',
    },
    resolution_notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Notes about how the issue was resolved',
    },
    priority: {
      type: DataTypes.ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'),
      allowNull: false,
      defaultValue: 'MEDIUM',
      comment: 'Priority level of the error',
    },
    tags: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Array of tags for categorizing and filtering logs',
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Additional metadata or context information',
    },
  }, {
    tableName: 'log_manager',
    underscored: true,
    indexes: [
      {
        name: 'idx_log_manager_user_id',
        fields: ['user_id'],
      },
      {
        name: 'idx_log_manager_log_level',
        fields: ['log_level'],
      },
      {
        name: 'idx_log_manager_log_type',
        fields: ['log_type'],
      },
      {
        name: 'idx_log_manager_api_endpoint',
        fields: ['api_endpoint'],
      },
      {
        name: 'idx_log_manager_created_at',
        fields: ['created_at'],
      },
      {
        name: 'idx_log_manager_is_resolved',
        fields: ['is_resolved'],
      },
      {
        name: 'idx_log_manager_priority',
        fields: ['priority'],
      },
      {
        name: 'idx_log_manager_environment',
        fields: ['environment'],
      },
    ],
  });

  LogManager.associate = (models) => {
    LogManager.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });

    LogManager.belongsTo(models.User, {
      foreignKey: 'resolved_by',
      as: 'resolvedByUser',
    });
  };

  return LogManager;
};

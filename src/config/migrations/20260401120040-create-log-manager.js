'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('log_manager', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      api_endpoint: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      http_method: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      log_level: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'INFO',
      },
      log_type: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'SYSTEM_ERROR',
      },
      error_code: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      error_message: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      stack_trace: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      request_data: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      response_data: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      ip_address: {
        type: Sequelize.STRING(45),
        allowNull: true,
      },
      user_agent: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      session_id: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      execution_time: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      memory_usage: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      environment: {
        type: Sequelize.STRING(50),
        allowNull: true,
        defaultValue: 'development',
      },
      module: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      function_name: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      line_number: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      is_resolved: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      resolved_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      resolved_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      resolution_notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      priority: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'MEDIUM',
      },
      tags: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      metadata: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.addIndex('log_manager', ['user_id'], { name: 'idx_log_manager_user_id' });
    await queryInterface.addIndex('log_manager', ['log_level'], { name: 'idx_log_manager_log_level' });
    await queryInterface.addIndex('log_manager', ['log_type'], { name: 'idx_log_manager_log_type' });
    await queryInterface.addIndex('log_manager', ['api_endpoint'], { name: 'idx_log_manager_api_endpoint' });
    await queryInterface.addIndex('log_manager', ['created_at'], { name: 'idx_log_manager_created_at' });
    await queryInterface.addIndex('log_manager', ['is_resolved'], { name: 'idx_log_manager_is_resolved' });
    await queryInterface.addIndex('log_manager', ['priority'], { name: 'idx_log_manager_priority' });
    await queryInterface.addIndex('log_manager', ['environment'], { name: 'idx_log_manager_environment' });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('log_manager');
  },
};

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('project_details', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      app_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      industry: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      software_version: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      technology: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      features: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      delivery_time: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      source_code: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      price: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      currency_type: {
        type: Sequelize.STRING,
        defaultValue: 'USD',
      },
      description: {
        type: Sequelize.STRING(900),
        allowNull: true,
      },
      headline: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      is_mobile_platform: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      is_web_platform: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      is_desktop_platform: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      is_customizable: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      is_published: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      is_embedding_platform: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('project_details');
  },
};

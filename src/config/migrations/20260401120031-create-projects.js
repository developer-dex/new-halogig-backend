'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('projects', {
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
        onDelete: 'CASCADE',
      },
      project_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      project_type: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      duration: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      technologty_pre: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      industry: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      project_details: {
        type: Sequelize.STRING(900),
        allowNull: true,
      },
      upload_file: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      project_link: {
        type: Sequelize.STRING,
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
      is_embedding_platform: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      project_location: {
        type: Sequelize.STRING(255),
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
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('projects');
  },
};

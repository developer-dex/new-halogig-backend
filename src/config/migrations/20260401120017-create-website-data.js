'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('website_data', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      category_name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      service_name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      slug_link: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      primary_keyword: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      secondary_keyword: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      banner_title: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      banner_description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      service_title: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      service_description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      service_lists: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      industry_title: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      industry_lists: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      main_application_title: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      main_application_description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      main_application_lists: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      interlink_pages: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      usercase_listes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      meta_title: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      meta_description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      is_publish: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      order: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      video_url: {
        type: Sequelize.STRING(500),
        allowNull: true,
        defaultValue: null,
      },
      video_thumbnail_path: {
        type: Sequelize.STRING(500),
        allowNull: true,
        defaultValue: null,
      },
      video_title: {
        type: Sequelize.STRING(500),
        allowNull: true,
        defaultValue: null,
      },
      video_description: {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: null,
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

    await queryInterface.addIndex('website_data', ['category_name']);
    await queryInterface.addIndex('website_data', ['service_name']);
    await queryInterface.addIndex('website_data', ['slug_link']);
    await queryInterface.addIndex('website_data', ['is_publish']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('website_data');
  },
};

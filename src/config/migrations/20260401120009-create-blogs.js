'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('blogs', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      image_path: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      thumbnail_image: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      blog_slug: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      content: {
        type: Sequelize.TEXT('long'),
        allowNull: true,
      },
      relevant_blogs: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: [],
      },
      time_to_read: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.addIndex('blogs', ['title']);
    await queryInterface.addIndex('blogs', ['blog_slug']);
    await queryInterface.addIndex('blogs', ['createdAt']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('blogs');
  },
};

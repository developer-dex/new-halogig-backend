'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user_functions', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      industry_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'industries',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      function: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      url_slug: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      slug_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'website_data',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      ip_address: {
        type: Sequelize.STRING(45),
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

    await queryInterface.addIndex('user_functions', ['industry_id']);
    await queryInterface.addIndex('user_functions', ['slug_id']);
    await queryInterface.addIndex('user_functions', ['url_slug']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('user_functions');
  },
};

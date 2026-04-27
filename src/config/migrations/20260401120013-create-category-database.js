'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('category_database', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      category: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      normalized_key: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      examples: {
        type: Sequelize.TEXT,
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

    await queryInterface.addIndex('category_database', ['category'], { name: 'idx_category' });
    await queryInterface.addIndex('category_database', ['normalized_key'], { name: 'idx_normalized_key' });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('category_database');
  },
};

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('html_template', {
      html_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      template_name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      general_template: {
        type: Sequelize.TEXT('long'),
        allowNull: false,
      },
      dummy_template: {
        type: Sequelize.TEXT('long'),
        allowNull: false,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: true,
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

    await queryInterface.addIndex('html_template', ['template_name'], { name: 'idx_template_name' });
    await queryInterface.addIndex('html_template', ['is_active'], { name: 'idx_is_active' });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('html_template');
  },
};

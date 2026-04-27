'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('educations', {
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
      delete_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      education_type: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      graduation_type: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      university_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      month: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      year: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      degree: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('educations');
  },
};

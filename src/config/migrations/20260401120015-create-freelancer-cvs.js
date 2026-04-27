'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('freelancer_cvs', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      category_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      service_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      full_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      designation: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      gender: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      rate_per_hour: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      experience: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      technologies: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      total_jobs: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      total_hours: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      location: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      languages: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      brief_description: {
        type: Sequelize.TEXT,
        allowNull: false,
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

    await queryInterface.addIndex('freelancer_cvs', ['category_name'], { name: 'idx_category' });
    await queryInterface.addIndex('freelancer_cvs', ['service_name'], { name: 'idx_service' });
    await queryInterface.addIndex('freelancer_cvs', ['gender'], { name: 'idx_gender' });
    await queryInterface.addIndex('freelancer_cvs', ['designation'], { name: 'idx_designation' });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('freelancer_cvs');
  },
};

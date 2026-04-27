'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('professional_details', {
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
      profile_headline: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      project_category: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      project_sub_category: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      technologty_pre: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      model_engagement: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      rateperhour: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      rateperhour_2: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      currency: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      languages: {
        type: Sequelize.STRING,
        defaultValue: null,
        allowNull: true,
      },
      support_project: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      development_project: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      upwork_platform: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      upwork_platform_profile_link: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      fiver_platform: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      fiver_platform_profile_link: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      freelancer_platform: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      freelancer_platform_profile_link: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      pph_platform: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      pph_platform_profile_link: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      truelancer_platform: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      truelancer_platform_profile_link: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      other_platform: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      other_platform_profile_link: {
        type: Sequelize.STRING(500),
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
    await queryInterface.dropTable('professional_details');
  },
};

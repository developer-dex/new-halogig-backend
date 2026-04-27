'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('client_projects', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      project_uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        unique: true,
      },
      customer_industry: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'industries',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      model_engagement: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      notice_period: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      notice_period_min: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      notice_period_max: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      posted_by_user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      project_amount: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      project_category: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'categories',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      project_duration_max: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      project_duration_min: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      project_sub_category: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      project_summary: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      project_title: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      project_amount_min: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      project_amount_max: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      technologty_pre: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      client_project_link: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      type_of_project: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      currency_symbol: {
        type: Sequelize.STRING,
        defaultValue: '₹',
      },
      currency_type: {
        type: Sequelize.STRING,
        defaultValue: 'INR',
      },
      approved_by_admin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      is_published: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      created_by_admin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      generated_by_ai: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      location_preferancer: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable('client_projects');
  },
};

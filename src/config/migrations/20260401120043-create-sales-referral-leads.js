'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('sales_referral_leads', {
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
        onDelete: 'SET NULL',
      },
      company_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      contact_person: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      designation: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      email_address: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      mobile_number: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      country: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      state: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      city: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      website_address: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      customer_industry_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'industries',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      customer_industry: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      requirement_details: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      has_spoken_to_customer: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      commission_type: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      expected_commission_value: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: 'pending',
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
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('sales_referral_leads');
  },
};

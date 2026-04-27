'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('email_domain_analysis', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      domain: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      website: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      business_description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      business_nature: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      business_model: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      key_products: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      special_category_1: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      special_category_2: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      special_category_3: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING(50),
        allowNull: true,
        defaultValue: 'pending',
      },
      error_message: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      batch_id: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      neverbounce_status: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      neverbounce_result: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      validation_date: {
        type: Sequelize.DATE,
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

    await queryInterface.addIndex('email_domain_analysis', ['email'], { name: 'idx_email' });
    await queryInterface.addIndex('email_domain_analysis', ['domain'], { name: 'idx_domain' });
    await queryInterface.addIndex('email_domain_analysis', ['batch_id'], { name: 'idx_batch_id' });
    await queryInterface.addIndex('email_domain_analysis', ['status'], { name: 'idx_status' });
    await queryInterface.addIndex('email_domain_analysis', ['name'], { name: 'idx_name' });
    await queryInterface.addIndex('email_domain_analysis', ['special_category_1'], { name: 'idx_special_category_1' });
    await queryInterface.addIndex('email_domain_analysis', ['special_category_2'], { name: 'idx_special_category_2' });
    await queryInterface.addIndex('email_domain_analysis', ['special_category_3'], { name: 'idx_special_category_3' });
    await queryInterface.addIndex('email_domain_analysis', [{ name: 'neverbounce_result', length: 191 }], { name: 'idx_neverbounce_result' });
    await queryInterface.addIndex('email_domain_analysis', ['email', 'batch_id'], { unique: true, name: 'unique_email_batch' });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('email_domain_analysis');
  },
};

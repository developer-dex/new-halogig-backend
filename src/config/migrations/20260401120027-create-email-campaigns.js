'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('email_campaigns', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      batch_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      campaign_id: {
        type: Sequelize.STRING(36),
        allowNull: false,
        references: {
          model: 'campaign_batches',
          key: 'campaign_id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      recipient_email: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      recipient_domain: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      recipient_business_name: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      recipient_business_description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      recipient_business_nature: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      html_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      template_type: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      special_category_type: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      special_category_value: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      category_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      category_name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      sub_category_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      sub_category_name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      slug_url: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      full_slug_url: {
        type: Sequelize.STRING(1000),
        allowNull: true,
      },
      email_subject: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      email_html_content: {
        type: Sequelize.TEXT('long'),
        allowNull: true,
      },
      sendgrid_message_id: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      sendgrid_status: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      sendgrid_response: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING(50),
        allowNull: true,
        defaultValue: 'pending',
      },
      generation_attempts: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      validation_attempts: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      send_attempts: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      error_message: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      last_error_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      html_generated_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      html_validated_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      sent_at: {
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

    await queryInterface.addIndex('email_campaigns', ['campaign_id'], { name: 'idx_campaign_id' });
    await queryInterface.addIndex('email_campaigns', ['batch_name'], { name: 'idx_batch_name' });
    await queryInterface.addIndex('email_campaigns', ['recipient_email'], { name: 'idx_recipient_email' });
    await queryInterface.addIndex('email_campaigns', ['status'], { name: 'idx_status' });
    await queryInterface.addIndex('email_campaigns', ['category_name'], { name: 'idx_category_name' });
    await queryInterface.addIndex('email_campaigns', ['special_category_value'], { name: 'idx_special_category_value' });
    await queryInterface.addIndex('email_campaigns', ['created_at'], { name: 'idx_created_at' });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('email_campaigns');
  },
};

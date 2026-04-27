'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('client_billing_details', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      billing_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      billing_address: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      billing_email: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      billing_contact_number: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      gst_number: {
        type: Sequelize.STRING(15),
        allowNull: true,
      },
      gst_exemted_file: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      want_to_add_gst_number: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      want_to_add_gst_exempted_file: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      billing_state: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      billing_country: {
        type: Sequelize.STRING(255),
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
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('client_billing_details');
  },
};

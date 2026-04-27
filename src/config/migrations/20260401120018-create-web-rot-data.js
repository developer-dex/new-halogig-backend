'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('web_rot_data', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      service_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      service_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      slug_link: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      industry: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      batch_no: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      service_list: {
        type: Sequelize.TEXT('long'),
        allowNull: true,
      },
      main_application_list: {
        type: Sequelize.TEXT('long'),
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'inactive',
      },
    });

    await queryInterface.addIndex('web_rot_data', ['service_id', 'industry', 'batch_no'], { unique: true, name: 'uq_service_industry_batch' });
    await queryInterface.addIndex('web_rot_data', ['service_id'], { name: 'idx_service_id' });
    await queryInterface.addIndex('web_rot_data', ['industry'], { name: 'idx_industry' });
    await queryInterface.addIndex('web_rot_data', ['batch_no'], { name: 'idx_batch_no' });
    await queryInterface.addIndex('web_rot_data', ['status'], { name: 'idx_status' });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('web_rot_data');
  },
};

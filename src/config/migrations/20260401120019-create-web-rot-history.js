'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('web_rot_history', {
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
      industry: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      current_batch: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'batch_1',
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.addIndex('web_rot_history', ['service_id', 'industry'], { unique: true, name: 'uq_service_industry' });
    await queryInterface.addIndex('web_rot_history', ['service_id'], { name: 'idx_service_id' });
    await queryInterface.addIndex('web_rot_history', ['industry'], { name: 'idx_industry' });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('web_rot_history');
  },
};

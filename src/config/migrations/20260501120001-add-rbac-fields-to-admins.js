'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('admins', 'permissions', {
      type: Sequelize.JSON,
      allowNull: true,
      comment: 'RBAC permissions JSON map: moduleKey -> {view,create,edit,delete}',
    });

    await queryInterface.addColumn('admins', 'permissions_version', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: 'Incremented when permissions change (cache invalidation)',
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('admins', 'permissions');
    await queryInterface.removeColumn('admins', 'permissions_version');
  },
};

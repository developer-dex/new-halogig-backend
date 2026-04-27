module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('project_bids', 'is_dispute', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Whether this bid has an active or raised dispute',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('project_bids', 'is_dispute');
  },
};

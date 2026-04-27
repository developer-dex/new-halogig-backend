module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('disputes', 'type', {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'Dispute kind (e.g. change_freelancer, refund)',
      after: 'status',
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('disputes', 'type');
  },
};

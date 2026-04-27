module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('halogig_testimonials', 'status', {
      type: Sequelize.STRING(50),
      allowNull: false,
      defaultValue: 'pending',
      comment: 'Testimonial status (pending, approved, rejected)',
      after: 'created_by',
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('halogig_testimonials', 'status');
  },
};

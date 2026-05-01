'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add gateway routing column so we can finalize transactions deterministically
    await queryInterface.addColumn('transactions', 'gateway', {
      type: Sequelize.STRING(20),
      allowNull: false,
      defaultValue: 'razorpay',
      comment: 'Payment gateway used for this transaction',
    });

    // Optional idempotency aid for webhook providers
    await queryInterface.addColumn('transactions', 'provider_event_id', {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: 'Provider webhook/event id for idempotency',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('transactions', 'provider_event_id');
    await queryInterface.removeColumn('transactions', 'gateway');
  },
};

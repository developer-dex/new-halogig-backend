module.exports = {
  up: async (queryInterface) => {
    // Remove receiver_admin_id to make notifications global for all admins
    // Drop old index (if it exists) before removing the column.
    try {
      await queryInterface.removeIndex('admin_notifications', 'idx_admin_notifications_receiver_seen_created');
    } catch (_) {
      // ignore if index does not exist
    }

    // Remove receiver_admin_id column (and its FK) so notifications are generic for all admins.
    await queryInterface.removeColumn('admin_notifications', 'receiver_admin_id');

    // Add a new index for common queries (unread + newest first).
    await queryInterface.addIndex('admin_notifications', ['is_seen', 'created_at'], {
      name: 'idx_admin_notifications_seen_created',
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revert to per-admin receiver notifications
    try {
      await queryInterface.removeIndex('admin_notifications', 'idx_admin_notifications_seen_created');
    } catch (_) {
      // ignore
    }

    await queryInterface.addColumn('admin_notifications', 'receiver_admin_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'admins',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      comment: 'Recipient admin id',
    });

    await queryInterface.addIndex('admin_notifications', ['receiver_admin_id', 'is_seen', 'created_at'], {
      name: 'idx_admin_notifications_receiver_seen_created',
    });
  },
};

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('admin_notifications', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      notification_type: {
        type: Sequelize.STRING(100),
        allowNull: false,
        comment: 'Logical type key (typically matches IN_APP_NOTIFICATION_TYPE constants)',
      },
      sender_user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        comment: 'users.id who triggered the event; null for system/cron',
      },
      receiver_admin_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'admins',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        comment: 'Recipient admin id',
      },
      title: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      url: {
        type: Sequelize.STRING(2048),
        allowNull: true,
        comment: 'Optional deep link or admin route',
      },
      is_seen: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.addIndex('admin_notifications', ['receiver_admin_id', 'is_seen', 'created_at'], {
      name: 'idx_admin_notifications_receiver_seen_created',
    });

    await queryInterface.addIndex('admin_notifications', ['sender_user_id'], {
      name: 'idx_admin_notifications_sender_user_id',
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('admin_notifications');
  },
};

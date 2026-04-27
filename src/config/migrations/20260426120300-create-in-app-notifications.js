module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('in_app_notifications', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      notification_type: {
        type: Sequelize.STRING(100),
        allowNull: false,
        comment: 'Logical type key (matches IN_APP_NOTIFICATION_TYPE constants)',
      },
      sender_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        comment: 'users.id who triggered the event; null for admin/system/cron (not admins.id)',
      },
      receiver_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        comment: 'Recipient user',
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
        comment: 'Optional deep link or route',
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

    await queryInterface.addIndex('in_app_notifications', ['receiver_id', 'is_seen', 'created_at'], {
      name: 'idx_in_app_notifications_receiver_seen_created',
    });

    await queryInterface.addIndex('in_app_notifications', ['sender_id'], {
      name: 'idx_in_app_notifications_sender_id',
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('in_app_notifications');
  },
};

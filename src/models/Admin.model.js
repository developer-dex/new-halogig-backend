module.exports = (sequelize, DataTypes) => {
  const Admin = sequelize.define('Admin', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    first_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'Admin first name',
    },
    last_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'Admin last name',
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      comment: 'Admin email address',
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'Encrypted password',
    },
    role: {
      type: DataTypes.ENUM('super_admin', 'admin', 'moderator'),
      allowNull: false,
      defaultValue: 'admin',
      comment: 'Admin role/permission level',
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'suspended'),
      allowNull: false,
      defaultValue: 'active',
      comment: 'Admin account status',
    },
    last_login: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Last login timestamp',
    },
    last_login_ip: {
      type: DataTypes.STRING(45),
      allowNull: true,
      comment: 'Last login IP address',
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Admin ID who created this admin account',
    },
    socket_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Socket.IO connection ID for real-time messaging',
    },
    otp: {
      type: DataTypes.STRING(6),
      allowNull: true,
      comment: 'One-time password for 2FA',
    },
    otp_expiry: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'OTP expiration timestamp',
    },
    permissions: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'RBAC permissions JSON map: moduleKey -> {view,create,edit,delete}',
    },
    permissions_version: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: 'Incremented when permissions change (cache invalidation)',
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'admins',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        name: 'idx_admin_email',
        fields: ['email'],
        unique: true,
      },
      {
        name: 'idx_admin_status',
        fields: ['status'],
      },
      {
        name: 'idx_admin_role',
        fields: ['role'],
      },
    ],
  });

  Admin.associate = (models) => {
    // Self-association for created_by
    Admin.belongsTo(models.Admin, {
      foreignKey: 'created_by',
      as: 'creator',
    });

    // Association with ChatRooms (for group chats only)
    Admin.hasMany(models.ChatRoom, {
      foreignKey: 'created_by',
      as: 'createdChatRooms',
      constraints: false, // No foreign key constraint for polymorphic association
    });
  };

  return Admin;
};

module.exports = (sequelize, DataTypes) => {
  const Token = sequelize.define('Token', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'Service category (e.g., linkedin, google, etc.)',
    },
    access_token: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'OAuth access token (encrypted)',
    },
    refresh_token: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'OAuth refresh token (encrypted)',
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'OAuth access token expiry datetime',
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Flag to enable/disable LinkedIn posting functionality',
    },
  }, {
    underscored: true,
    tableName: 'tokens',
  });

  Token.associate = () => {
    // No associations needed
  };

  return Token;
};

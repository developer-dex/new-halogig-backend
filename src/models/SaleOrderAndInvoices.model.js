module.exports = (sequelize, DataTypes) => {
  const SaleOrderAndInvoices = sequelize.define(
    'SaleOrderAndInvoices',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      milestone_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'project_bid_milestones',
          key: 'id',
        },
      },
      project_bid_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'project_bids',
          key: 'id',
        },
      },
      file: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      file_type: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      client_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      freelancer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      json_details: {
        type: DataTypes.JSON,
        allowNull: true,
      },
    },
    {
      tableName: 'sale_order_and_invoices',
      underscored: true,
      timestamps: true,
    },
  );

  SaleOrderAndInvoices.associate = (models) => {
    SaleOrderAndInvoices.belongsTo(models.ProjectBidMilestone, {
      foreignKey: 'milestone_id',
      as: 'milestone',
    });

    SaleOrderAndInvoices.belongsTo(models.ProjectBid, {
      foreignKey: 'project_bid_id',
      as: 'projectBid',
    });

    SaleOrderAndInvoices.belongsTo(models.User, {
      foreignKey: 'client_id',
      as: 'client',
    });

    SaleOrderAndInvoices.belongsTo(models.User, {
      foreignKey: 'freelancer_id',
      as: 'freelancer',
    });
  };

  return SaleOrderAndInvoices;
};

module.exports = (sequelize, DataTypes) => {
  const GeneratedBill = sequelize.define('GeneratedBill', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      comment: 'Primary key for the generated bill',
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'User ID for the generated bill',
    },
    projectbid_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Project bid ID for the generated bill',
    },
    bill_number: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Bill number for the generated bill',
    },
    bill_date: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: 'Bill date for the generated bill',
    },
    bill_amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      comment: 'Bill amount for the generated bill',
    },
    bill_status: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Bill status for the generated bill',
    },
    bill_type: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Bill type for the generated bill',
    },
    client_billing_details: {
      type: DataTypes.JSON,
      allowNull: false,
      comment: 'Client billing details for the generated bill',
    },
    project_bid_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Project bid ID for the generated bill',
    },
    milestone_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Milestone ID for the generated bill',
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: 'Created at for the generated bill',
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: 'Updated at for the generated bill',
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Deleted at for the generated bill',
    },
    is_gst_applied: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      comment: 'Whether GST has been applied to the generated bill',
    },
    igst_amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      comment: 'IGST amount for the generated bill',
    },
    sgst_amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      comment: 'SGST amount for the generated bill',
    },
    cgst_amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      comment: 'CGST amount for the generated bill',
    },
    total_amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      comment: 'Total amount for the generated bill',
    },
  });
  return GeneratedBill;
};

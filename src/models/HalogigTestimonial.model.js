module.exports = (sequelize, DataTypes) => {
  const HalogigTestimonial = sequelize.define('HalogigTestimonial', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    client_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'Name of the client who gave the testimonial',
    },
    client_designation: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Designation/position of the client',
    },
    client_company_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Company name of the client',
    },
    testimonial_comment: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'The testimonial comment/text',
    },
    created_by: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Name or identifier of who created this testimonial',
    },
  }, {
    underscored: true,
    tableName: 'halogig_testimonials',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  return HalogigTestimonial;
};

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    token: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    mobile: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    mobile_country_code: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    permissions: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    last_login: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    first_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    middle_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    last_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    username: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    resume_file: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    company_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    experience: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    key_skills: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    gender: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    dob: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    doi: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    pseudoName: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    govtID: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    idProofNo: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    gst_number: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    pan_card_no: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    pic: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    postal: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    provider: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    provider_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    registration_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    referral_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    freelancer_referral: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    provider_as: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    first_time: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    anonymous: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    aboutme: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    rating: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: true,
    },
    designation: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    interested: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    wanttofill: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    register_as: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    user_agent: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    welcome_msg: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    last_login_ip: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    mail_subscribe: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    otp: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    role: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    reminder: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    socket_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Socket.IO connection ID for real-time communication',
    },
    profile_image: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    is_profile_published: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_by_admin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    welcome_email_sent: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    user_last_path: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    max_proposal_value: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    max_delivery_in_progress: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    source: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'OAuth provider source: google, linkedin, or facebook',
    },
    signup_type: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'Signup source: google, linkedin, facebook, or email/password',
    },
    view_by_admin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    client_last_login: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    freelancer_last_login: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    is_referral_partner: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  }, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  });

  User.associate = (models) => {
    User.hasMany(models.ProfessionalDetail, {
      foreignKey: 'userId', onDelete: 'cascade',
    });
    User.hasMany(models.Certificate, {
      foreignKey: 'userId', onDelete: 'cascade',
    });
    User.hasMany(models.Education, {
      foreignKey: 'userId', onDelete: 'cascade',
    });
    User.hasMany(models.Project, {
      foreignKey: 'user_id',
      onDelete: 'cascade',
    });
    User.hasMany(models.ClientProject, {
      foreignKey: 'posted_by_user_id',
    });
    User.hasMany(models.ProjectDetail, {
      foreignKey: 'userId',
    });
    // One-to-One relationship: Each user has one billing detail
    User.hasOne(models.ClientBillingDetails, {
      foreignKey: 'user_id',
      as: 'billingDetails',
      onDelete: 'CASCADE',
    });
    // One-to-Many relationship: Each user can have multiple country preferences
    User.hasMany(models.FreelancerCurrentCountryPreference, {
      foreignKey: 'user_id',
      as: 'countryPreferences',
      onDelete: 'CASCADE',
    });
    // Many-to-many relationship with SubCategory through junction table
    User.belongsToMany(models.SubCategory, {
      through: models.ProfessionalDetailSubCategory,
      foreignKey: 'userId',
      otherKey: 'sub_category_id',
      as: 'subCategories',
    });
    User.hasMany(models.ProfessionalDetailSubCategory, {
      foreignKey: 'userId',
      as: 'professionalDetailSubCategories',
    });
    // Has many disputes where user raised the dispute
    User.hasMany(models.Dispute, {
      foreignKey: 'dispute_by',
      as: 'disputesRaised',
      onDelete: 'CASCADE',
    });
    // Has many disputes where user is the one being disputed
    User.hasMany(models.Dispute, {
      foreignKey: 'dispute_for',
      as: 'disputesAgainst',
      onDelete: 'CASCADE',
    });
    // One-to-One relationship: Each user has one profile complete reminder
    User.hasOne(models.ProfileCompleteReminder, {
      foreignKey: 'user_id',
      as: 'ProfileCompleteReminder',
      onDelete: 'CASCADE',
    });
  };

  return User;
};

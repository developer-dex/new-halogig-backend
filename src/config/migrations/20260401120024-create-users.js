'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      token: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      mobile: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      mobile_country_code: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      permissions: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      last_login: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      first_name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      middle_name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      last_name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      username: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      resume_file: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      company_name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      experience: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      key_skills: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      bio: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      gender: {
        type: Sequelize.STRING(10),
        allowNull: true,
      },
      dob: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      doi: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      pseudoName: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      govtID: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      idProofNo: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      gst_number: {
        type: Sequelize.STRING(15),
        allowNull: true,
      },
      pan_card_no: {
        type: Sequelize.STRING(15),
        allowNull: true,
      },
      pic: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      country: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      state: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      city: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      address: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      postal: {
        type: Sequelize.STRING(10),
        allowNull: true,
      },
      provider: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      provider_id: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      registration_id: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      referral_id: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      freelancer_referral: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      provider_as: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      first_time: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      anonymous: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      aboutme: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      rating: {
        type: Sequelize.DECIMAL(3, 2),
        allowNull: true,
      },
      designation: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      interested: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      wanttofill: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      register_as: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      user_agent: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      welcome_msg: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      last_login_ip: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      mail_subscribe: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      otp: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      role: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      reminder: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      socket_id: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      profile_image: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      is_profile_published: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      created_by_admin: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      welcome_email_sent: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      user_last_path: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      max_proposal_value: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      max_delivery_in_progress: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      source: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      signup_type: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      view_by_admin: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      client_last_login: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      freelancer_last_login: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      is_referral_partner: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('users');
  },
};

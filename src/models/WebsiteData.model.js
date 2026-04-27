module.exports = (sequelize, DataTypes) => {
  const WebsiteData = sequelize.define('WebsiteData', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    category_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    service_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    slug_link: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    primary_keyword: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    secondary_keyword: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    banner_title: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    banner_description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    service_title: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    service_description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    service_lists: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'JSON array of service objects',
    },
    industry_title: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    industry_lists: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    main_application_title: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    main_application_description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    main_application_lists: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'JSON array of main application objects',
    },
    interlink_pages: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'JSON array of interlink page objects',
    },
    usercase_listes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    meta_title: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    meta_description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    is_publish: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Whether the website data is published or not',
    },
    order: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'JSON field for order data',
    },
    video_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: null,
      comment: 'Optional URL of the main video for this page',
    },
    video_thumbnail_path: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: null,
      comment: 'Optional path/URL to the video thumbnail image',
    },
    video_title: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: null,
      comment: 'Optional title for the video',
    },
    video_description: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
      comment: 'Optional description for the video',
    },
  }, {
    tableName: 'website_data',
    underscored: true,
    indexes: [
      {
        fields: ['category_name'],
      },
      {
        fields: ['service_name'],
      },
      {
        fields: ['slug_link'],
      },
      {
        fields: ['is_publish'],
      },
    ],
  });

  return WebsiteData;
};

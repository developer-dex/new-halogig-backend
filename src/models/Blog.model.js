module.exports = (sequelize, DataTypes) => {
  const Blog = sequelize.define('Blog', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    image_path: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Path to the blog image',
    },
    thumbnail_image: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Path to the blog thumbnail image',
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Title of the blog',
    },
    blog_slug: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'URL-friendly slug for the blog',
    },
    content: {
      type: DataTypes.TEXT('long'),
      allowNull: true,
      comment: 'Content of the blog',
    },
    relevant_blogs: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
      comment: 'Array of relevant blog IDs',
    },
    time_to_read: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Estimated time to read the blog',
    },
  }, {
    tableName: 'blogs',
    timestamps: true,
    indexes: [
      {
        fields: ['title'],
      },
      {
        fields: ['blog_slug'],
      },
      {
        fields: ['createdAt'],
      },
    ],
  });

  return Blog;
};

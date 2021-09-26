const { Post } = require('../models');

const postData = [
  {
    title: 'Sequelize Data Types',
    post_text: 'Sequelize has several built in, handy data types that you can use when you define a model.  The most commonly used for simple databases are INTEGER and STRING.',
    user_id: 1,
  },
  {
    title: 'Handlebars Template Engine',
    post_text: 'Handlebars is a very useful npm package that allows you to use templates in your code, making things more modular, re-usable, and maintainable.  For instance, you can set up a layout used for several pages with templates for a home page and a user dashboard.',
    user_id: 2,
  },
  {
    title: 'Handlebars Partials',
    post_text: 'Partials are another handlebars feature where you can create a partial bit of code for something like post information, or for a comment. You can then use that partial whenever that bit of information is needed for your website.',
    user_id: 2,
  },
  {
    title: 'Sessions',
    post_text: 'When a user logs in, a session can be established using a package such as Express Session. A cookie will be saved on the user computer, authenticating them on the website. Cookies can be set for a limited time or indefinitely.',
    user_id: 3,
  }
];

const seedPosts = () => Post.bulkCreate(postData);

module.exports = seedPosts;
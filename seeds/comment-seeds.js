const { Comment } = require('../models');

const commentData = [
  {
    comment_text: "Wow!",
    post_id: 3,
    user_id: 1
  },
  {
    comment_text: "Yes, this is good",
    post_id: 1,
    user_id: 2
  },
  {
    comment_text: "Ah, what a post!",
    post_id: 3,
    user_id: 2
  }
];

const seedComments = () => Comment.bulkCreate(commentData);

module.exports = seedComments;
const { User } = require('../models');

const userData = [
  {
    username: 'Carol',
    password: 'password1234'

},
{
    username: 'Dave',
    password: 'password1234'
},
{
    username: 'Gary',
    password: 'password1234'
}
];

const seedUsers = () => User.bulkCreate(userData);

module.exports = seedUsers;
//  WARNING seed bulk create does NOT hash the password, so they must be hashed via the update route before the login route will work!

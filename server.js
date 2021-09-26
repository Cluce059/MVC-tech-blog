const express = require('express');
const routes = require('./controllers');
const sequelize = require('./config/connection');
const path = require('path');
const helpers = require('./utils/helpers');
const exphbs = require('express-handlebars');
require('dotenv').config();
// init handlebars for html templates
const hbs = exphbs.create({ helpers });
// Express session for session cookies
const session = require('express-session');
// init server
const app = express();
const PORT = process.env.PORT || 3001;
// Sequelize store session
const SequelizeStore = require('connect-session-sequelize')(session.Store);

// init sessions
const sess = {
    secret: 'super super secret',
    //process.env.SESSION_SECRET
    cookie: {},
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
      db: sequelize
    })
  };

  app.use(session(sess));
//express parses json and string data
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
// path to public directory for static files
  app.use(express.static(path.join(__dirname, 'public')));
  app.engine('handlebars', hbs.engine);
  app.set('view engine', 'handlebars');
  //path to routes for server
  app.use(routes);

// turn on connection to db and then to server
// force: true to reset the database and clear all values, updating any new relationships
// force: false to maintain data - aka normal operation
sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log(`Now listening at http://localhost:${PORT}`));
});
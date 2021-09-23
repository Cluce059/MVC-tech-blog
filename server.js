const path = require('path');
require('dotenv').config();
const express = require('express');
const routes = require('./controllers/');
const sequelize = require('./config/connection');
const exphbs = require('express-handlebars')
// Express session for session cookies
const session = require('express-session')
// Sequelize store session
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const helpers = require('./utils/helpers/helper');


// init handlebars for html templates
const hbs = exphbs.create({ helpers });

// init sessions
const sess = {
    secret: 'Super secret secret',
    cookie: { maxAge: 7200000 },
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
      db: sequelize
    })
  };

// init server
const app = express();
const PORT = process.env.PORT || 3001;

// path to public directory for static files
app.use(express.static(path.join(__dirname, 'public')));

//handlebars is template engine for the server
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

//express parses json and string data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//use express-session for session handling
app.use(session(sess));

//path to routes for server
app.use(routes);

// turn on connection to db and then to server
// force: true to reset the database and clear all values, updating any new relationships
// force: false to maintain data - aka normal operation
sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log('Now listening'));
  });
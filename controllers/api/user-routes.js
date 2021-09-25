const router = require('express').Router();
const { User } = require('../../models');

//GET users
router.get('/', (req, res) => {
  // Access our User model and run .findAll() method)
  User.findAll({
    attributes: { exclude: ['password'] }
  })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

//GET usersby id
router.get('/:id', (req, res) => {
  User.findOne({
    attributes: { exclude: ['password'] },
    where: {
      id: req.params.id
    }
  })
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({ message: 'No user found with this id' });
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

//POST users
// POST /api/users
router.post('/', (req, res) => {
  /* expects 
{
      "username": "Carol", 
      "email": "carol@gmail.com",
      "password": "password1234"
    }
*/
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password  
  })
    .then(dbUserData => {
      req.session.save(() => {
        req.session.user_id = dbUserData.id;
        req.session.username = dbUserData.username;
        req.session.loggedIn = true;
    
        res.json(dbUserData);
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

//login route
router.post('/login', (req, res) => {
  User.findOne({
    where: {
      email: req.body.email
    }
  }).then(dbUserData => {
    if (!dbUserData) {
      res.status(400).json({ message: 'No user with that email address!' });
      return;
    }

    const validPassword = dbUserData.checkPassword(req.body.password);

    if (!validPassword) {
      res.status(400).json({ message: 'Incorrect password!' });
      return;
    }

    req.session.save(() => {
      // declare session variables
      req.session.user_id = dbUserData.id;
      req.session.username = dbUserData.username;
      req.session.loggedIn = true;

      res.json({ user: dbUserData, message: 'You are now logged in!' });
    });
  });
});

router.put('/:id', (req, res) => {
  User.update(req.body, {
    individualHooks: true,
    where: {
      id: req.params.id
    }
  })
    .then(dbUserData => {
      if (!dbUserData[0]) {
        res.status(404).json({ message: 'This user ID does not exist!' });
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.delete('/:id', (req, res) => {
  User.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({ message: 'his user ID does not exist!' });
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

//logout, destroy session
router.post('/logout', (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  }
  else {
    res.status(404).end();
  }
});


module.exports = router;
/*

const router = require('express').Router();
const { User, Post, Comment } = require('../../models');
const session = require('express-session');
const withAuth = require('../../utils/auth');

// /api/users 
router.get('/', (req, res) => {
  User.findAll({
      attributes: { exclude: ['password'] }
  })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

///api/users/1 
router.get('/:id', (req, res) => {
  User.findOne({
    attributes: { exclude: ['password'] },
    where: {
      id: req.params.id
    },
    // include the posts the user has created, the posts the user has commented on, and the posts the user has upvoted
    include: [
      {
        model: Post,
        attributes: ['id', 'title', 'post_text', 'created_at']
      },
      {
          model: Comment,
          attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
          include: {
              model: Post,
              attributes: ['title']
          }
      }
    ]
  })
    .then(dbUserData => {
      if (!dbUserData) {
        // if no user is found, return an error
        res.status(404).json({ message: 'No user found with this id' });
        return;
      }
      // otherwise, return the data for the requested user
      res.json(dbUserData);
    })
    .catch(err => {
      // if there is a server error, return that error
      console.log(err);
      res.status(500).json(err);
    });
});

// POST /api/users -- add a new user
router.post('/', (req, res) => {
// create method
// expects an object in the form {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}
User.create({
  username: req.body.username,
  email: req.body.email,
  password: req.body.password
})
  // send the user data back to the client as confirmation and save the session
  .then(dbUserData => {
    req.session.save(() => {
      req.session.user_id = dbUserData.id;
      req.session.username = dbUserData.username;
      req.session.loggedIn = true;
  
      res.json(dbUserData);
    });
  })
  // if there is a server error, return that error
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

// POST /api/users/login -- login route for a user
router.post('/login',  (req, res) => {
  User.findOne({
      where: {
      email: req.body.email
      }
  }).then(dbUserData => {
      if (!dbUserData) {
      res.status(400).json({ message: 'No user with that email address!' });
      return;
      }
      const validPassword = dbUserData.checkPassword(req.body.password);
      if (!validPassword) {
          res.status(400).json({ message: 'Incorrect password!' });
          return;
      }
      // otherwise, save the session, and return the user object and a success message
      req.session.save(() => {
        // declare session variables
        req.session.user_id = dbUserData.id;
        req.session.username = dbUserData.username;
        req.session.loggedIn = true;
  
        res.json({ user: dbUserData, message: 'You are now logged in!' });
      });
  });  
});

// POST /api/users/logout 
router.post('/logout', withAuth, (req, res) => {
if (req.session.loggedIn) {
  req.session.destroy(() => {
    // 204 status  =  that a request has succeeded but client does not need to go to a different page
      // 200 = success and that a newly updated page should be loaded
      //201 is for a resource being created
    res.status(204).end();
  });
} else {
  res.status(404).end();
}
})

// PUT /api/users/1 
router.put('/:id', withAuth, (req, res) => {

  User.update(req.body, {
      individualHooks: true,
      where: {
          id: req.params.id
      }
  })
    .then(dbUserData => {
      if (!dbUserData[0]) {
        res.status(404).json({ message: 'No user found with this id' });
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
})

// DELETE /api/users/1 
router.delete('/:id', withAuth, (req, res) => {
  User.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({ message: 'No user found with this id' });
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});


module.exports = router;
*/
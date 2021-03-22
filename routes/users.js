var express = require('express');
const bodyParser = require('body-parser');
var User = require('../models/users');
var passport = require('passport');
var authenticate = require('../authenticate');

var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// for passport we expect auth info to be in request body
/*
So, even with the JsonWebToken to issue the JsonWebToken, you first need to authenticate the user using one of the other strategies, 
and if you're going to be using the local strategy first, we will authenticate the user using the username and password. 
Once the user is authenticated with the username and password, then we will issue the token to the user saying, "Okay, you are a valid user, I'm going to give you the token". 
All of the subsequent requests will simply carry the token in the header of the incoming request message. 
=> BUT this time no sessions are used
*/

router.post('/signup', (req, res, next) => {
  User.register(new User({username: req.body.username}), 
  req.body.password, (err, user) => {
    if(err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});
    }
    else {
      if (req.body.firstname)
        user.firstname = req.body.firstname;
      if (req.body.firstname)
        user.lastname = req.body.lastname;
      user.save((err, user) => {
        if (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({err: err});
          return ;
        }
        passport.authenticate('local')(req, res, () => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: true, status: 'Registration Successful!'});
        });
      });      
    }
  });    
});

router.post('/login', passport.authenticate('local'), (req, 
  res) => {
  // first calls .authenticate, if it is successful check for req and res

  var token = authenticate.getToken({_id: req.user._id}) // create token by setting id as payload
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, token: token, status: 'You are successfully logged in!'});
})

router.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});

module.exports = router;

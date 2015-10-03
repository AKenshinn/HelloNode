module.exports = function(app, passport) {

  // index
  app.get('/', function(req, res) {
    res.render('index',{title:'Node Authentication'}); // load the index.ejs file
  });

  // home
  app.get('/home', isLoggedIn, function(req, res) {
    res.render('home', { title: 'Home Page'} );
  });

  // login form
  app.get('/login', function(req, res) {
    // call logout before login
    req.logout();
    // render the page and pass in any flash data if it exists
    res.render('login', { title: 'Login', message: req.flash('loginMessage') });
  });

  // authentication
  app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
    }),
        function(req, res) {
            console.log("hello");
            
            if (req.body.remember) {
              req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
              req.session.cookie.expires = false;
            }
        res.redirect('/');
    });

  // signup form
  app.get('/signup', function(req, res) {
    // render the page and pass in any flash data if it exists
    res.render('signup', { title: 'Signup', message: req.flash('signupMessage') });
  });

  // signup account
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/signup', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));

  // profile
  app.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile', {
      title: 'Profile', 
      user : req.user, // get the user out of session and pass to template
    });
  });

  // logout
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });
};

// checklogin
function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();

  // if they aren't redirect them to the home page
  res.redirect('/');
}

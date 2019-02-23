module.exports = {
  protectedRoute: (req, res, next) => {
    if (req.session.currentUser) {
      next();
    } else {
      res.redirect('/login');
    }
  },
  anonRoute: (req, res, next) => {
    if (req.session.currentUser) {
      res.redirect('/moves');
    } else {
      next();
    }
  },
  checkRole: (role) => {
    return (req, res, next) => {
      if (req.session.currentUser.role === role) {
        next();
      } else {
        res.redirect('login');
      }
    };
  },
  notifications: (req, res, next) => {
    // We extract the messages separately cause we call req.flash() we'll clean the object flash.
    res.locals.errorMessages = req.flash('error');
    res.locals.infoMessages = req.flash('info');
    res.locals.dangerMessages = req.flash('danger');
    res.locals.successMessages = req.flash('success');
    res.locals.warningMessages = req.flash('warning');
    next();
  },
};

exports.isAuth = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        res.redirect('/user/login')
    }
    next();
}

exports.isDriver = (req, res, next) => {
    if (!req.session.isDriver) {
        res.json('You are not authorized')
    }
    next();
}
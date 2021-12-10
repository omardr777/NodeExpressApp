const bcrypt = require('bcryptjs');
const User = require('../models/user');
const flashMessage = require('../middleware/flashMessage');
const Request = require('../models/requests')
const crypto = require('crypto');
const { validationResult } = require('express-validator')

exports.getSignup = (req, res, next) => {

    let message = flashMessage.errorMessage(req)
    res.render('auth/signup',
        {
            pageTitle: 'SingUp',
            path: '/signup',
            errorMessage: message,
            oldInputs: {
                email: '',
                name: ''
            }
        });
}

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    let isDriver = req.body.driver;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('auth/signup', {
            path: '/signup',
            pageTitle: 'Signup',
            errorMessage: errors.array()[0].msg,
            oldInputs: { email: email, name: name },
            validationErrors: errors.array()
        });
    }
    if (!isDriver) {
        isDriver = false;
    }
    User.findOne({ email: email })
        .then(used => {
            if (used) {
                console.log(used)
                req.flash("error", 'email is already used')
                return res.redirect("/user/signup")
            }
            bcrypt.hash(password, 12).
                then(hashedPassword => {
                    User.create({
                        email: email,
                        name: name,
                        password: hashedPassword,
                        driver: isDriver
                    })
                        .then(result => {
                            if (result) {
                                console.log(result)
                                res.redirect('/user/login')
                            } else {

                                res.redirect("/user/signup")
                            }
                        })
                })

        })
        .catch(err => console.log(err))
}

exports.getLogin = (req, res, next) => {
    let message = flashMessage.errorMessage(req)
    res.render('auth/login', {
        pageTitle: 'Login',
        path: '/login',
        errorMessage: message,
        oldInputs: { email: '' }
    })
}

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log('fuck')
        return res.status(422).render('auth/login', {
            path: '/login',
            pageTitle: 'Login',
            errorMessage: errors.array()[0].msg,
            oldInputs: { email: email }
        });
    }

    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                req.flash('error', 'invalid email or password')
                return res.redirect('/user/login')
            }
            bcrypt.compare(password, user.password).then(isMatch => {
                if (isMatch) {
                    req.session.isLoggedIn = true;
                    if (user.driver)
                        req.session.isDriver = true;
                    else
                        req.session.isDriver = false;
                    req.session.user = user;
                    return res.redirect('/')
                }
                else {
                    req.flash('error', 'invalid email or password');
                    res.redirect('/user/login')
                }
            });
        }).catch(err => console.log(err))
}

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect('/');
    });
}

exports.getUserData = (req, res, next) => {
    let userId;
    let isDriver;
    if (req.user) {
        userId = req.user._id;
        isDriver = req.user.driver;
    }
    else
        res.send("You are not authenticated")

    if (!isDriver)
        Request.find({ status: 'Accepted', userId: userId })
            .populate('dateId')
            .then(requests => {
                res.json({ success: true, test: requests, driver: false })
            }).catch(err => console.log(err))
    else
        User.findById(userId)
            .populate({ path: 'requests', model: 'Request', populate: { path: 'dateId', medel: 'Date' } })
            .then(user => {
                let requests = user.requests.filter(i => {
                    return i.status == 'Accepted'
                })
                res.json({ success: true, test: requests, driver: true })
            })
}

exports.getResetPassword = (req, res, next) => {
    let message = flashMessage.errorMessage(req);
    res.render('auth/reset', {
        pageTitle: 'Reset Password',
        path: '/restt',
        errorMessage: message
    })
}

exports.postResetPassword = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            return res.redirect('/user/reset');
        }
        const token = buffer.toString('hex');

        User.findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    req.flash("error", 'no account with that email');
                    return res.redirect('/user/reset')
                }
                console.log("found this user with that email", user)
                user.resetToken = token;
                user.tokenExpreation = Date.now() + 100000;
                user.f = 'fuck';
                return user.save()
            }).then((result) => {

                console.log(`http://${req.hostname}/user/reset/${token}`);
                res.redirect('/')
            });
    })

}

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;
    User.findOne(
        {
            resetToken: token,
            tokenExpreation: { $gt: Date.now() }
        })
        .then(user => {
            let message = req.flash('error');
            if (message.length > 0) {
                message = message[0];
            } else {
                message = null;
            }
            res.render('auth/new-password', {
                path: '/reset',
                pageTitle: 'Reset',
                errorMessage: message,
                userId: user._id.toString(),
                passwordToken: token
            })
        }).catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })

}

exports.postNewPassword = (req, res, next) => {
    const userId = req.body.userId;
    const newPassword = req.body.password;
    const passwordToken = req.body.passwordToken;
    let resetUser;
    User.findOne({ resetToken: passwordToken, tokenExpreation: { $gt: Date.now() }, _id: userId })
        .then(user => {
            resetUser = user;
            return bcrypt.hash(newPassword, 12)
        }).then(hashedPassword => {
            resetUser.password = hashedPassword;
            resetUser.resetToken = undefined;
            resetUser.tokenExpreation = undefined;
            return resetUser.save()
        }).then(result => {
            console.log(result)
            res.redirect('/user/login')
        }).catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });

}

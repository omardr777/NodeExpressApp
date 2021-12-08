const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();
const { check, body } = require('express-validator');
const User = require('../models/user');


router.get('/signup', userController.getSignup);

router.post('/signup', [
    check('email').isEmail().withMessage('please enter a vaild email').custom((value, { req }) => {
        return User.findOne({ email: value })
            .then(user => {
                if (user) {
                    return Promise.reject('email is already used');
                }
                return true;
            })
    }).normalizeEmail(),
    body('password', 'Password should be at least 6 characater long').isLength({ min: 6 }).trim(),
    body('confirmPassword').trim().custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords have to match')
        }
        return true;
    })
], userController.postSignup)

router.get('/login', userController.getLogin);

router.post('/login',
    check('email', 'enter a valid email').isEmail().normalizeEmail(),
    body('password', 'please enter a valid password').isLength({ min: 5 }).trim(),
    userController.postLogin);

router.post('/logout', userController.postLogout);

router.get('/chart-data', userController.getUserData);

router.get('/reset', userController.getResetPassword);

router.post('/reset', userController.postResetPassword);

router.get('/reset/:token', userController.getNewPassword);

router.post('/new-password', userController.postNewPassword)

module.exports = router;
const User = require('../models/user');
const DateO = require('../models/dateo');
const TimeO = require('../models/timeO');
const Request = require('../models/requests')
const flashMessage = require('../middleware/flashMessage');
const { validationResult } = require('express-validator')

exports.postDate = (req, res, next) => {
    const userId = req.user._id
    const day = req.body.date;
    const ftime = req.body.ftime;
    const ttime = req.body.ttime;

    let times = [];
    let date;
    let nDatef;
    let datef;
    let isArr = false;
    const errors = validationResult(req);
    console.log("Logged Output ~ file: dateController.js ~ line 19 ~ errors", errors)
    dateObj = new Date();
    let myDate = (dateObj.getFullYear()) + "-" + (dateObj.getMonth() + 1) + "-" + (dateObj.getDate());
    if (typeof (ftime) !== 'string') {
        isArr = true;
        for (let i = 0; i < ftime.length; i++) {
            let r = Math.random().toString();
            times.push({ _id: r, from: ftime[i], to: ttime[i] });
        }
    } else {
        let r = Math.random().toString();
        times.push({ _id: r, from: ftime, to: ttime });
    }
    if (!errors.isEmpty()) {
        return res.status(422).render('date/addSch', {
            path: '/schedule',
            pageTitle: 'Add Date',
            errorMessage: errors.array()[0].msg,
            oldInputs: { day: day, ftime: ftime, ttime: ttime },
            validationErrors: errors.array(),
            isArr: isArr,
            minDate: myDate
        });
    }
    DateO.findOne({ day: day, userId: userId })
        .then(date => {
            // console.log(date)
            if (!date) {
                const date = new DateO({
                    day: day,
                    userId: userId
                })
                return date.save();

            } else {
                req.flash("error", "you have record with that date");
                return res.redirect('/date/add-date')
            }
        })
        .then(newDate => {
            // console.log("2 ", newDate)
            for (let i of times) {
                i.dateId = newDate._id
            }
            newDate.times = times;
            return newDate.save();
        })
        .then(result => {
            date = result;
            return User.findById(userId)

        })
        .then(user => {
            user.dates.push(date)
            return user.save();
        })
        .then(updatedUser => {
            req.flash('success', 'Record created successfuly')
            res.redirect('/drivers/schedule')
        })
        .catch(err => console.log(err))
}

exports.getAddDate = (req, res, next) => {
    let message = flashMessage.errorMessage(req);
    dateObj = new Date();
    let myDate = (dateObj.getFullYear()) + "-" + (dateObj.getMonth() + 1) + "-" + (dateObj.getDate());

    res.render('date/addSch', {
        pageTitle: 'Add ',
        path: '/add-sh',
        editing: false,
        errorMessage: message,
        oldInputs: { day: '', ftime: '', ttime: '' },
        dateIn: { times: [] },
        minDate: myDate,
        isArr: false
    })
}

exports.getEditDate = (req, res, next) => {
    let message = flashMessage.errorMessage(req);
    const dateId = req.params.dateId;

    DateO.findById(dateId)
        .populate('times')
        .then(date => {
            if (!date) {
                return res.send('there is no Date')
            };
            res.render('date/editSch', {
                pageTitle: "Edit",
                path: "/edit",
                dateIn: date,
                errorMessage: message
            })

        })
        .catch(err => console.log(err))
}

exports.postUpdateTime = (req, res, next) => {
    const dateId = req.params.dateId;
    const ftime = req.body.ftime;
    const ttime = req.body.ttime;
    let times = [];
    DateO.findById(dateId)
        .then(date => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log(errors)
                return res.status(422).render('date/editSch', {
                    path: '/schedule',
                    pageTitle: 'Add Date',
                    errorMessage: errors.array()[0].msg,
                    validationErrors: errors.array(),
                    dateIn: date
                });
            }
            if (date) {
                times = date.times;

                if (typeof (ftime) !== 'string') {

                    for (let i = 0; i < ftime.length; i++) {
                        if (!times.includes(times[i])) {
                            if (times[i]) {
                                times[i].from = ftime[i];
                                times[i].to = ttime[i];
                            } else {
                                let r = Math.random().toString();
                                times.push({ _id: r, from: ftime[i], to: ttime[i], dateId: date._id });
                            }
                        } else {
                            // req.flash('error', 'you already used this time')
                            // res.redirect('/date/add-date')
                        }
                    }

                } else {
                    times[0].from = ftime;
                    times[0].to = ttime;
                }
                date.times = [];
                date.times = times;
                return date.save()
            }
        })
        .then(updatedDate => {
            console.log("updatedDate", updatedDate)
            res.redirect("/drivers/schedule")
        })
        .catch(err => console.log(err))
}

exports.postDeleteTime = (req, res, next) => {
    const timeId = req.params.dateId;
    console.log(timeId)
    DateO.findOne({ 'times._id': timeId })
        .then(date => {
            if (!date) {
                return res.send('there is no time');
            }

            let times = date.times;
            let index = times.findIndex(item => item._id === timeId);

            if (times[index].status == 'used') {
                req.flash('error', 'You can not delete this')
                res.redirect('/date')
            }
            times = times.filter(i => {
                return i._id != timeId;
            })
            date.times = [];
            date.times = times;
            return date.save();
        })
        .then(savedDate => {
            res.redirect('/drivers/schedule')
        })
        .catch(err => console.log(err))
}

exports.postDeleteDate = (req, res, next) => {
    const dateId = req.params.dateId;
    console.log(dateId)
    DateO.findByIdAndRemove(dateId)
        .then(result => {
            if (result) {
                // console.log(result)
                req.flash('success', 'Deleted Successfully')
                res.redirect('/drivers/schedule')
            } else {
                // console.log(result)
                req.flash('error', 'there is a problem')
                res.redirect('/drivers/schedule')
            }
        })
}
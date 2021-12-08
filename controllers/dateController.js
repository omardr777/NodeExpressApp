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


    // DateO.findOne({ day: day, userId: '616b3fd3943133fb50e2b79d' })
    //     .then(date => {
    //         datef = date
    //         if (!date) {
    //             return DateO.create({
    //                 day: day,
    //                 userId: '616b3fd3943133fb50e2b79d'
    //             });
    //         }
    //     })
    //     .then(newDate => {
    //         datef = newDate;
    //         if (newDate) {

    //             if (typeof (ftime) !== 'string') {
    //                 for (let i of times) {
    //                     i.dateId = newDate._id;
    //                 }
    //             } else {
    //                 times[0].dateId = newDate._id;
    //             }
    //         } else {
    //             if (typeof (ftime) !== 'string') {
    //                 for (let i of times) {
    //                     i.dateId = datef._id;
    //                 }
    //             } else {
    //                 times[0].dateId = datef._id;
    //             }
    //         }
    //         return TimeO.insertMany(times)
    //     })
    //     .then(timesArr => {
    //         timesId = timesArr.map(i => {
    //             return i._id;
    //         })
    //         for (let id of timesId) {
    //             datef.times.push(id);
    //         }
    //         return datef.save()
    //     })
    //     .then((nDate) => {
    //         nDatef = nDate;
    //         return User.findById('616b3fd3943133fb50e2b79d');
    //     })
    //     .then(user => {
    //         user.dates.push(nDatef._id)
    //         return user.save();
    //     })
    //     .then(result => {
    //         res.redirect("/drivers/schedule")
    //     })
    //     .catch(err => console.log(err))


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
            //console.log(date)
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

    // .then(date => {
    //     if (!date) {
    //         return res.send('there is no Date')
    //     };
    //     res.render('drivers/editSch', {
    //         pageTitle: 'Edit ',
    //         path: '/edit-sh',

    //         dateIn: date
    //     })
    // }).catch(err => console.log(err))
}

exports.postUpdateTime = (req, res, next) => {
    const dateId = req.params.dateId;
    const day = req.body.date;
    const ftime = req.body.ftime;
    const ttime = req.body.ttime;
    let date;
    let times = [];
    let thereIsNew = false;
    console.log(dateId)

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
                                //console.log("Logged Output ~ file: drivers.js ~ line 225 ~ times", times[i])
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

                //console.log("Logged Output ~ file: drivers.js ~ line 239 ~ date", date)
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


    // DateO.findById(dateId)
    //     .then(dateI => {
    //         date = dateI;
    //         console.log(date)
    //         return TimeO.deleteMany({ dateId: dateId })
    //         //return TimeO.findByIdAndUpdate('616a2fc591e688142dbaefc0', { $set: { from: '4:49', to: '6:49' } })

    //         // if (typeof (ftime) !== 'string') {
    //         //     for (let i = 0; i < ftime.length; i++) {
    //         //         // date.times[i].from = ftime[i]
    //         //         // date.times[i].to = ttime[i];\
    //         //         if (date.times[i])
    //         //             TimeO.findByIdAndUpdate({ _id: date.times[i]._id }, { from: ftime[i], to: ttime[i] })
    //         //         else {
    //         //             console.log('no')
    //         //             newTimes.push({ from: ftime[i], to: ttime[i], dateId: dateId })
    //         //             thereIsNew = true;
    //         //             console.log("newTimes", newTimes)
    //         //         }
    //         //     }
    //         //     if (thereIsNew) {
    //         //         console.log('must insert many')

    //         //         TimeO.insertMany(newTimes)
    //         //             .then(timesArr => {
    //         //                 let timesId = timesArr.map(i => {
    //         //                     return i._id;
    //         //                 })
    //         //                 for (let id of timesId) {
    //         //                     date.times.push(id);
    //         //                 }
    //         //                 return date.save()
    //         //             });
    //         //     }
    //         // } else {
    //         //     return TimeO.findByIdAndUpdate({ _id: date.times[0]._id }, { from: ftime, to: ttime })
    //         // }
    //         // if (date) {
    //         // }
    //         // else {
    //         //     console.log(date.times[0].from);

    //         // }

    //         // return date.save();
    //     })
    //     .then(deletedTimes => {
    //         if (typeof (ftime) !== 'string') {
    //             for (let i = 0; i < ftime.length; i++) {
    //                 times.push({ from: ftime[i], to: ttime[i], dateId: dateId });
    //             }
    //         } else {
    //             times.push({ from: ftime, to: ttime, dateId: dateId });
    //         }
    //         return TimeO.insertMany(times)
    //     })
    //     .then(timesArr => {
    //         let timesId = timesArr.map(i => {
    //             return i._id;
    //         });
    //         date.times = timesId;
    //         return date.save();
    //     })
    //     .then(result => {
    //         console.log("\nresult\n", result)
    //         res.redirect('/drivers/edit-date/' + dateId)
    //     })

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
            //need to complete
            if (times[index].status == 'used') {

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
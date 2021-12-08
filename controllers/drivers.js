const { BulkWriteResult } = require('mongodb');
const User = require('../models/user');
const DateO = require('../models/dateo');
const TimeO = require('../models/timeO');
const Request = require('../models/requests')
const flashMessage = require('../middleware/flashMessage');

const ITEMS_PER_PAGE = 4;

exports.getDrivers = (req, res, next) => {
    let userId;
    if (req.user) {

        userId = req.user._id

    }


    User.find({ driver: true, _id: { $ne: userId } })
        .then(drivers => {
            let driversArr;
            if (drivers)
                driversArr = drivers;
            else
                driversArr = []
            // console.log(drivers)
            res.render('drivers/drivers', {
                pageTitle: 'Drivers',
                path: '/drivers',
                drivers: driversArr
            })
        })
        .catch(err => console.log(err))

}

exports.getDriver = (req, res, next) => {
    const driverId = req.params.driverId;
    const page = +req.query.page || 1;
    let totalItems;

    // User.findById(driverId)
    //     .populate('dates')
    //     .sort({ day: -1 })
    //     // .populate('dates')
    //     .then(driver => {
    //         // console.log(driver)
    //         // console.log(driver.dates[0].times)
    //         res.render('drivers/get-driver'
    //             , {
    //                 pageTitle: "Driver",
    //                 path: '/driver',
    //                 driver: driver
    //             })
    //     })
    DateO.countDocuments()
        .then(number => {
            totalItems = number;
            return DateO.find({ userId: driverId })
                .sort({ day: 1 })
                .skip((page - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE)
                .populate('userId')
        })
        .then(dates => {
            User.findById(driverId)
                .then(driver => {
                    let successMessage = flashMessage.successMessage(req)
                    res.render('drivers/get-driver', {
                        pageTitle: "Driver",
                        path: '/drivers',
                        dates: dates,
                        currentPage: page,
                        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                        hasPreviousPage: page > 1,
                        nextPage: page + 1,
                        previousPage: page - 1,
                        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
                        successMessage: successMessage,
                        driver: driver
                    })
                })

        })
        .catch(err => console.log(err))
}

exports.getSchedule = (req, res, next) => {
    const userId = req.user._id;
    const page = +req.query.page || 1;
    let totalItems;
    // console.log(userId)
    DateO.countDocuments()
        .then(number => {
            totalItems = number;
            return DateO.find({ userId: userId })
                .sort({ day: 1 })
                .skip((page - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE)
                .populate("times");
        })
        .then(data => {
            // console.log(data)
            if (!data)
                res.send("f")
            // console.log(data)
            let sMessage = flashMessage.successMessage(req);
            res.render('drivers/schedule', {
                pageTitle: 'Shedule',
                path: '/schedule',
                dates: data,
                successMessage: sMessage,
                currentPage: page,
                hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: page - 1,
                lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
            })

        })
        .catch(err => console.log(err))
}


// exports.postDate = (req, res, next) => {
//     const userId = req.user._id
//     const day = req.body.date;
//     const ftime = req.body.ftime;
//     const ttime = req.body.ttime;
//     console.log('test')
//     let times = [];
//     let date;
//     let nDatef;
//     let datef;
//     if (typeof (ftime) !== 'string') {
//         for (let i = 0; i < ftime.length; i++) {
//             let r = Math.random().toString();
//             times.push({ _id: r, from: ftime[i], to: ttime[i] });
//         }
//     } else {
//         let r = Math.random().toString();
//         times.push({ _id: r, from: ftime, to: ttime });
//     }

//     DateO.findOne({ day: day, userId: userId })
//         .then(date => {
//             console.log(date)
//             if (!date) {
//                 const date = new DateO({
//                     day: day,
//                     userId: userId
//                 })
//                 return date.save();

//             }
//         })
//         .then(newDate => {
//             console.log("2 ", newDate)
//             for (let i of times) {
//                 i.dateId = newDate._id
//             }
//             newDate.times = times;
//             return newDate.save();
//         })
//         .then(result => {
//             date = result;
//             return User.findById(userId)

//         })
//         .then(user => {
//             user.dates.push(date)
//             return user.save();
//         })
//         .then(updatedUser => {

//             res.redirect('/drivers/schedule')
//         })
//         .catch(err => console.log(err))


//     // DateO.findOne({ day: day, userId: '616b3fd3943133fb50e2b79d' })
//     //     .then(date => {
//     //         datef = date
//     //         if (!date) {
//     //             return DateO.create({
//     //                 day: day,
//     //                 userId: '616b3fd3943133fb50e2b79d'
//     //             });
//     //         }
//     //     })
//     //     .then(newDate => {
//     //         datef = newDate;
//     //         if (newDate) {

//     //             if (typeof (ftime) !== 'string') {
//     //                 for (let i of times) {
//     //                     i.dateId = newDate._id;
//     //                 }
//     //             } else {
//     //                 times[0].dateId = newDate._id;
//     //             }
//     //         } else {
//     //             if (typeof (ftime) !== 'string') {
//     //                 for (let i of times) {
//     //                     i.dateId = datef._id;
//     //                 }
//     //             } else {
//     //                 times[0].dateId = datef._id;
//     //             }
//     //         }
//     //         return TimeO.insertMany(times)
//     //     })
//     //     .then(timesArr => {
//     //         timesId = timesArr.map(i => {
//     //             return i._id;
//     //         })
//     //         for (let id of timesId) {
//     //             datef.times.push(id);
//     //         }
//     //         return datef.save()
//     //     })
//     //     .then((nDate) => {
//     //         nDatef = nDate;
//     //         return User.findById('616b3fd3943133fb50e2b79d');
//     //     })
//     //     .then(user => {
//     //         user.dates.push(nDatef._id)
//     //         return user.save();
//     //     })
//     //     .then(result => {
//     //         res.redirect("/drivers/schedule")
//     //     })
//     //     .catch(err => console.log(err))


// }

// exports.getAddDate = (req, res, next) => {
//     res.render('drivers/addSch', {
//         pageTitle: 'Add ',
//         path: '/add-sh',
//         editing: false,
//         dateIn: { times: [] }
//     })
// }

// exports.getEditDate = (req, res, next) => {
//     const dateId = req.params.dateId;

//     DateO.findById(dateId)
//         .populate('times')
//         .then(date => {
//             //console.log(date)
//             if (!date) {
//                 return res.send('there is no Date')
//             };
//             res.render('drivers/editSch', {
//                 pageTitle: "Edit",
//                 path: "/edit",
//                 dateIn: date
//             })

//         })
//         .catch(err => console.log(err))

//     // .then(date => {
//     //     if (!date) {
//     //         return res.send('there is no Date')
//     //     };
//     //     res.render('drivers/editSch', {
//     //         pageTitle: 'Edit ',
//     //         path: '/edit-sh',

//     //         dateIn: date
//     //     })
//     // }).catch(err => console.log(err))
// }

// exports.postUpdateTime = (req, res, next) => {
//     const dateId = req.params.dateId;
//     const day = req.body.date;
//     const ftime = req.body.ftime;
//     const ttime = req.body.ttime;
//     let date;
//     let times = [];
//     let thereIsNew = false;
//     console.log(dateId)

//     DateO.findById(dateId)
//         .then(date => {
//             if (date) {
//                 times = date.times;
//                 if (typeof (ftime) !== 'string') {
//                     for (let i = 0; i < ftime.length; i++) {
//                         if (times[i]) {


//                             times[i].from = ftime[i];
//                             times[i].to = ttime[i];
//                             //console.log("Logged Output ~ file: drivers.js ~ line 225 ~ times", times[i])
//                         } else {
//                             let r = Math.random().toString();
//                             times.push({ _id: r, from: ftime[i], to: ttime[i], dateId: date._id });
//                         }
//                     }
//                 } else {
//                     times[0].from = ftime;
//                     times[0].to = ttime;
//                 }

//                 //console.log("Logged Output ~ file: drivers.js ~ line 239 ~ date", date)
//                 date.times = [];
//                 date.times = times;
//                 return date.save()

//             }
//         })
//         .then(updatedDate => {
//             console.log("updatedDate", updatedDate)
//             res.redirect("/drivers/schedule")
//         })
//         .catch(err => console.log(err))


//     // DateO.findById(dateId)
//     //     .then(dateI => {
//     //         date = dateI;
//     //         console.log(date)
//     //         return TimeO.deleteMany({ dateId: dateId })
//     //         //return TimeO.findByIdAndUpdate('616a2fc591e688142dbaefc0', { $set: { from: '4:49', to: '6:49' } })

//     //         // if (typeof (ftime) !== 'string') {
//     //         //     for (let i = 0; i < ftime.length; i++) {
//     //         //         // date.times[i].from = ftime[i]
//     //         //         // date.times[i].to = ttime[i];\
//     //         //         if (date.times[i])
//     //         //             TimeO.findByIdAndUpdate({ _id: date.times[i]._id }, { from: ftime[i], to: ttime[i] })
//     //         //         else {
//     //         //             console.log('no')
//     //         //             newTimes.push({ from: ftime[i], to: ttime[i], dateId: dateId })
//     //         //             thereIsNew = true;
//     //         //             console.log("newTimes", newTimes)
//     //         //         }
//     //         //     }
//     //         //     if (thereIsNew) {
//     //         //         console.log('must insert many')

//     //         //         TimeO.insertMany(newTimes)
//     //         //             .then(timesArr => {
//     //         //                 let timesId = timesArr.map(i => {
//     //         //                     return i._id;
//     //         //                 })
//     //         //                 for (let id of timesId) {
//     //         //                     date.times.push(id);
//     //         //                 }
//     //         //                 return date.save()
//     //         //             });
//     //         //     }
//     //         // } else {
//     //         //     return TimeO.findByIdAndUpdate({ _id: date.times[0]._id }, { from: ftime, to: ttime })
//     //         // }
//     //         // if (date) {
//     //         // }
//     //         // else {
//     //         //     console.log(date.times[0].from);

//     //         // }

//     //         // return date.save();
//     //     })
//     //     .then(deletedTimes => {
//     //         if (typeof (ftime) !== 'string') {
//     //             for (let i = 0; i < ftime.length; i++) {
//     //                 times.push({ from: ftime[i], to: ttime[i], dateId: dateId });
//     //             }
//     //         } else {
//     //             times.push({ from: ftime, to: ttime, dateId: dateId });
//     //         }
//     //         return TimeO.insertMany(times)
//     //     })
//     //     .then(timesArr => {
//     //         let timesId = timesArr.map(i => {
//     //             return i._id;
//     //         });
//     //         date.times = timesId;
//     //         return date.save();
//     //     })
//     //     .then(result => {
//     //         console.log("\nresult\n", result)
//     //         res.redirect('/drivers/edit-date/' + dateId)
//     //     })

// }

// exports.postDeleteTime = (req, res, next) => {
//     const timeId = req.params.dateId;
//     console.log(timeId)
//     TimeO.findByIdAndDelete(timeId)
//         .then(time => {
//             if (!time) {
//                 return res.send('there is no time');
//             }
//             res.redirect('/drivers/schedule')

//         })
//         .catch(err => console.log(err))
// }



// exports.postRequest = (req, res, next) => {
//     const timeId = req.params.timeId;
//     const userId = req.user._id;
//     const driverId = req.body.driverId;
//     const description = req.body.description;
//     const dateId = req.body.dateId;
//     let time;

//     console.log(userId + " \n" + driverId)
//     DateO.findOne({ 'times._id': timeId })
//         .then(date => {
//             console.log(date.times)
//             let index = date.times.findIndex(item => item._id === timeId);
//             time = date.times[index];
//             return Request.create({
//                 time: time.from + "-" + time.to,
//                 timeId: timeId,
//                 userId: userId,
//                 driverId: driverId,
//                 dateId: dateId,
//                 description: description
//             })
//         })
//         .then(request => {
//             User.findById(driverId)
//                 .then(user => {
//                     user.requests.push(request._id)
//                     user.save()
//                         .then(result => {
//                             console.log(request)
//                             res.redirect('/')
//                         })
//                 })

//         })
//         .catch(err => console.log(err))

//     // TimeO.findById(timeId)
//     //     .populate({
//     //         path: 'dateId', model: 'Date', populate: { path: 'userId', medel: 'User', select: 'name email _id' }
//     //     })
//     //     .then(time => {
//     //         return Request.create({
//     //             time: time._id,
//     //             userId: userId,
//     //             driverId: time.dateId.userId._id,
//     //             description: description
//     //         })
//     //     })
//     //     .then(request => {
//     //         console.log(request)
//     //         User.findById(request.userId)
//     //             .then(user => {
//     //                 user.requests.push(request);
//     //                 return user.save();
//     //             }).then(result => {
//     //                 console.log(result)
//     //                 res.redirect('/drivers')
//     //             });

//     //     })

//     //     .catch(err => console.log(err))

// }

// exports.getRequests = (req, res, next) => {
//     const driverId = req.user._id;
//     Request.find({ driverId: driverId })
//         .populate('userId dateId')
//         .then(requests => {
//             res.render('drivers/get-request', {
//                 pageTitle: 'Requests',
//                 path: '/requests',
//                 requests: requests
//             })
//         })
// }

// exports.acceptRequest = (req, res, next) => {
//     const requestId = req.params.requestId;
//     console.log("Logged Output ~ file: drivers.js ~ line 458 ~ requestId", requestId)
//     const timeId = req.body.timeId;
//     console.log(timeId)
//     // Request.find({ 'timeId': timeId })
//     //     .then(requests => {
//     //         console.log(requests)
//     //     })
//     Request.updateMany({ 'timeId': timeId }, { status: 'Rejected' })
//         .then(requests => {

//             DateO.findOne({ 'times._id': timeId })
//                 .then(date => {

//                     let times = date.times;
//                     console.log(date.times)
//                     let time;
//                     let index = times.findIndex(item => item._id === timeId);
//                     console.log(index)
//                     if (times[index].status != 'used') {
//                         times[index].status = 'used';
//                         date.times = [];
//                         date.times = times;
//                         return date.save();
//                     }
//                 })
//                 .then((test) => {
//                     console.log(test)
//                     return Request.findByIdAndUpdate(requestId, { status: 'Accepted' })
//                 })

//         })
//         .then(request => {
//             console.log("Logged Output ~ file: drivers.js ~ line 464 ~ request", request)
//             res.redirect('/')
//         })
//         .catch(err => console.log(err))
// }

// exports.rejectRequest = (req, res, next) => {
//     const requestId = req.params.requestId;

//     const timeId = req.body.timeId;

//     Request.findByIdAndUpdate(requestId, { status: "Rejected" })
//         .then(request => {
//             console.log("Logged Output ~ file: drivers.js ~ line 464 ~ request", request)
//             res.redirect('/')
//         })
//         .catch(err => console.log(err))
// }
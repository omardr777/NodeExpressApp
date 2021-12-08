const User = require('../models/user');
const DateO = require('../models/dateo');
const TimeO = require('../models/timeO');
const Request = require('../models/requests')
const flashMessage = require('../middleware/flashMessage');

const ITEMS_PER_PAGE = 3;


exports.getRequests = (req, res, next) => {
    const driverId = req.user._id;
    const page = +req.query.page || 1;
    let totalItems;
    Request.countDocuments()
        .then(number => {
            totalItems = number;
            return Request.find({ driverId: driverId })
                .sort({ status: -1 })
                .skip((page - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE)
                .populate('userId dateId')
        })
        .then(requests => {
            res.render('request/get-request', {
                pageTitle: 'Requests',
                path: '/requests',
                requests: requests,
                currentPage: page,
                hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: page - 1,
                lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
            })
        })
}

exports.getDips = (req, res, next) => {
    const timeId = req.params.timeId;
    let ob;

    DateO.findOne({ 'times._id': timeId })
        .populate('userId')
        .then(date => {
            console.log(date.times)
            let time;
            let index = date.times.findIndex(item => item._id === timeId);
            console.log("Logged Output ~ file: drivers.js ~ line 350 ~ index", index)

            time = date.times[index];
            // res.send(timeId)
            res.render('request/get-dips', {
                pageTitle: "dips",
                path: 'dips',
                data: date,
                time: time
            })
        })
    // TimeO.findById(timeId)
    //     .select('from to dateId')
    //     .populate({
    //         path: 'dateId', model: 'Date', populate: { path: 'userId', medel: 'User', select: 'name email _id' }
    //     })
    //     .then(time => {
    //         ob = time;
    //         res.render('drivers/get-dips', {
    //             pageTitle: "dips",
    //             path: 'dips',
    //             data: time
    //         })
    //     })

}

exports.postRequest = (req, res, next) => {
    const timeId = req.params.timeId;
    const userId = req.user._id;
    const driverId = req.body.driverId;
    const description = req.body.description;
    const dateId = req.body.dateId;
    let time;

    console.log(userId + " \n" + driverId)
    DateO.findOne({ 'times._id': timeId })

        .then(date => {
            console.log(date.times)
            let index = date.times.findIndex(item => item._id === timeId);
            time = date.times[index];
            return Request.create({
                time: time.from + "-" + time.to,
                timeId: timeId,
                userId: userId,
                driverId: driverId,
                dateId: dateId,
                description: description,
                date: date.day
            })
        })
        .then(request => {
            User.findById(driverId)
                .then(user => {
                    user.requests.push(request._id)
                    user.save()
                        .then(result => {
                            console.log(request)
                            res.redirect('/')
                        })
                })

        })
        .catch(err => console.log(err))

    // TimeO.findById(timeId)
    //     .populate({
    //         path: 'dateId', model: 'Date', populate: { path: 'userId', medel: 'User', select: 'name email _id' }
    //     })
    //     .then(time => {
    //         return Request.create({
    //             time: time._id,
    //             userId: userId,
    //             driverId: time.dateId.userId._id,
    //             description: description
    //         })
    //     })
    //     .then(request => {
    //         console.log(request)
    //         User.findById(request.userId)
    //             .then(user => {
    //                 user.requests.push(request);
    //                 return user.save();
    //             }).then(result => {
    //                 console.log(result)
    //                 res.redirect('/drivers')
    //             });

    //     })

    //     .catch(err => console.log(err))

}

exports.acceptRequest = (req, res, next) => {
    const requestId = req.params.requestId;
    let special = req.body.special;
    const timeId = req.body.timeId;
    const time = req.body.time;
    let day = req.body.date;
    const driverId = req.user._id;
    // console.log(day)
    let date = new Date(day)
    // console.log("date", date)
    // Request.find({ 'timeId': timeId })
    //     .then(requests => {
    //         console.log(requests)
    //     })
    // Request.find().populate({
    //     path: 'dateId', model: 'Date', populate: { path: 'userId', medel: 'User' }
    // }).then(reqeust => {
    //     console.log(reqeust[0].dateId.day)
    //     dateId = reqeust[0].dateId._id

    //     Request.find({ 'dateId.userId.name': "omar" })
    //         .then(result => {
    //             console.log('result', result)
    //             res.send(result)
    //         })
    // })
    // Request.find({ time: time, driverId: driverId,date:day }).populate('dateId')
    //     .then(request => {
    //         // console.log(request)
    //         return Request.updateMany({ time: time, driverId: driverId, "dateId.day": date }, { status: "Rejected" })
    //     })
    //     .then(requests => {
    //         console.log(requests)
    //     })
    //     .catch(err => console.log(err))

    Request.find({ time: time, driverId: driverId, date: day }).populate('dateId')
        .then(result => {
            console.log('d\n\n\n\n\n\n\n\nd', result)
            return Request.updateMany({ date: day, time: time, driverId: driverId }, { status: 'Rejected' })
        })
        .then(requests => {
            console.log("\n\nLogged Output ~ file: rController.js ~ line 154 ~ requests\n\n", requests)
            DateO.findOne({ 'times._id': timeId })
                .then(date => {
                    let times = date.times;
                    // console.log(date.times)
                    let time;
                    let index = times.findIndex(item => item._id === timeId);
                    console.log(index)
                    if (times[index].status != 'used') {
                        times[index].status = 'used';
                        date.times = [];
                        date.times = times;
                        return date.save();
                    }
                })
                .then((test) => {
                    console.log(test)
                    return Request.findByIdAndUpdate(requestId, { status: 'Accepted' })
                })
        })
        .then(request => {
            const userId = req.body.userId;
            return User.findById(userId)
        })
        .then(user => {
            let newPoints;
            if (special == "true")
                newPoints = user.points - 50;
            else
                newPoints = user.points - 10;
            user.points = newPoints;
            return user.save();
        })
        .then(result => {
            res.redirect('/requests')
        })
        .catch(err => console.log(err))
}

exports.rejectRequest = (req, res, next) => {
    const requestId = req.params.requestId;

    const timeId = req.body.timeId;


    Request.findById(requestId)
        .then(request => {
            let oldStatus = request.status;
            if (oldStatus === 'Accepted') {
                User.findById(request.userId)
                    .then(user => {
                        console.log(user)
                        let newPoints = user.points + 50;
                        user.points = newPoints;
                        return user.save();
                    })
                    .then(savedUser => {
                        console.log(savedUser)

                        request.status = 'Rejected'
                        return request.save();
                    })
            }
        })
        .then(savedRequested => {
            //console.log("Logged Output ~ file: drivers.js ~ line 464 ~ request", request)
            res.redirect('/requests')
        }).catch(err => console.log(err))

    // Request.findByIdAndUpdate(requestId, { status: "Rejected" })
    //     .then(request => {
    //         console.log("Logged Output ~ file: drivers.js ~ line 464 ~ request", request)
    //         res.redirect('/requests')
    //     })
    //     .catch(err => console.log(err))
}

exports.getSRequest = (req, res, next) => {
    const driverId = req.params.driverId;
    let message = flashMessage.errorMessage(req);
    dateObj = new Date();
    let myDate = (dateObj.getFullYear()) + "-" + (dateObj.getMonth() + 1) + "-" + (dateObj.getDate());
    User.findById(driverId)
        .then(user => {
            if (!user) {
                return res.redirect('/');
            }
            res.render('request/special', {
                pageTitle: 'Special Request',
                path: '/drivers',
                errorMessage: message,
                minDate: myDate,
                driverId: driverId
            })
        })
}

exports.postSRequest = (req, res, next) => {

    const driverId = req.params.driverId;
    const day = req.body.date;
    const ftime = req.body.ftime;
    const ttime = req.body.ttime;
    const description = req.body.description;
    let date;
    let request;
    let times = [];
    let r = Math.random().toString();
    times.push({ _id: r, from: ftime, to: ttime });
    DateO.create({
        day: day,
        times: times,
        userId: req.user._id
    })
        .then(ndate => {
            date = ndate;
            date.times[0].dateId = date._id;
            return date.save();

        })
        .then(udate => {
            return Request.create({
                time: udate.times[0].from + "-" + udate.times[0].to,
                timeId: udate.times[0]._id,
                userId: udate.userId,
                driverId: driverId,
                dateId: udate._id,
                description: description,
                special: true,
                date: day
            });
        })
        .then(newRequest => {
            request = newRequest;
            console.log(newRequest);
            return User.findById(driverId)

        })
        .then(user => {
            if (!user) {
                return res.json({ error: 'hesh' })
            }
            user.requests.push(request);
            return user.save();
        })
        .then(savedUser => {
            console.log("Logged Output ~ file: rController.js ~ line 303 ~ savedUser", savedUser)
            req.flash('success', 'Request Sent!')
            return res.redirect('/drivers/get-driver/' + driverId)
        })
        .catch(err => console.log(err))
}
const User = require('../models/user');
const DateO = require('../models/dateo');
const Request = require('../models/requests')
const flashMessage = require('../middleware/flashMessage');

const ITEMS_PER_PAGE = 3;
const Points_for_Special_Requests = 50;
const Points_for_Normal_Requests = 10;

exports.getRequests = (req, res, next) => {
    const driverId = req.user._id;
    const page = +req.query.page || 1;
    let totalItems;
    Request.countDocuments()
        .then(numberOfRequests => {
            totalItems = numberOfRequests;
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
    DateO.findOne({ 'times._id': timeId })
        .populate('userId')
        .then(date => {
            let time;
            let index = date.times.findIndex(item => item._id === timeId);
            time = date.times[index];
            res.render('request/get-dips', {
                pageTitle: "dips",
                path: 'dips',
                data: date,
                time: time
            })
        })
}

exports.postRequest = (req, res, next) => {
    const timeId = req.params.timeId;
    const userId = req.user._id;
    const driverId = req.body.driverId;
    const description = req.body.description;
    const dateId = req.body.dateId;
    let time;
    DateO.findOne({ 'times._id': timeId })
        .then(date => {
            console.log(date.times)
            let index = date.times.findIndex(item => item._id === timeId);
            time = date.times[index];
            // console.log(time)
            // timeToInsert = [parseInt(time.from.split(":")[0]) * 60 + parseInt(time.from.split(":")[1]), parseInt(time.to.split(":")[0]) * 60 + parseInt(time.to.split(":")[1])]
            // console.log(timeToInsert)
            return Request.create({
                time: time.from + "-" + time.to,
                fromTime: parseInt(time.from.split(":")[0]) * 60 + parseInt(time.from.split(":")[1]),
                toTime: parseInt(time.to.split(":")[0]) * 60 + parseInt(time.to.split(":")[1]),
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
}

exports.acceptRequest = (req, res, next) => {
    const requestId = req.params.requestId;
    let special = req.body.special;
    const timeId = req.body.timeId;
    const requestTimeF = req.body.fromTime;
    const requestTimeT = req.body.toTime;
    let day = req.body.date;
    const driverId = req.user._id;
    Request.updateMany({
        $or: [
            //get all requests with the range of posted Request
            { $and: [{ fromTime: { $gte: requestTimeF } }, { fromTime: { $lte: requestTimeT } }] },
            { $and: [{ fromTime: { $lt: requestTimeF } }, { toTime: { $gte: requestTimeF } }] },
        ], driverId: driverId, date: day
    }, { status: "Rejected" }).populate('dateId')
        .then(result => {
            DateO.findOne({ 'times._id': timeId })
                .then(date => {
                    let times = date.times;
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
                    return Request.findByIdAndUpdate(requestId, { status: 'Accepted' })
                })
        })
        .then(result => {
            const userId = req.body.userId;
            return User.findById(userId)
        })
        .then(user => {
            let newPoints;
            if (special == "true")
                newPoints = user.points - Points_for_Special_Requests;
            else
                newPoints = user.points - Points_for_Normal_Requests;

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
    Request.findById(requestId)
        .then(request => {
            let oldStatus = request.status;
            if (oldStatus === 'Accepted') {
                User.findById(request.userId)
                    .then(user => {
                        let newPoints = user.points + Points_for_Special_Requests;
                        user.points = newPoints;
                        return user.save();
                    })
                    .then(savedUser => {
                        request.status = 'Rejected'
                        return request.save();
                    })
            }
        })
        .then(savedRequested => {
            res.redirect('/requests')
        }).catch(err => console.log(err))
}

exports.getSRequest = (req, res, next) => {
    const driverId = req.params.driverId;
    let message = flashMessage.errorMessage(req);
    dateObj = new Date();
    let theDate = (dateObj.getFullYear()) + "-" + (dateObj.getMonth() + 1) + "-" + (dateObj.getDate());
    User.findById(driverId)
        .then(user => {
            if (!user) {
                return res.redirect('/');
            }
            res.render('request/special', {
                pageTitle: 'Special Request',
                path: '/drivers',
                errorMessage: message,
                minDate: theDate,
                driverId: driverId
            })
        })
}

exports.postSRequest = (req, res, next) => {

    const driverId = req.params.driverId;
    const day = req.body.date;
    const ftime = req.body.ftime;
    const ttime = req.body.ttime;
    const fromTime = parseInt(ftime.split(":")[0]) * 60 + parseInt(ftime.split(":")[1]);
    const toTime = parseInt(ttime.split(":")[0]) * 60 + parseInt(ttime.split(":")[1]);
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
                fromTime: fromTime,
                toTime: toTime,
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
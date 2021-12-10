const { BulkWriteResult } = require('mongodb');
const User = require('../models/user');
const DateO = require('../models/dateo');
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
    DateO.countDocuments()
        .then(numberOfDates => {
            totalItems = numberOfDates;
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
    DateO.countDocuments()
        .then(numberOfDates => {
            totalItems = numberOfDates;
            return DateO.find({ userId: userId })
                .sort({ day: 1 })
                .skip((page - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE)
                .populate("times");
        })
        .then(data => {
            if (!data)
                res.send("You don't have any")
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


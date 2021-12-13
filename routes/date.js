const express = require("express");
const dateController = require("../controllers/dateController");
const router = express.Router();
const { check, body } = require('express-validator');

const isAuth = require('../middleware/is-auth')

router.get('/add-date', isAuth.isAuth, isAuth.isDriver, dateController.getAddDate);

router.get('/edit-date/:dateId', isAuth.isAuth, isAuth.isDriver, dateController.getEditDate)
router.post('/postDate',
    [body('ftime').custom((value, { req }) => {
        return checkTimes(value, req);
    }), body('date').custom((value, { req }) => {
        return checkDate(value);
    })], isAuth.isAuth, isAuth.isDriver, dateController.postDate);

router.post('/updateDate/:dateId',
    [body('ftime').custom((value, { req }) => {
        return checkTimes(value, req);
    })], isAuth.isAuth, isAuth.isDriver, dateController.postUpdateTime);

router.get('/delete-time/:dateId', isAuth.isAuth, isAuth.isDriver, dateController.postDeleteTime);

router.get('/delete/:dateId', isAuth.isAuth, isAuth.isDriver, dateController.postDeleteDate)

module.exports = router;


function checkTimes(value, req) {
    let ans = false;
    if (typeof (value) !== "string") {
        //if more than one time

        let fromTimes = value;
        let toTimes = req.body.ttime;
        let timesAsInt = [];
        for (let i = 0; i < fromTimes.length; i++) {
            // '00:00'
            timesAsInt.push({
                from: parseInt(fromTimes[i].split(":")[0]) * 60 + parseInt(fromTimes[i].split(":")[1]),
                to: parseInt(toTimes[i].split(":")[0]) * 60 + parseInt(toTimes[i].split(":")[1])
            })
        }
        for (let i = 0; i < timesAsInt.length; i++) {
            if (timesAsInt[i].from < timesAsInt[i].to) {
                for (let j = 0; j < timesAsInt.length; j++) {
                    //not comparing same element
                    if (i != j) {
                        console.log(`   ${fromTimes[i]} >= ${fromTimes[j]}` + '\n')
                        if (timesAsInt[i].from >= timesAsInt[j].from) {
                            if (timesAsInt[i].from <= timesAsInt[j].to) {
                                console.log(`       ${fromTimes[i]} <= ${toTimes[j]}` + '\n')
                                throw new Error(`You have intersect in ${fromTimes[i]} and ${toTimes[j]}`)
                            }
                            else
                                ans = true
                        } else {
                            console.log(`   ${fromTimes[i]} < ${fromTimes[j]}` + '\n')
                            if (timesAsInt[i].to >= timesAsInt[j].from) {
                                console.log(`       ${toTimes[i]} > ${fromTimes[j]}` + '\n')
                                throw new Error(`You have intersect in ${toTimes[i]} and ${fromTimes[j]}`)
                            }
                            else
                                ans = true
                        }
                    }
                }
            } else {
                throw new Error('The end time can not be greater than start time')
            }
        }
    } else {
        //if there is one time
        let fromTime = parseInt(value.split(":")[0]) * 60 + parseInt(value.split(":")[1]);
        let toTime = parseInt(req.body.ttime.split(":")[0]) * 60 + parseInt(req.body.ttime.split(":")[1]);
        if (fromTime >= toTime) {
            throw new Error('The end time can not be greater than start time')
        } else
            ans = true
    }

    return ans;

}

function checkDate(value) {
    let dateObj = new Date();
    let theDate = value.split('-');
    console.log(theDate)
    console.log(dateObj.getFullYear() + '  ' + (dateObj.getMonth() + 1) + "  " + dateObj.getDate())
    if (parseInt(theDate[0]) < dateObj.getFullYear()) {
        throw new Error("You can not choose a date from the past")

    }
    else if (parseInt(theDate[0]) > dateObj.getFullYear()) {
        return true;
    }
    if (parseInt(theDate[1]) < dateObj.getMonth() + 1) {

        throw new Error("You can not choose a date from the past")

    } else if (parseInt(theDate[1]) > dateObj.getMonth() + 1) {
        return true;
    }
    if (parseInt(theDate[2]) < dateObj.getDate()) {
        throw new Error("You can not choose a date from the past")
    }
    else {
        return true;
    }

}
const express = require("express");
const dateController = require("../controllers/dateController");
const router = express.Router();
const { check, body } = require('express-validator');

const isAuth = require('../middleware/is-auth')

router.get('/add-date', isAuth.isAuth, isAuth.isDriver, dateController.getAddDate);

router.get('/edit-date/:dateId', isAuth.isAuth, isAuth.isDriver, dateController.getEditDate)

router.post('/postDate',
    [body('ftime').custom((value, { req }) => {
        let timeError = [];
        if (typeof (value) !== "string") {
            let ftimes = value;
            // console.log("Logged Output ~ file: date.js ~ line 16 ~ router.post ~ ftimes", ftimes)
            let ttimes = req.body.ttime;
            // console.log("Logged Output ~ file: date.js ~ line 18 ~ router.post ~ ttimes", ttimes)
            let ftimesn = [];
            let ttimesn = [];
            let timesn = []
            let timesN = [-1]
            for (let i = 0; i < ftimes.length; i++) {
                ftimesn.push((parseInt(ftimes[i].split(":")[0]) * 60 + parseInt(ftimes[i].split(":")[1])));
                ttimesn.push((parseInt(ttimes[i].split(":")[0]) * 60 + parseInt(ttimes[i].split(":")[1])));
                timesn.push(ftimesn[i]);
                timesn.push(ttimesn[i]);
            }
            // for (let i = 0; i < ftimes.length; i++) {
            //     ftimesn.push((parseInt(ftimes[i].split(":")[0]) * 60 + parseInt(ftimes[i].split(":")[1])))
            // }

            // for (let i = 0; i < ttimes.length; i++) {
            //     ttimesn.push((parseInt(ttimes[i].split(":")[0]) * 60 + parseInt(ttimes[i].split(":")[1])))

            // }

            // for (let i = 0; i < ttimes.length; i++) {
            //     timesn.push(ftimesn[i]);
            //     timesn.push(ttimesn[i]);

            // }
            console.log(ftimesn)
            console.log(ttimesn)
            let first = false;
            for (let i = 0; i < ftimesn.length; i++) {
                for (let j = 0; j < timesN.length; j++) {
                    console.log("j : " + j)
                    console.log("ftimesn[i] : " + ftimesn[i])
                    console.log("ttimesn[i] : " + ttimesn[i])
                    console.log("timesN[j] : " + timesN[j]);

                    if (timesN[0] == -1) {
                        timesN[0] = ftimesn[0];
                        timesN.push(ttimesn[0])
                        j++;
                        i += 2;
                        // if (first == false) {
                        //     i++
                        // }
                        // first = true;
                    } else {
                        if (ftimesn[i] >= timesN[j] && ftimesn[i] <= timesN[j + 1]) {
                            console.log(ftimesn[i] + "timesN[j] " + timesN[j])
                            console.log('> <')
                            timeError.push(ftimes[i])
                            // timeError.push(ttimes[i])
                            // i++;
                            // console.log("Logged Output ~ file: date.js ~ line 39 ~ router.post ~ ftimes", ftimes + "     " + i)
                            break
                        } else if (ftimesn[i] < timesN[j] && ttimesn[i] >= timesN[j]) {
                            console.log(ttimesn[i] + " >= " + timesN[j])
                            timeError.push(ftimes[i])
                            console.log('t>')

                            // console.log("Logged Output ~ file: date.js ~ line 39 ~ router.post ~ ftimes", ftimes + "     " + i)
                            // timeError.push(ftimes[i])
                            timeError.push(ttimes[i])
                            // i++
                            break

                        } else if (ttimesn[i] >= ftimesn[i + 1]) {
                            console.log('stetsedfsdfasdfasdf\n\n\n');
                            timeError.push(ttimesn[i]);
                            break
                        }
                        else if (ttimesn[i] >= ftimesn[i]) {
                            console.log('stetsedfsdfasdfasdf\n\n\n');
                            timeError.push(ttimesn[i]);
                            break
                        }

                    }
                }
                timesN.push(ftimesn[i]);
                timesN.push(ttimesn[i]);
                console.log("Logged Output ~ file: date.js ~ line 78 ~ [body ~ timesN", timesN)

            }
            // console.log(timeError.length)
            if (timeError.length >= 1) {
                throw new Error('You have intersect ')
            } else {
                return true;
            }
        } else {
            let fftime = value;
            let ttime = req.body.ttime;
            let ftimen = parseInt(fftime.split(":")[0]) * 60 + parseInt(fftime.split(":")[1]);
            let ttimen = parseInt(ttime.split(":")[0]) * 60 + parseInt(ttime.split(":")[1]);

            if (ttimen <= ftimen + 15) {
                throw new Error('end time has to be greater')
            } else {
                return true
            }

        }
    }), body('date').custom((value, { req }) => {
        let dateObj = new Date();
        let theDate = value.split('-');
        console.log(theDate)
        console.log(dateObj.getFullYear() + '  ' + (dateObj.getMonth() + 1) + "  " + dateObj.getDate())
        let isError = false;
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



        return true;

    })], isAuth.isAuth, isAuth.isDriver, dateController.postDate);

router.post('/updateDate/:dateId',
    [body('ftime').custom((value, { req }) => {
        let timeError = [];
        if (typeof (value) !== "string") {
            let ftimes = value;
            // console.log("Logged Output ~ file: date.js ~ line 16 ~ router.post ~ ftimes", ftimes)
            let ttimes = req.body.ttime;
            // console.log("Logged Output ~ file: date.js ~ line 18 ~ router.post ~ ttimes", ttimes)
            let ftimesn = [];
            let ttimesn = [];
            let timesn = []
            let timesN = [-1]
            for (let i = 0; i < ftimes.length; i++) {
                ftimesn.push((parseInt(ftimes[i].split(":")[0]) * 60 + parseInt(ftimes[i].split(":")[1])));
                ttimesn.push((parseInt(ttimes[i].split(":")[0]) * 60 + parseInt(ttimes[i].split(":")[1])));
                timesn.push(ftimesn[i]);
                timesn.push(ttimesn[i]);
            }
            // for (let i = 0; i < ftimes.length; i++) {
            //     ftimesn.push((parseInt(ftimes[i].split(":")[0]) * 60 + parseInt(ftimes[i].split(":")[1])))
            // }

            // for (let i = 0; i < ttimes.length; i++) {
            //     ttimesn.push((parseInt(ttimes[i].split(":")[0]) * 60 + parseInt(ttimes[i].split(":")[1])))

            // }

            // for (let i = 0; i < ttimes.length; i++) {
            //     timesn.push(ftimesn[i]);
            //     timesn.push(ttimesn[i]);

            // }
            console.log(ftimesn)
            console.log(ttimesn)
            let first = false;
            for (let i = 0; i < ftimesn.length; i++) {
                for (let j = 0; j < timesN.length; j++) {
                    console.log("j : " + j)
                    console.log("ftimesn[i] : " + ftimesn[i])
                    console.log("ttimesn[i] : " + ttimesn[i])
                    console.log("timesN[j] : " + timesN[j]);

                    if (timesN[0] == -1) {
                        timesN[0] = ftimesn[0];
                        timesN.push(ttimesn[0])
                        j++;
                        i += 2;
                        // if (first == false) {
                        //     i++
                        // }
                        // first = true;
                    } else {
                        if (ftimesn[i] >= timesN[j] && ftimesn[i] <= timesN[j + 1]) {
                            console.log(ftimesn[i] + "timesN[j] " + timesN[j])
                            console.log('> <')
                            timeError.push(ftimes[i])
                            // timeError.push(ttimes[i])
                            // i++;
                            // console.log("Logged Output ~ file: date.js ~ line 39 ~ router.post ~ ftimes", ftimes + "     " + i)
                            break
                        } else if (ftimesn[i] < timesN[j] && ttimesn[i] >= timesN[j]) {
                            console.log(ttimesn[i] + " >= " + timesN[j])
                            timeError.push(ftimes[i])
                            console.log('t>')

                            // console.log("Logged Output ~ file: date.js ~ line 39 ~ router.post ~ ftimes", ftimes + "     " + i)
                            // timeError.push(ftimes[i])
                            timeError.push(ttimes[i])
                            // i++
                            break

                        } else if (ttimesn[i] >= ftimesn[i + 1]) {
                            console.log('stetsedfsdfasdfasdf\n\n\n');
                            timeError.push(ttimesn[i]);
                            break
                        }
                        else if (ttimesn[i] >= ftimesn[i]) {
                            console.log('stetsedfsdfasdfasdf\n\n\n');
                            timeError.push(ttimesn[i]);
                            break
                        }

                    }
                }
                timesN.push(ftimesn[i]);
                timesN.push(ttimesn[i]);
                console.log("Logged Output ~ file: date.js ~ line 78 ~ [body ~ timesN", timesN)

            }
            // console.log(timeError.length)
            if (timeError.length >= 1) {
                throw new Error('You have intersect ')
            } else {
                return true;
            }
        } else {
            let fftime = value;
            let ttime = req.body.ttime;
            let ftimen = parseInt(fftime.split(":")[0]) * 60 + parseInt(fftime.split(":")[1]);
            let ttimen = parseInt(ttime.split(":")[0]) * 60 + parseInt(ttime.split(":")[1]);

            if (ttimen <= ftimen + 15) {
                throw new Error('end time has to be greater')
            } else {
                return true
            }

        }
    })], isAuth.isAuth, isAuth.isDriver, dateController.postUpdateTime);

router.get('/delete-time/:dateId', isAuth.isAuth, isAuth.isDriver, dateController.postDeleteTime);

router.get('/delete/:dateId', isAuth.isAuth, isAuth.isDriver, dateController.postDeleteDate)

module.exports = router;
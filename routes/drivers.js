const express = require("express");
const driverController = require("../controllers/drivers");
const router = express.Router();

const isAuth = require('../middleware/is-auth')

router.get('/', driverController.getDrivers);

router.get('/get-driver/:driverId', isAuth.isAuth, driverController.getDriver);

router.get('/schedule', isAuth.isAuth, isAuth.isDriver, driverController.getSchedule);

//router.get('/add-date', isAuth.isAuth, isAuth.isDriver, driverController.getAddDate);

// router.get('/edit-date/:dateId', isAuth.isAuth, isAuth.isDriver, driverController.getEditDate)

// router.post('/postDate', isAuth.isAuth, isAuth.isDriver, driverController.postDate);

// router.post('/updateDate/:dateId', isAuth.isAuth, isAuth.isDriver, driverController.postUpdateTime);

// router.get('/delete-time/:dateId', isAuth.isAuth, isAuth.isDriver, driverController.postDeleteTime)

// router.get('/driver/get-dips/:timeId', isAuth.isAuth, driverController.getDips)

// router.post('/post-request/:timeId', isAuth.isAuth, driverController.postRequest)

// router.get('/requests', isAuth.isAuth, driverController.getRequests);

// router.post('/requests/accept-request/:requestId', isAuth.isAuth, driverController.acceptRequest);

// router.post('/requests/reject-request/:requestId', isAuth.isAuth, driverController.rejectRequest);


module.exports = router;
const express = require("express");
const rController = require("../controllers/rController");
const router = express.Router();

const isAuth = require('../middleware/is-auth')

//router.get('/driver/get-dips/:timeId', isAuth.isAuth, rController.getDips)

router.get('/', isAuth.isAuth, isAuth.isDriver, rController.getRequests);

router.post('/post-request/:timeId', isAuth.isAuth, rController.postRequest);

router.get('/get-dips/:timeId', isAuth.isAuth, rController.getDips)

router.post('/accept-request/:requestId', isAuth.isAuth, rController.acceptRequest);

router.post('/reject-request/:requestId', isAuth.isAuth, rController.rejectRequest);

router.get('/special-request/:driverId', isAuth.isAuth, rController.getSRequest);

router.post('/special-request/:driverId', isAuth.isAuth, rController.postSRequest);


module.exports = router;
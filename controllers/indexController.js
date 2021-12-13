const Request = require('../models/requests')


exports.getIndex = (req, res, next) => {
    if (req.user) {
        let userId = req.user._id;
        Request.find({ userId: userId })
            .populate('dateId driverId')
            .then(requests => {
                // console.log(requests)
                res.render('home/index', {
                    pageTitle: 'home', path: '/',
                    userId: userId
                });

            })
    } else {
        res.render('home/index', {
            pageTitle: 'home', path: '/',
            requests: []
        });
    }
}
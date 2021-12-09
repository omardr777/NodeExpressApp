
// const express = require('express');
// const app = express();
// const fs = require('fs');
// // const https = require('https');

// const path = require('path');
// const mongoose = require('mongoose');
// const helmet = require('helmet');
// const compression = require('compression');
// require('dotenv').config();
// const User = require('./models/user');

// const session = require('express-session');
// const MongoDBStore = require('connect-mongodb-session')(session);

// const csrf = require('csurf');
// const bodyParser = require('body-parser')
// const flash = require('connect-flash');

// // const privateKey = fs.readFileSync('server.key');
// // const certificate = fs.readFileSync('server.cert');

// //routes
// const indexRouter = require("./routes/index");
// const driversRouter = require('./routes/drivers');
// const userRouter = require('./routes/user');
// const errorController = require('./controllers/errorController');
// const dateRouter = require('./routes/date');
// const requestRouter = require('./routes/requset');


// const store = new MongoDBStore({
//     uri: process.env.MONGO_URI,
//     collection: 'sessions'
// })
// const csrfProtection = csrf();


// app.use(helmet());
// app.use(compression());


// //middlewares
// app.set('view engine', 'ejs');
// app.set('views', 'views');
// app.use(express.static(path.join(__dirname, 'public')));
// //app.use(express.json());
// app.use(express.urlencoded({
//     extended: true
// }));
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: false }))
// app.use(session({
//     secret: 'asdlfkajfdhuahdfpjk',
//     resave: false,
//     saveUninitialized: false,
//     store: store
// }))
// app.use(csrfProtection)
// app.use(flash())

// app.use((req, res, next) => {
//     if (!req.session.user) {
//         return next();
//     }
//     User.findById(req.session.user._id)
//         .then(user => {
//             if (!user) {
//                 return next();
//             }
//             req.user = user;
//             next();
//         })
//         .catch(err => console.log(err))
// })
// app.use((req, res, next) => {
//     res.locals.isAuthenticated = req.session.isLoggedIn;
//     res.locals.isDriver = req.session.isDriver;
//     if (req.session.isLoggedIn)
//         res.locals.points = req.user.points;
//     res.locals.csrfToken = req.csrfToken();
//     next();
// });


// //using routes
// app.use('/', indexRouter)
// app.use('/drivers', driversRouter)
// app.use('/user', userRouter);
// app.use('/date', dateRouter)
// app.use('/requests', requestRouter)
// app.use(errorController.get404);
// console.log(process.env.MONGO_URI)
// mongoose
//     .connect(process.env.MONGO_URI)
//     .then(result => {
//         User.find().then(user => {

//             if (!user) {
//                 const user = new User({
//                     name: 'omar',
//                     email: 'max@test.com',
//                     driver: true
//                 });
//                 user.save();
//             }
//             // else if (user.length <= 1) {
//             //     User.create({
//             //         name: 'mohammed',
//             //         email: 'test@test.com',
//             //         driver: false
//             //     })
//             // }
//         });
//         // https.createServer({ key: privateKey, cert: certificate }, app).listen(process.env.PORT);
//         app.listen(process.env.PORT);
//     })
//     .catch(err => {
//         console.log(err);
//     });
const express = require('express');
const app = express();
// require('dotenv').config();
const compression = require('compression');
const helmet = require('helmet');

const path = require('path');
const mongoose = require('mongoose');

const User = require('./models/user');

const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const csrf = require('csurf');
const bodyParser = require('body-parser')
const flash = require('connect-flash');

//routes
const indexRouter = require("./routes/index");
const driversRouter = require('./routes/drivers');
const userRouter = require('./routes/user');
const errorController = require('./controllers/errorController');
const dateRouter = require('./routes/date');
const requestRouter = require('./routes/requset');
const store = new MongoDBStore({
    uri: process.env.MONGO_URI,
    collection: 'sessions'
})
const csrfProtection = csrf();
app.use(helmet({
    contentSecurityPolicy: false,
}));
app.use(compression());

//middlewares
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(session({
    secret: 'asdlfkajfdhuahdfpjk',
    resave: false,
    saveUninitialized: false,
    store: store
}))
app.use(csrfProtection)
app.use(flash())

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            if (!user) {
                return next();
            }
            req.user = user;
            next();
        })
        .catch(err => console.log(err))
})
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.isDriver = req.session.isDriver;
    if (req.session.isLoggedIn)
        res.locals.points = req.user.points;
    res.locals.csrfToken = req.csrfToken();
    next();
});


//using routes
app.use('/', indexRouter)
app.use('/drivers', driversRouter)
app.use('/user', userRouter);
app.use('/date', dateRouter)
app.use('/requests', requestRouter)
app.use(errorController.get404);

mongoose
    .connect(process.env.MONGO_URI)
    .then(result => {
        User.find().then(user => {

            if (!user) {
                const user = new User({
                    name: 'omar',
                    email: 'max@test.com',
                    driver: true
                });
                user.save();
            }
            // else if (user.length <= 1) {
            //     User.create({
            //         name: 'mohammed',
            //         email: 'test@test.com',
            //         driver: false
            //     })
            // }
        });
        app.listen(process.env.PORT || 3000);
    })
    .catch(err => {
        console.log(err);
    });



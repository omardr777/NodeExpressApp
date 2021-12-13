
const express = require('express');
const app = express();
require('dotenv').config();
const compression = require('compression');
const helmet = require('helmet');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const flash = require('connect-flash');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

//Module
const User = require('./models/user');



const csrf = require('csurf');
const csrfProtection = csrf();


//routes
const indexRouter = require("./routes/index");
const driversRouter = require('./routes/drivers');
const userRouter = require('./routes/user');
const errorController = require('./controllers/errorController');
const dateRouter = require('./routes/date');
const requestRouter = require('./routes/requset');



//middlewares
const store = new MongoDBStore({
    uri: process.env.MONGO_URI,
    collection: 'sessions'
})

app.use(helmet({
    contentSecurityPolicy: false,
}));
app.use(compression());


app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({
    extended: true
}));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(session({
    secret: 'asdlfkajfdhuahdfpjk',
    resave: false,
    saveUninitialized: false,
    store: store,

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
        app.listen(process.env.PORT || 3000);
    })
    .catch(err => {
        console.log(err);
    });



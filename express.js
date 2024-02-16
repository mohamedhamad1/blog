require('dotenv').config();

const methodOverride = require('method-override')
const express = require('express');
const expressLayout = require('express-ejs-layouts');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');
const session = require('express-session');

async function ConnectDB() {
    await mongoose
        .connect(process.env.MONGODB_URI)
        .then(() => console.log("Connected to MongoDB.."))
        .catch((err) => console.error("MongoDB Connection Failed..", err));
}

const {isActiveRoute} = require('./server/helpers/routeHelpers')

const app = express();
const PORT = 5000 || process.env.PORT;

ConnectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser())
app.use(methodOverride('_method'));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
        mongoUrl: process.env.MONGODB_URI,
    }),
}));

app.use(express.static('public'));

app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

app.locals.isActiveRoute = isActiveRoute;

app.use('/', require('./server/routes/main'));
app.use('/', require('./server/routes/admin'));

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});
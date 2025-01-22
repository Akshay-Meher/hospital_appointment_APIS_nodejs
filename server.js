require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./src/routes');
const { handleServerError } = require('./src/middleware/errorHandlingMiddleware');
const { setupLogging } = require('./src/services/setlogs');
const session = require('express-session');
const passport = require('./src/config/passportConfig');

const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

// Configure session
app.use(
    session({
        secret: process.env.SESSION_SECRET_KEY,
        resave: false,
        saveUninitialized: true,
    })
);

// Initialize Passport and session
app.use(passport.initialize());
app.use(passport.session());

const PORT = process.env.PORT || 5000;
setupLogging();
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);
app.use(handleServerError);


app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});

const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./src/routes');
const { handleServerError } = require('./src/middleware/errorHandlingMiddleware');
const { setupLogging } = require('./src/services/setlogs');
const passport = require('./src/config/passportConfig');
const { sessionMiddleware } = require('./src/config/sessionStore');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

const corsOptions = {
    origin: "http://localhost:5173", // Your React app's URL
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
    // allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"], // Allowed headers
    credentials: true, // Important: Allows credentials (cookies, auth headers)
};
app.use(cors(corsOptions));


app.use(sessionMiddleware);

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

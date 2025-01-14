require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./src/routes');
const { handleServerError } = require('./src/middleware/errorHandlingMiddleware');
const { setupLogging } = require('./src/services/setlogs');

const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
const PORT = process.env.PORT || 5000;
setupLogging();
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);
app.use(handleServerError);


app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});

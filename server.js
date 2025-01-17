require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./src/routes');
const { handleServerError } = require('./src/middleware/errorHandlingMiddleware');

const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
const PORT = process.env.PORT || 5000;

app.use('/', routes);
app.use(handleServerError);


app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});

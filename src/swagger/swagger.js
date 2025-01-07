const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const routes = require('../routes')
const path = require('path');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Hospital_Appointment_System',
            version: '1.0.0',
            description: 'API documentation for Hospital_Appointment_System',
        },
        servers: [
            {
                url: "http://localhost:5000",
            }
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                BearerAuth: [],
            },
        ],
    },
    apis: [path.join(__dirname, '../routes/*.js')],

};

const specs = swaggerJsdoc(options);

module.exports = {
    swaggerUi,
    specs,
};

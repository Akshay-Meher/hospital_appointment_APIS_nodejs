const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const { sequelize } = require('../models'); // Adjust the path to your Sequelize instance

// Initialize Sequelize Store
const sessionStore = new SequelizeStore({
    db: sequelize,
    tableName: 'sessions', // Optional: Customize table name
    checkExpirationInterval: 15 * 60 * 1000, // Clear expired sessions every 15 minutes
    expiration: 7 * 24 * 60 * 60 * 1000, // Sessions expire after 1 week
});

// Sync the session store to create the table only if it does not exist
(async () => {
    try {
        const tableExists = await sequelize.getQueryInterface().showAllTables();
        // console.log("tableExists", tableExists);
        if (!tableExists.includes('sessions')) {
            await sessionStore.sync(); // Sync only if the table doesn't exist
            console.log('Session table created successfully.');
        } else {
            console.log('Session table already exists. No action needed.');
        }
    } catch (error) {
        console.error('Error checking or creating session table:', error);
    }
})();

// Export the session store and configuration
module.exports = {
    sessionMiddleware: session({
        key: 'user_session', // Cookie name
        secret: process.env.SESSION_SECRET_KEY, // Session secret key
        resave: false, // Avoid resaving sessions unnecessarily
        saveUninitialized: false, // Do not save uninitialized sessions
        store: sessionStore, // Use Sequelize store
        cookie: {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week in milliseconds
            secure: process.env.NODE_ENV === 'production', // HTTPS-only in production
        },
    }),
    sessionStore, // Export the store in case it's needed elsewhere
};

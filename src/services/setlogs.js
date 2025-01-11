function setupLogging() {

    if (process.env.NODE_ENV === 'development') {
        // Enable console.log only in development
        global.console.log = (...args) => {
            // You can add extra formatting here if needed
            process.stdout.write('[DEV LOG]: ');
            console.info(...args);
        };
    } else {
        // Disable or change the behavior for production (optional)
        global.console.log = () => { };
    }
}

module.exports = { setupLogging };
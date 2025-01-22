const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const { Doctor, Patient, Admin } = require('../models'); // Import models
const { roleRules } = require('../validations/commonValidations');
const { comparePassword } = require('../services/comparePassword');
const { executeModelMethod } = require('../services/executeModelMethod');

passport.use(
    'local-login',
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true, // Access req to get role-specific route
        },
        async (req, email, password, done) => {
            try {
                console.log("LocalStrategy 1", email, password);
                const loginRoute = req.originalUrl; // Get the login route (e.g., /admin/login)
                let user;

                // Dynamically determine the model based on the route
                if (loginRoute.includes('admin')) {
                    user = await executeModelMethod({
                        modelName: "Admin",
                        methodName: "findOne",
                        args: { where: { email, is_deleted: false } }
                    });

                } else if (loginRoute.includes('patient')) {
                    user = await Patient.findOne({ where: { email } });
                } else if (loginRoute.includes('doctor')) {
                    user = await Doctor.findOne({ where: { email } });
                }

                if (!user) {
                    console.log('LocalStrategy 3');
                    return done(null, false, { message: 'Incorrect email or password.' });
                }

                // const isMatch = await bcrypt.compare(password, user.password);
                const isMatch = await comparePassword(password, user.password);;

                if (!isMatch) {
                    console.log("isMatch");
                    return done(null, false, { message: 'Incorrect email or password.' });
                }

                // Include model name to track role dynamically
                console.log("last");
                return done(null, { id: user.id, modelName: user.constructor.name, role: user.constructor.name.toLowerCase(), email: user.email });
            } catch (error) {
                return done(error);
            }
        }
    )
);

// Serialize user
passport.serializeUser((user, done) => {
    done(null, user); // Store id and model name
});

// Deserialize user
passport.deserializeUser(async (user, done) => {
    try {
        let foundUser;
        if (user.modelName === 'Doctor') {
            foundUser = await Doctor.findByPk(user.id);
        } else if (user.modelName === 'Patient') {
            foundUser = await Patient.findByPk(user.id);
        } else if (user.modelName === 'Admin') {
            foundUser = await Admin.findByPk(user.id);
        }
        done(null, foundUser);
    } catch (error) {
        done(error);
    }
});

module.exports = passport;

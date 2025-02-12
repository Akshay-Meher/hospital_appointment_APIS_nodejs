const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const { Doctor, Patient, Admin } = require('../models'); // Import models
const { roleRules } = require('../validations/commonValidations');
const { comparePassword } = require('../services/comparePassword');
const { executeModelMethod } = require('../services/executeModelMethod');
const { tooManyfailedAttempts, invalidCredential } = require('../utils/responseMessages');

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
                let user, role, userId;

                // Dynamically determine the model based on the route
                if (loginRoute.includes('admin')) {
                    user = await executeModelMethod({
                        modelName: "Admin",
                        methodName: "findOne",
                        args: { where: { email, is_deleted: false } }
                    });
                    role = 'admin';
                } else if (loginRoute.includes('patient')) {
                    user = await Patient.findOne({ where: { email, is_deleted: false } });
                    role = 'patient';
                } else if (loginRoute.includes('doctor')) {
                    user = await Doctor.findOne({ where: { email, is_deleted: false } });
                    role = 'doctor';
                }

                if (!user) {
                    console.log('LocalStrategy 3');
                    return done(null, false, { code: 404, message: 'user not found' });
                }


                userId = user.id;
                // Check if the record exists for the userId and role
                const existingRecord = await executeModelMethod({
                    modelName: "LoginFailed",
                    methodName: "findOne",
                    args: { where: { userId, role, is_deleted: false } }
                });

                if (existingRecord && existingRecord.loginFailedCount >= 5) {

                    return done(null, false, { code: 429, message: tooManyfailedAttempts() });
                }

                const isPasswordValid = await comparePassword(password, user.password);;

                if (!isPasswordValid) {

                    if (existingRecord) {
                        //Increment loginFailedCount
                        const updatedRecord = await executeModelMethod({
                            modelName: "LoginFailed",
                            methodName: "update",
                            args: [
                                { loginFailedCount: existingRecord.loginFailedCount + 1 },
                                { where: { userId, role, is_deleted: false } }
                            ]
                        });
                    } else {
                        // Create a new record for the userId and role
                        const newRecord = await executeModelMethod({
                            modelName: "LoginFailed",
                            methodName: "create",
                            args: { userId, role, loginFailedCount: 1 }
                        });
                    }
                    return done(null, false, { code: 401, message: invalidCredential() });
                }

                return done(null, { id: user.id, modelName: user.constructor.name, role: user.constructor.name.toLowerCase(), email: user.email, name: user.name });

            } catch (error) {
                return done(error);
            }
        }
    )
);

// Serialize user
passport.serializeUser((user, done) => {
    console.log("serializeUser", user);
    // done(null, {
    //     id: user.id,
    //     role: user.role,
    //     email: user.email,
    //     modelName: user.modelName
    // });
    done(null, user);
});

// Deserialize user
passport.deserializeUser(async (user, done) => {
    try {
        console.log("deserializeUser", user);
        done(null, user);
    } catch (error) {
        console.log("deserializeUser", error);
        done(error);
    }
});

module.exports = passport;

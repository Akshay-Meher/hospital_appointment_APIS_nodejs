const admin = require("firebase-admin");

const serviceAccount = require("../../config/blog-post-api-300be-firebase-adminsdk-mk4yp-a4b231dae1.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

module.exports = { admin };
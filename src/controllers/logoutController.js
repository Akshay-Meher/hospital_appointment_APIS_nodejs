const { sendResponse } = require("../services/responseHandler");
const { successful } = require("../utils/responseMessages");


// const logout = async (req, res) => {
//     try {
//         req?.session?.destroy((err) => {
//             if (err) {
//                 console.error(`Error destroying session: ${err.message}`);
//                 return res.status(500).json({
//                     status: 'error',
//                     message: 'Could not log out. Please try again.',
//                 });
//             }
//             // Clear the session cookie
//             res?.clearCookie('connect.sid');
//         });



//         // Remove req.user
//         req.user = null;

//         return res.status(200).json({
//             status: 'success',
//             message: 'Logged out successfully',
//         });



//     } catch (err) {

//         console.error(`Logout Error: ${err.message}`);
//         return res.status(500).json({
//             status: 'error',
//             message: 'Internal Server Error',
//         });
//     }
// };





const logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error('Error during logout:', err);
            return sendResponse(res, "INTERNAL_SERVER_ERROR", 'Logout failed. Please try again.');
        }
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
                // return res.status(500).json({ message: 'Failed to destroy session.' });
                return sendResponse(res, "INTERNAL_SERVER_ERROR");
            }
            res.clearCookie('user_session'); // Ensure the session cookie is removed
            return sendResponse(res, "OK", successful('Logout'));

        });
    });
};


module.exports = logout;
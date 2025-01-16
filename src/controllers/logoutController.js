const logout = async (req, res) => {
    try {
        req?.session?.destroy((err) => {
            if (err) {
                console.error(`Error destroying session: ${err.message}`);
                return res.status(500).json({
                    status: 'error',
                    message: 'Could not log out. Please try again.',
                });
            }
            // Clear the session cookie
            res?.clearCookie('connect.sid');
        });

        // Remove req.user
        req.user = null;

        return res.status(200).json({
            status: 'success',
            message: 'Logged out successfully',
        });



    } catch (err) {

        console.error(`Logout Error: ${err.message}`);
        return res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
        });
    }
};


module.exports = logout;
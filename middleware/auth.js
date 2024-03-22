const jwt = require('jsonwebtoken');
const Admin = require('../model/User.model');

const auth = async (req, res, next) => {
    try {
        const secret = 'testuser';

        const authToken = req.header('Authorization');
        const decode = jwt.verify(authToken, secret);
        const user = await Admin.findOne({
            authToken: authToken,
        });

        if (!user) {
            const useNotFoundResponse = JSON.stringify({
                status: 401,
                message: 'User not found in the system',
            });
            throw new Error(useNotFoundResponse);
        }

        req.authToken = authToken;
        req.user = user;

        next();
    } catch (error) {
        return error.message;
    }
};

module.exports = { auth };
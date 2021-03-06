const jwt = require('jsonwebtoken');
const APP_SECRET = 'mySuperSecretApp5137412909';


function getUserId(context) {
    const Authorization = context.request.get('Authorization');
    if (Authorization) {
        const token = Authorization.replace('Bearer ', '');
        const { userId } = jwt.verify(token, APP_SECRET);
        return userId
    }
    throw new AuthError()
}

class AuthError extends Error {
    constructor() {
        super('Not authorized')
    }
}

module.exports = {
    getUserId,
    APP_SECRET
};
import jwt from 'jsonwebtoken';

const authOrigin = async (token) => {
    return jwt.verify(token, process.env.JWT_SECRET, (error, payload) => {
        if (error) {
            return false;
        }
        return { userId: payload.userId };
    });
};

export default authOrigin;
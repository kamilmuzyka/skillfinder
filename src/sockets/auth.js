/** @module auth */
/** This module authenticates the user based on their cookies. */
import authOrigin from '../auth/authOrigin.js';
import authGoogle from '../auth/authGoogle.js';

/** User authentication from cookies,
 *  @param {Cookies} cookies - the list of cookies received from the socket header
 */
const auth = async (cookies) => {
    const originToken = cookies.origin;
    const googleToken = cookies.google;
    if (originToken || googleToken) {
        /** Verify Token */
        const authCheck = originToken
            ? await authOrigin(originToken)
            : await authGoogle(googleToken);
        return authCheck.userId;
    }
    return null;
};

export default auth;

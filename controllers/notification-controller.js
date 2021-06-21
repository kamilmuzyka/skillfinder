/** @module NotificationController */
import User from '../models/User.js';
import Notification from '../models/Notification.js';

/** Get notifications - responds with data on notifications received by currently logged in user. It is meant to operate on protected routes only. */
export const getNotifications = async (req, res) => {
    try {
        const { userId } = req;
        const user = await User.findOne({
            where: {
                id: userId,
            },
        });
        const notifications = await user.getNotifications();
        res.status(200).json(notifications);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

/** Delete notification - deletes a particular notification based on notification ID. It is meant to operate on protected routes only.
 * @param {uuid} notificationId - requires a notification ID passed in the request body.
 */
export const deleteNotification = async (req, res) => {
    try {
        const { notificationId } = req.body;
        if (!notificationId) {
            throw Error('No notification ID provided.');
        }
        await Notification.destroy({
            where: {
                id: notificationId,
            },
        });
        res.sendStatus(200);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

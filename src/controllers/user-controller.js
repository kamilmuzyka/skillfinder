import User from '../models/User.js';

export const getUser = async (req, res) => {
    try {
        const user = await User.findOne({ where: { id: req.params.id } });
        res.send(user);
    } catch (err) {
        res.json({ error: err });
    }
};

/*
    Make sure the body of the request is of type JSON with values:
    BE CAREFUL OF THE CASE SENSITIVITY
    {
        {
            "firstName": "firstName",
            "lastName": "lastName",
            "email": "email@email.com",
            "password": "password"
        }
    }
*/

export const postUser = async (req, res) => {
    try {
        const user = await User.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            usertype: req.body.usertype,
        });
        res.json({ user });
    } catch (err) {
        res.json({ error: err });
    }
};

export const patchUser = async (req, res) => {
    try {
        const user = await User.update(
            {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: req.body.password,
                usertype: req.body.usertype,
            },
            { where: { id: req.params.id } }
        );
        res.json({ user });
    } catch (err) {
        res.json({ error: err });
    }
};

export const deleteUser = async (req, res) => {
    try {
        await User.destroy({ where: { id: req.params.id } });
        res.sendStatus(200);
    } catch (err) {
        res.json({ error: err });
    }
};
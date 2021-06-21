/** @module SkillController */
import Fuse from 'fuse.js';
import User from '../models/User.js';
import Skill from '../models/Skill.js';

/** Get users by skill name - responds with data on users who are associated with a given skill name. It acts as a provisional search engine at the moment.
 * @param {string} name - requires a skill name passed as URL parameter.
 */
export const getSkill = async (req, res) => {
    try {
        const { name } = req.params;
        if (!name) {
            throw Error('No skill name provided.');
        }
        const searchOptions = {
            includeScore: true,
            keys: ['name'],
        };
        const skills = await Skill.findAll({
            include: {
                model: User,
                attributes: {
                    exclude: ['email', 'password'],
                },
            },

            limit: 15,
        });
        const fuse = new Fuse(skills, searchOptions);
        const fuseResult = fuse.search(name);
        if (!fuseResult.length) {
            throw Error('Nothing found.');
        }
        res.json(fuseResult[0].item);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

/** Add user skill - adds a skill to the current user's account. It is meant to operate on protected routes only.
 * @param {string} name - requires a skill name parameter passed in the request body.
 */
export const postSkill = async (req, res) => {
    try {
        const { name } = req.body;
        const { userId } = req;
        if (!name) {
            throw Error('Please enter a skill name.');
        }
        if (name.length > 35) {
            throw Error('A skill name cannot be longer than 35 characters');
        }
        const user = await User.findOne({
            where: {
                id: userId,
            },
        });
        const skill = await Skill.findOrCreate({
            where: {
                name,
            },
        });
        user.addSkill(skill[0]);
        res.json({ skill });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

/** Delete user skill - deletes current user's skill based on the skill ID. It is meant to operate on protected routes only.
 * @param {uuid} skillId - requires a skill ID parameter passed in the request body.
 */
export const deleteSkill = async (req, res) => {
    try {
        const { skillId } = req.body;
        const { userId } = req;
        if (!skillId) {
            throw Error('No skill ID provided.');
        }
        const user = await User.findOne({
            where: { id: userId },
        });
        const skill = await Skill.findOne({
            where: { id: skillId },
        });
        user.removeSkill(skill);
        res.sendStatus(200);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

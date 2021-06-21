import { Sequelize } from 'sequelize';
import database from '../data-access/database.js';

const Request = database.define(
    'Request',
    {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
        },
        fromId: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
        },
        toId: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
        },
        pending: {
            type: Sequelize.BOOLEAN,
            defaultValue: true,
            allowNull: false,
        },
        accepted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
    },
    { timestamps: false }
);

export default Request;

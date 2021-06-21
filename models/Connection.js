import { Sequelize } from 'sequelize';
import database from '../data-access/database.js';

const Connection = database.define(
    'Connection',
    {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
        },
    },
    { timestamps: false }
);

export default Connection;

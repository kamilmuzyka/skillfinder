import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const database = new Sequelize(process.env.DATABASE_URL, {
    logging: false,
    // ^ Comment if you prefer logging
});

export default database;

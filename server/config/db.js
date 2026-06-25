import path from 'path';
import { fileURLToPath } from 'url';
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the server folder .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Initialize Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql', // This tells Sequelize which database engine to use
    logging: false,   // Set this to console.log if you want to see the raw SQL queries in your terminal
  }
);

// We export 'sequelize' instead of 'db' to match standard conventions
export default sequelize;
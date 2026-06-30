import path from 'path';
import { fileURLToPath } from 'url';
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the server folder .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Initialize Sequelize with Railway variable names first, fall back to local names
const sequelize = new Sequelize(
  process.env.MYSQLDATABASE || process.env.DB_NAME || 'hanmemo',
  process.env.MYSQLUSER || process.env.DB_USER || 'root',
  process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || 'root',
  {
    host: process.env.MYSQLHOST || process.env.DB_HOST || 'localhost',
    port: process.env.MYSQLPORT || 3306,
    dialect: 'mysql',
    logging: false,
  }
);
// We export 'sequelize' instead of 'db' to match standard conventions
export default sequelize;
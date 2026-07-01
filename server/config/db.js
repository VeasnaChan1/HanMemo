import path from 'path';
import { fileURLToPath } from 'url';
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Use internal Railway address when on Railway, external when local
const host = process.env.NODE_ENV === 'production' 
  ? 'mysql.railway.internal'  // ← Internal Railway network
  : (process.env.DB_HOST || 'localhost');  // ← Local/external

const port = process.env.NODE_ENV === 'production'
  ? 3306  // ← Railway internal uses standard port
  : (process.env.MYSQLPORT || 3306);

const sequelize = new Sequelize(
  process.env.MYSQLDATABASE || process.env.DB_NAME || 'HanMemo',
  process.env.MYSQLUSER || process.env.DB_USER || 'root',
  process.env.MYSQLPASSWORD || process.env.DB_PASSWORD,
  {
    host: host,
    port: port,
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    dialectOptions: {
      connectTimeout: 60000,
      enableKeepAlive: true,
    },
  }
);

export default sequelize;
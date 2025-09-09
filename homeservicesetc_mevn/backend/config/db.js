// backend/config/db.js
import dotenv from 'dotenv';
dotenv.config({ path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env' });

export let orm = null;
export let sequelize = null;
export let mongoose = null;

export const connectDB = async () => {
  const type = (process.env.DB_TYPE || 'mongo').toLowerCase();
  if (type === 'sql') {
    const { Sequelize } = await import('sequelize');
    const dialect = process.env.SQL_DIALECT || 'mysql';
    sequelize = new Sequelize(
      process.env.SQL_DB || 'homeservicesetc',
      process.env.SQL_USER || 'root',
      process.env.SQL_PASS || '',
      {
        host: process.env.SQL_HOST || '127.0.0.1',
        port: Number(process.env.SQL_PORT || (dialect === 'postgres' ? 5432 : 3306)),
        dialect,
        logging: false
      }
    );
    try {
      await sequelize.authenticate();
      console.log('✅ SQL connected:', dialect);
    } catch (err) {
      console.error('❌ SQL connection failed:', err.message);
      process.exit(1);
    }
    orm = 'sql';
  } else {
    const _mongoose = await import('mongoose');
    mongoose = _mongoose.default;
    try {
      await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/homeservicesetc');
      console.log('✅ MongoDB connected');
    } catch (err) {
      console.error('❌ Mongo connection failed:', err.message);
      process.exit(1);
    }
    orm = 'mongo';
  }
  return orm;
};

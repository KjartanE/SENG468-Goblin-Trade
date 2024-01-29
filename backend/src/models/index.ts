import dbConfig from '../config/db.config';
import Mongoose from 'mongoose';

Mongoose.Promise = global.Promise;

const db = {
  mongoose: Mongoose,
  url: dbConfig.database.url
};

module.exports = db;
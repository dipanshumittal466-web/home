// backend/models/index.js
import { orm, sequelize, mongoose } from '../config/db.js';

export const Models = {};

export const initModels = async () => {
  if (orm === 'sql') {
    const { DataTypes } = await import('sequelize');

    Models.User = sequelize.define('User', {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: DataTypes.STRING,
      email: { type: DataTypes.STRING, unique: true },
      passwordHash: DataTypes.STRING,
      role: { type: DataTypes.STRING, defaultValue: 'user' }
    });

    Models.Provider = sequelize.define('Provider', {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      verified: { type: DataTypes.BOOLEAN, defaultValue: false },
      plan: { type: DataTypes.STRING, defaultValue: 'basic' },
      appsCycleKey: DataTypes.STRING,
      appsCount: { type: DataTypes.INTEGER, defaultValue: 0 },
      indemnityAcceptedAt: DataTypes.STRING
    });

    Models.Job = sequelize.define('Job', {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      title: DataTypes.STRING,
      description: DataTypes.TEXT,
      location: DataTypes.STRING,
      category: DataTypes.STRING,
      status: { type: DataTypes.STRING, defaultValue: 'open' }
    });

    Models.Application = sequelize.define('Application', {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      providerId: DataTypes.INTEGER,
      jobId: DataTypes.INTEGER,
      status: { type: DataTypes.STRING, defaultValue: 'submitted' }
    });

    Models.Category = sequelize.define('Category', {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: DataTypes.STRING,
      icon: DataTypes.STRING,
      parentId: DataTypes.INTEGER
    });

    Models.Application.belongsTo(Models.Provider, { foreignKey: 'providerId' });
    Models.Application.belongsTo(Models.Job, { foreignKey: 'jobId' });

    await sequelize.sync();
  } else {
    const { Schema, model } = mongoose;

    Models.User = model('User', new Schema({
      name: String,
      email: { type: String, unique: true },
      passwordHash: String,
      role: { type: String, default: 'user' }
    }, { timestamps: true }));

    Models.Provider = model('Provider', new Schema({
      name: String,
      email: String,
      verified: { type: Boolean, default: false },
      plan: { type: String, default: 'basic' },
      appsCycleKey: String,
      appsCount: { type: Number, default: 0 },
      indemnityAcceptedAt: String
    }, { timestamps: true }));

    Models.Job = model('Job', new Schema({
      title: String,
      description: String,
      location: String,
      category: String,
      status: { type: String, default: 'open' }
    }, { timestamps: true }));

    Models.Application = model('Application', new Schema({
      providerId: Number,
      jobId: Number,
      status: { type: String, default: 'submitted' }
    }, { timestamps: true }));

    Models.Category = model('Category', new Schema({
      name: String,
      icon: String,
      parentId: Number
    }, { timestamps: true }));
  }
  return Models;
};

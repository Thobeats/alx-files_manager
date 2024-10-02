import { MongoClient } from 'mongodb';
import mongoDBCore from 'mongodb/lib/core';

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const db = process.env.DB_DATABASE || 'files_manager';
    const url = `mongodb://${host}:${port}/`;

    this.client = new MongoClient(url, { useUnifiedTopology: true });
    this.client.connect().then(() => {
      this.db = this.client.db(db);
    });
  }

  isAlive() {
    return this.client.isConnected();
  }

  async nbUsers() {
    return this.db.collection('users').countDocuments();
  }

  async nbFiles() {
    return this.db.collection('files').countDocuments();
  }

  async checkUser(email) {
    return this.db.collection('users').findOne({ email });
  }

  async authUser(email, password) {
    return this.db.collection('users').findOne({ email, password });
  }

  async saveNewUser(email, password) {
    return this.db.collection('users').insertOne({ email, password });
  }

  async getUser(userId) {
    return this.db.collection('users').findOne({ _id: new mongoDBCore.BSON.ObjectId(userId) });
  }

  async getFile(fileId) {
    return this.db.collection('files').findOne({ _id: new mongoDBCore.BSON.ObjectId(fileId) });
  }

  async saveFile(fileData) {
    return this.db.collection('files').insertOne(fileData);
  }

  async getUserFile(fileId, userId) {
    return this.db.collection('files').findOne({ _id: new mongoDBCore.BSON.ObjectId(fileId), userId });
  }

  async getParentFiles(parentId, page, limit = 20) {
    return this.db.collection('files').aggregate([
      { $match: { parentId: parentId === '0' ? 0 : parentId } },
      { $skip: limit * (page) },
      { $limit: limit },
    ]).toArray();
  }

  async publishFile(fileId) {
    return this.db.collection('files').updateOne({ _id: new mongoDBCore.BSON.ObjectId(fileId) }, { $set: { isPublic: true } });
  }

  async unpublishFile(fileId) {
    return this.db.collection('files').updateOne({ _id: new mongoDBCore.BSON.ObjectId(fileId) }, { $set: { isPublic: false } });
  }
}

const dbClient = new DBClient();
export default dbClient;

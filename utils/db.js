import { MongoClient } from 'mongodb';

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const db = process.env.DB_DATABASE || 'files_manager';
    const url = `mongodb://${host}:${port}/`;

    this.client = new MongoClient(url);
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

  async saveNewUser(email, password) {
    return this.db.collection('users').insertOne({ email, password });
  }

  async getUser(userId) {
    return this.db.collection('users').findOne({ _id: userId });
  }
}

const dbClient = new DBClient();
export default dbClient;

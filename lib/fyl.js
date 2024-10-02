import fs from 'fs';
import path from 'path';
import process from 'process';
import { v4 as uuidv4 } from 'uuid';

const mime = require('mime-types');

class FYLClient {
  constructor() {
    this.folderPath = path.join('./', process.env.FOLDER_PATH || '/tmp/files_manager');
    this.filePath = path.join(this.folderPath, uuidv4());

    if (!fs.existsSync(this.folderPath)) {
      fs.mkdirSync(this.folderPath, { recursive: true });
    }
  }

  saveFile(data) {
    const decodedData = Buffer.from(data, 'base64').toString();
    fs.writeFile(this.filePath, decodedData, (err) => {
      if (err) {
        console.log(err);
        return false;
      }
      return true;
    });
    return this.filePath;
  }

  getFile(filePath, fileName) {
    this.filePath = filePath;
    if (!fs.existsSync(this.filePath)) return { data: false };
    const data = fs.readFileSync(this.filePath, { encoding: 'utf8', flag: 'r' });
    const type = mime.lookup(fileName);
    return { data, type };
  }
}

const fylClient = new FYLClient();
export default fylClient;

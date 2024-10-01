import fs from 'fs';
import path from 'path';
import process from 'process';
import { v4 as uuidv4 } from 'uuid';

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
}

const fylClient = new FYLClient();
export default fylClient;

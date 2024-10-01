import dbClient from '../utils/db';
import fylClient from '../utils/fyl';

class FilesController {
  static async postUpload(req, res) {
    const requiredTypes = ['folder', 'file', 'image'];
    const file = req.body;
    if (!file) {
      return res.status(400).send({ error: 'Missing data' });
    }

    if (!file.name) return res.status(400).send({ error: 'Missing name' });
    if (!file.type || !requiredTypes.includes(file.type)) {
      return res.status(400).send({ error: 'Missing type' });
    }
    if (!file.data && file.type !== 'folder') return res.status(400).send({ error: 'Missing data' });
    if (file.parentId) {
      const parent = dbClient.getFile(file.parentId);
      if (!parent) return res.status(400).send({ error: 'Parent not found' });
      if (parent.type !== 'folder') return res.status(400).send({ error: 'Parent is not a folder' });
    } else {
      file.parentId = 0;
    }

    file.isPublic = file.isPublic || false;

    const newFile = {
      ...file,
      userId: req.customData.userId,
    };
    if (file.type !== 'folder') {
      newFile.localPath = fylClient.saveFile(file.data);
    }
    const savedFile = await dbClient.saveFile(newFile);
    return res.status(200).send(savedFile.ops[0]);
  }
}

export default FilesController;

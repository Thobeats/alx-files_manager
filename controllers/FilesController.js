import dbClient from '../utils/db';
import fylClient from '../lib/fyl';

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
      const parent = await dbClient.getFile(file.parentId);
      if (!parent) return res.status(400).send({ error: 'Parent not found' });
      if (parent.type !== 'folder') return res.status(400).send({ error: 'Parent is not a folder' });
    } else {
      file.parentId = 0;
    }

    file.isPublic = file.isPublic || false;
    const newFile = {
      userId: req.customData.userId,
      name: file.name,
      type: file.type,
      isPublic: file.isPublic,
      parentId: file.parentId,
    };

    if (file.type !== 'folder') {
      newFile.localPath = fylClient.saveFile(file.data);
    }

    const savedFile = await dbClient.saveFile(newFile);
    const result = {
      id: savedFile.ops[0]._id,
      userId: savedFile.ops[0].userId,
      name: savedFile.ops[0].name,
      type: savedFile.ops[0].type,
      isPublic: savedFile.ops[0].isPublic,
      parentId: savedFile.ops[0].parentId,
    };

    return res.status(201).send(result);
  }

  static async getShow(req, res) {
    const { id } = req.params;
    const { userId } = req.customData;
    const file = await dbClient.getUserFile(id, userId);
    if (!file) return res.status(404).send({ error: 'Not found' });
    const result = {
      id: file._id,
      userId: file.userId,
      name: file.name,
      type: file.type,
      isPublic: file.isPublic,
      parentId: file.parentId,
    };
    if (file.type !== 'folder') {
      result.localPath = file.localPath;
    }
    return res.status(200).send(result);
  }

  static async getIndex(req, res) {
    const { parentId, page } = req.query;
    const files = await dbClient.getParentFiles(parentId, page);
    return res.status(200).send(files);
  }

  static async putPublish(req, res) {
    const { id } = req.params;
    const { userId } = req.customData;
    const file = await dbClient.getUserFile(id, userId);
    if (!file) return res.status(404).send({ error: 'Not found' });
    await dbClient.publishFile(id);
    const result = {
      id, userId, name: file.name, type: file.type, isPublic: true, parentId: file.parentId,
    };
    if (file.type !== 'folder') {
      result.localPath = file.localPath;
    }
    return res.status(200).send(result);
  }
}

export default FilesController;

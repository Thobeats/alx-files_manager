import dbClient from '../utils/db';
import redisClient from '../utils/redis';
import sha1 from 'sha1';

const { v4: uuidv4 } = require('uuid');

class AuthController {
  static async getConnect(req, res) {
    const token = req.header('Authorization');
    const encodedToken = Buffer.from(token.split(' ')[1], 'base64').toString();

    const [email, password] = encodedToken.split(':');

    if (!email || !password) {
      return res.status(401).send({ error: 'Unauthorized' });
    }

    const user = await dbClient.authUser(email, password);
    if (!user) {
      return res.status(401).send({ error: 'Unauthorized' });
    }

    const newToken = uuidv4();
    redisClient.set(`auth_${newToken}`, user._id, 86400);
    return res.status(200).send({ token: newToken });
  }

  static getDisconnect(req, res) {
    const token = req.header('X-Token');
    const userId = redisClient.get(`auth_${token}`);
    if (!userId) {
      return res.status(401).send({ error: 'Unauthorized' });
    }
    redisClient.del(`auth_${token}`);
    return res.status(204).send();
  }
}

export default AuthController;

import { uuidv4 } from 'uuid';
import { atob } from 'atob';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class AuthController {
  static getConnect(req, res) {
    const token = req.header('Authorization');
    const encodedToken = atob(token);
    const [email, password] = encodedToken.split(':');

    if (!email || !password) {
      return res.status(401).send({ error: 'Unauthorized' });
    }

    const user = dbClient.checkUser(email);
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

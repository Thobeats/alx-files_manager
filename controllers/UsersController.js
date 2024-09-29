import sha1 from 'sha1';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class UserController {
  static async postNew(req, res) {
    const { email } = req.body;
    let { password } = req.body;

    if (!email) return res.status(400).send({ error: 'Missing email' });
    if (!password) return res.status(400).send({ error: 'Missing password' });

    const checkEmail = await dbClient.checkUser(email);
    if (checkEmail) return res.status(400).send({ error: 'Already exist' });

    password = sha1(password);

    const saveUser = await dbClient.saveNewUser(email, password);

    return res.status(201).send({ id: saveUser.ops[0]._id, email: saveUser.ops[0].email });
  }

  static async getMe(req, res) {
    const token = req.header('X-Token');
    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) return res.status(401).send({ error: 'Unauthorized' });
    const user = await dbClient.getUser(userId);
    return res.status(200).send({ id: user._id, email: user.email });
  }
}

export default UserController;

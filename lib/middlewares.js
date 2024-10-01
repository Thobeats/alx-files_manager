import redisClient from '../utils/redis';

class Middleware {
  static async authMiddleware(req, res) {
    const token = req.header('X-Token');
    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) return res.status(401).send({ error: 'Unauthorized' });
    req.customData = {
      userId,
    };
    return null;
  }
}

export default Middleware;

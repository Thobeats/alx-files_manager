import getRoute from './routes';
import Middleware from './lib/middlewares';

const express = require('express');

const app = express();
const router = express.Router();

const PORT = process.env.PORT || 5000;

app.use(express.json({ limit: '200mb' }));
router.use(Middleware.authMiddleware);

getRoute(app, router);

app.use('', router);

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});

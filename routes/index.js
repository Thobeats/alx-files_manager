import AppController from '../controllers/AppController';

const getRoute = (app) => {
  app.get('/status', AppController.getStatus);
  app.get('/stats', AppController.getStats);
};

export default getRoute;

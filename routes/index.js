import multipart from 'connect-multiparty';
import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController';
import FilesController from '../controllers/FilesController';

const getRoute = (app, router) => {
  app.get('/status', AppController.getStatus);
  app.get('/stats', AppController.getStats);
  app.post('/users', UsersController.postNew);
  app.get('/connect', AuthController.getConnect);
  app.get('/disconnect', AuthController.getDisconnect);
  router.get('/users/me', UsersController.getMe);
  router.post('/files', multipart(), FilesController.postUpload);
  router.get('/files/:id', multipart(), FilesController.getShow);
  router.get('/files', multipart(), FilesController.getIndex);
};

export default getRoute;

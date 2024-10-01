import multipart from 'connect-multiparty';
import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController';
import FilesController from '../controllers/FilesController';

const getRoute = (app, router) => {
  app.get('/status', AppController.getStatus);
  app.get('/stats', AppController.getStats);
  app.post('/users', UsersController.postNew);
  router.get('/users/me', UsersController.getMe);
  app.get('/connect', AuthController.getConnect);
  app.get('/disconnect', AuthController.getDisconnect);

  router.post('/files', multipart(), FilesController.postUpload);
  router.get('/files/:id', multipart(), FilesController.getShow);
  router.get('/files', multipart(), FilesController.getIndex);

  app.use('', router);
};

export default getRoute;

import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController';
import FilesController from '../controllers/FilesController';

const getRoute = (app, router) => {
  app.get('/status', AppController.getStatus);
  app.get('/stats', AppController.getStats);
  app.post('/users', UsersController.postNew);
  app.get('/connect', AuthController.getConnect);
  router.get('/disconnect', AuthController.getDisconnect);
  router.get('/users/me', UsersController.getMe);
  router.post('/files', FilesController.postUpload);
  router.get('/files/:id', FilesController.getShow);
  router.get('/files', FilesController.getIndex);
  router.put('/files/:id/publish', FilesController.putPublish);
  router.put('/files/:id/unpublish', FilesController.putUnpublish);
};

export default getRoute;

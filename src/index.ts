import http, { IncomingMessage, ServerResponse } from 'http';
import dotenv from 'dotenv';
import Router from './router/Router.js';
import RouterController from './router/RouterController.js';
import { userRouter } from './router/userRouter.js';
import { bodyParser } from './utils/bodyParser.js';
import { errorResponse } from './utils/util.js';

dotenv.config();

const port = process.env.PORT || 3000;

const routerController = new RouterController();

routerController.addRoute('/users', userRouter);

const server = http.createServer(async (req: IncomingMessage, res: ServerResponse) => {
  let body = {};
  try {
    body = await bodyParser(req);
  } catch (e) {
    console.log(e, 'from create');
    return errorResponse(req, res, 400, 'Wrong body. Wrong JSON format.');
  }
  const reqWithBody = Object.assign({ body }, req);
  routerController.handle(reqWithBody, res);
});

server.listen(port, () => {
  console.log('server listen on port', port);
});

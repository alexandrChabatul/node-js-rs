import http, { IncomingMessage, ServerResponse } from 'http';
import RouterController from './router/RouterController.js';
import { userRouter } from './router/userRouter.js';
import { bodyParser } from './utils/bodyParser.js';
import { errorResponse } from './utils/util.js';

const createServer = (port: string | undefined) => {
  const currentPort = port || 3000;
  
  const routerController = new RouterController();
  
  routerController.addRoute('/api/users', userRouter);
  
  const server = http.createServer(async (req: IncomingMessage, res: ServerResponse) => {
    let body = {};
    try {
      body = await bodyParser(req);
    } catch (e) {
      return errorResponse(req, res, 400, 'Wrong body. Wrong JSON format.');
    }
    const reqWithBody = Object.assign({ body }, req);
    routerController.handle(reqWithBody, res);
  });
  
  server.listen(currentPort, () => {
    console.log('server listen on port', currentPort);
  });

}

export { createServer };

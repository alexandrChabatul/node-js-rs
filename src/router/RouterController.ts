import { IncomingMessage, ServerResponse } from 'http'
import Router from './Router.js'
import { errorResponse } from '../utils/util.js';

export default class RouterController {
  routes: { path: string; router: Router }[] = []

  addRoute(path: string, router: Router) {
    router.setPath(path);
    this.routes.push({ path, router })
  }

  handle(req: IncomingMessage, res: ServerResponse) {
    const pathAndRoute = this.routes.find(el => {
      req.url?.startsWith(el.path)
    })
    if (!pathAndRoute) {
      errorResponse(req, res, 404, 'Wrong url. Path not found.');
    } else {
      pathAndRoute.router.handle(req, res);
    }
  }
}

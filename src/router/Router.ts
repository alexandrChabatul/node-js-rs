import { IncomingMessage, ServerResponse } from 'http';
import { errorResponse } from '../utils/util.js';

export interface ReqWithBodyAndParams extends RequestWithBody {
  params: { [key: string]: string };
}
export interface RequestWithBody extends IncomingMessage {
  body: any;
}

/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable  no-case-declarations */
export default class Router {
  path = '';
  getMap: { path: string; handler: (...args: any) => any }[] = [];
  postMap: { path: string; handler: (...args: any) => any }[] = [];
  deleteMap: { path: string; handler: (...args: any) => any }[] = [];
  putMap: { path: string; handler: (...args: any) => any }[] = [];

  setPath(path: string) {
    this.path = path;
  }

  get(path: string, handler: (...args: any) => any) {
    this.getMap.push({ path, handler });
  }

  post(path: string, handler: (...args: any) => any) {
    this.postMap.push({ path, handler });
  }

  put(path: string, handler: (...args: any) => any) {
    this.putMap.push({ path, handler });
  }

  delete(path: string, handler: (...args: any) => any) {
    this.deleteMap.push({ path, handler });
  }

  handle(req: RequestWithBody, res: ServerResponse) {
    switch (req.method) {
      case 'GET':
        const getPath = this.getMap.find(el => {
          if (req.url) {
            return this.checkPath(req.url, this.path + el.path);
          } else {
            return false;
          }
        });
        this.handlePath(req, res, getPath);
        break;
      case 'POST':
        const postPath = this.postMap.find(el => {
          if (req.url) {
            return this.checkPath(req.url, this.path + el.path);
          } else {
            return false;
          }
        });
        this.handlePath(req, res, postPath);
        break;
      case 'PUT':
        const putPath = this.putMap.find(el => {
          if (req.url) {
            return this.checkPath(req.url, this.path + el.path);
          } else {
            return false;
          }
        });
        this.handlePath(req, res, putPath);
        break;
      case 'DELETE':
        const deletePath = this.deleteMap.find(el => {
          if (req.url) {
            return this.checkPath(req.url, this.path + el.path);
          } else {
            return false;
          }
        });
        this.handlePath(req, res, deletePath);
        break;
      default:
        errorResponse(req, res, 404, 'Wrong url. Path not found.');
        break;
    }
  }

  private async handlePath(
    req: RequestWithBody,
    res: ServerResponse,
    path?: { path: string; handler: (req: ReqWithBodyAndParams, res: ServerResponse) => any },
  ) {
    if (!path) {
      errorResponse(req, res, 404, 'Wrong url. Path not found.');
    } else {
      let params = {};
      if (req.url) {
        params = this.getParams(req.url, this.path + path.path);
      }
      const newReq: ReqWithBodyAndParams = Object.assign({ params }, req);
      await path.handler(newReq, res);
    }
  }

  private checkPath(url: string, path: string) {
    const paramRegex = /\{([^}]+)\}/g;
    const paramMatches = path.match(paramRegex);
    if (paramMatches) {
      const regexPattern = path.replace(/\{([^}]+)\}/g, '([^/]+)');
      const regex = new RegExp(`^${regexPattern}$`);
      return regex.test(url);
    } else {
      return url === path;
    }
  }

  getParams(url: string, path: string): { [key: string]: string } {
    console.log(url, path);
    const regexPattern = path.replace(/\{([^}]+)\}/g, '([^/]+)');
    const regex = new RegExp(`^${regexPattern}$`);
    const matches = url.match(regex);

    if (matches) {
      const paramNames = path.match(/\{([^}]+)\}/g)?.map(match => match.slice(1, -1));
      const params: { [key: string]: string } = {};
      if (!paramNames) return {};
      paramNames.forEach((paramName, index) => {
        params[paramName] = matches[index + 1];
      });
      return params;
    } else {
      return {};
    }
  }
}

import { IncomingMessage, ServerResponse } from 'http'
import { errorResponse } from '../utils/util.js'

export interface IncomingMessageWithParams extends IncomingMessage {
  params: { [key: string]: string }
}

/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable  no-case-declarations */
export default class Router {
  path = ''
  getMap: { path: string; handler: (...args: any) => any }[] = []
  postMap: { path: string; handler: (...args: any) => any }[] = []
  deleteMap: { path: string; handler: (...args: any) => any }[] = []
  putMap: { path: string; handler: (...args: any) => any }[] = []

  setPath(path: string) {
    this.path = path
  }

  get(path: string, handler: (...args: any) => any) {
    this.getMap.push({ path, handler })
  }

  post(path: string, handler: (...args: any) => any) {
    this.postMap.push({ path, handler })
  }

  put(path: string, handler: (...args: any) => any) {
    this.putMap.push({ path, handler })
  }

  delete(path: string, handler: (...args: any) => any) {
    this.deleteMap.push({ path, handler })
  }

  handle(req: IncomingMessage, res: ServerResponse) {
    switch (req.method) {
      case 'get':
        const getPath = this.getMap.find(el => {
          if (req.url) {
            return this.checkPath(req.url, el.path)
          } else {
            return false
          }
        })
        this.handlePath(req, res, getPath)
        break
      case 'post':
        const postPath = this.getMap.find(el => {
          if (req.url) {
            return this.checkPath(req.url, el.path)
          } else {
            return false
          }
        })
        this.handlePath(req, res, postPath)
        break
      case 'put':
        const putPath = this.getMap.find(el => {
          if (req.url) {
            return this.checkPath(req.url, el.path)
          } else {
            return false
          }
        })
        this.handlePath(req, res, putPath)
        break
      case 'delete':
        const deletePath = this.getMap.find(el => {
          if (req.url) {
            return this.checkPath(req.url, el.path)
          } else {
            return false
          }
        })
        this.handlePath(req, res, deletePath)
        break
      default:
        errorResponse(req, res, 404, 'Wrong url. Path not found.')
        break
    }
  }

  private handlePath(
    req: IncomingMessage,
    res: ServerResponse,
    path?: { path: string; handler: (req: IncomingMessageWithParams, res: ServerResponse) => any },
  ) {
    if (!path) {
      errorResponse(req, res, 404, 'Wrong url. Path not found.')
    } else {
      let params = {}
      if (req.url) {
        params = this.getParams(req.url, path.path)
      }
      const newReq: IncomingMessageWithParams = Object.assign({ params }, req)
      path.handler(newReq, res)
    }
  }

  private checkPath(url: string, path: string) {
    const paramRegex = /\{([^}]+)\}/g
    const paramMatches = path.match(paramRegex)
    if (paramMatches) {
      const regexPattern = path.replace(/\{([^}]+)\}/g, '([^/]+)')
      const regex = new RegExp(`^${regexPattern}$`)
      return regex.test(url)
    } else {
      return url === path;
    }
  }

  getParams(url: string, path: string): { [key: string]: string } {
    const regexPattern = path.replace(/\{([^}]+)\}/g, '([^/]+)')
    const regex = new RegExp(`^${regexPattern}$`)
    const matches = url.match(regex)

    if (matches) {
      const paramNames = path.match(/\{([^}]+)\}/g)?.map(match => match.slice(1, -1))
      const params: { [key: string]: string } = {}
      if (!paramNames) return {}
      paramNames.forEach((paramName, index) => {
        params[paramName] = matches[index + 1]
      })
      return params
    } else {
      return {}
    }
  }
}

import { ServerResponse } from 'http'
import { UserService } from '../services/UserService.js'
import { IncomingMessageWithParams } from '../router/Router.js'
import { errorResponse } from '../utils/util.js'
import { bodyParser } from '../utils/bodyParser.js'
import { ServerError } from '../errors/ServerError.js'

export class UserController {
  userService = new UserService()

  getUsers(req: IncomingMessageWithParams, res: ServerResponse) {
    try {
      const result = this.userService.getAllUsers()
      res.statusCode = 200
      res.write(result)
      return res.end()
    } catch (e) {
      if (e instanceof ServerError) {
        errorResponse(req, res, e.code, e.message);
      } else {
        errorResponse(req, res, 500, "Internal Server Error.");
      }
    }
  }

  getUserById(req: IncomingMessageWithParams, res: ServerResponse) {
    try {
      const id = req.params['id']
      if (!id) errorResponse(req, res, 400, "Bad request. Id param don't found.")
      const result = this.userService.getUserById(id)
      res.statusCode = 200
      res.write(result)
      return res.end()
    } catch (e) {
      if (e instanceof ServerError) {
        errorResponse(req, res, e.code, e.message);
      } else {
        errorResponse(req, res, 500, "Internal Server Error.");
      }
    }
  }

  async postUser(req: IncomingMessageWithParams, res: ServerResponse) {
    try {
      const { username, age, hobbies } = await bodyParser(req)
      if (!username || !age || !hobbies) errorResponse(req, res, 400, 'Bad request. User model is incorrect.')
      const result = this.userService.addUser(username, age, hobbies)
      res.statusCode = 201
      res.write(result)
      return res.end()
    } catch (e) {
      if (e instanceof ServerError) {
        errorResponse(req, res, e.code, e.message);
      } else {
        errorResponse(req, res, 500, "Internal Server Error.");
      }
    }
  }

  async editUsers(req: IncomingMessageWithParams, res: ServerResponse) {
    try {
      const { username, age, hobbies } = await bodyParser(req)
      if (!username || !age || !hobbies) errorResponse(req, res, 400, 'Bad request. User model is incorrect.')
      const result = this.userService.editUser(username, age, hobbies)
      res.statusCode = 200
      res.write(result)
      return res.end()
    } catch (e) {
      if (e instanceof ServerError) {
        errorResponse(req, res, e.code, e.message);
      } else {
        errorResponse(req, res, 500, "Internal Server Error.");
      }
    }
  }

  deleteUsers(req: IncomingMessageWithParams, res: ServerResponse) {
    try {
      const id = req.params['id']
      if (!id) errorResponse(req, res, 400, "Bad request. Id param don't found.")
      const result = this.userService.deleteUser(id);
      if (result) {
        res.statusCode = 204
        return res.end()
      } else {
        errorResponse(req, res, 500, "Internal Server Error.");
      }
    } catch (e) {
      if (e instanceof ServerError) {
        errorResponse(req, res, e.code, e.message);
      } else {
        errorResponse(req, res, 500, "Internal Server Error.");
      }
    }
  }
}

import { ServerResponse } from 'http';
import { UserService } from '../services/UserService.js';
import { ReqWithBodyAndParams } from '../router/Router.js';
import { errorResponse } from '../utils/util.js';
import { ServerError } from '../errors/ServerError.js';

export class UserController {
  userService = new UserService();

  getUsers(req: ReqWithBodyAndParams, res: ServerResponse) {
    try {
      const result = this.userService.getAllUsers();
      console.log(result, 'from controller');
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.write(JSON.stringify(result));
      return res.end();
    } catch (e) {
      console.log(e)
      if (e instanceof ServerError) {
        return errorResponse(req, res, e.code, e.message);
      } else {
        return errorResponse(req, res, 500, 'Internal Server Error.');
      }
    }
  }

  getUserById(req: ReqWithBodyAndParams, res: ServerResponse) {
    try {
      const id = req.params['id'];
      if (!id) return errorResponse(req, res, 400, "Bad request. Id param don't found.");
      const result = this.userService.getUserById(id);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.write(JSON.stringify(result));
      return res.end();
    } catch (e) {
      if (e instanceof ServerError) {
        return errorResponse(req, res, e.code, e.message);
      } else {
        return errorResponse(req, res, 500, 'Internal Server Error.');
      }
    }
  }

  async postUser(req: ReqWithBodyAndParams, res: ServerResponse) {
    try {
      const { username, age, hobbies } = req.body;
      if (!username || !age || !hobbies) return errorResponse(req, res, 400, 'Bad request. User model is incorrect.');
      this.checkUserBody(username, age, hobbies);
      const result = await this.userService.addUser(username, age, hobbies);
      res.statusCode = 201;
      res.setHeader('Content-Type', 'application/json');
      res.write(JSON.stringify(result));
      return res.end();
    } catch (e) {
      console.log(e)
      if (e instanceof ServerError) {
        return errorResponse(req, res, e.code, e.message);
      } else {
        return errorResponse(req, res, 500, 'Internal Server Error.');
      }
    }
  }

  async editUsers(req: ReqWithBodyAndParams, res: ServerResponse) {
    try {
      const id = req.params['id'];
      if (!id) return errorResponse(req, res, 400, "Bad request. Id param don't found.");
      const { username, age, hobbies } = req.body;
      if (!username || !age || !hobbies) return errorResponse(req, res, 400, 'Bad request. User model is incorrect.');
      this.checkUserBody(username, age, hobbies);
      const result = await this.userService.editUser(id, username, age, hobbies);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.write(JSON.stringify(result));
      return res.end();
    } catch (e) {
      console.log(e)
      if (e instanceof ServerError) {
        return errorResponse(req, res, e.code, e.message);
      } else {
        return errorResponse(req, res, 500, 'Internal Server Error.');
      }
    }
  }

  async deleteUsers(req: ReqWithBodyAndParams, res: ServerResponse) {
    try {
      const id = req.params['id'];
      if (!id) errorResponse(req, res, 400, "Bad request. Id param don't found.");
      const result = await this.userService.deleteUser(id);
      if (result) {
        res.statusCode = 204;
        return res.end();
      } else {
        errorResponse(req, res, 500, 'Internal Server Error.');
      }
    } catch (e) {
      if (e instanceof ServerError) {
        errorResponse(req, res, e.code, e.message);
      } else {
        errorResponse(req, res, 500, 'Internal Server Error.');
      }
    }
  }

  private checkUserBody(username: any, age: any, hobbies: any) {
    if (typeof username !== 'string') throw new ServerError(400, 'Username should be string.');
    if (typeof age !== 'number') throw new ServerError(400, 'Age should be number.');
    if (!Array.isArray(hobbies) || hobbies.some(el => typeof el !== 'string')) 
      throw new ServerError(400, 'Hobbies shold be string array.')
  }
}

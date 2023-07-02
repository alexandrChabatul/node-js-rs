import { UserController } from "../controllers/UserController.js";
import Router from "./Router.js";

const userRouter = new Router();

const controller = new UserController();

userRouter.get('', controller.getUsers.bind(controller));
userRouter.get('/{id}', controller.getUserById.bind(controller));
userRouter.post('', controller.postUser.bind(controller));
userRouter.put('/{id}', controller.editUsers.bind(controller));
userRouter.delete('/{id}', controller.deleteUsers.bind(controller));

export {userRouter};
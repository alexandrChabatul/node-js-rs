import { UserController } from "../controllers/UserController.js";
import Router from "./Router.js";

const userRouter = new Router();

const controller = new UserController();

userRouter.get('/', controller.getUsers);
userRouter.get('/{id}', controller.getUserById);
userRouter.post('/', controller.postUser);
userRouter.put('/', controller.editUsers);
userRouter.delete('/', controller.deleteUsers);
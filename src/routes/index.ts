import { Router } from "express";

import { validateData } from "../middlewares/validationMiddleware";
import { authMiddleware } from "../middlewares/authMiddleware";

import { userRegistrationSchema, userLoginShema } from "../schemas/userSchemas";
import UserController from "../controllers/userController";

const routes = Router();

const userController = new UserController();

routes.post("/accounts", validateData(userRegistrationSchema), userController.create);
routes.post("/accounts/login", validateData(userLoginShema), userController.login);

export default routes;
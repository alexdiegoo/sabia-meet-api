import { Router } from "express";

import { validateData } from "../middlewares/validationMiddleware";

import { userRegistrationSchema } from "../schemas/userSchemas";
import UserController from "../controllers/userController";

const routes = Router();

const userController = new UserController();

routes.post("/accounts", validateData(userRegistrationSchema), userController.create);

export default routes;
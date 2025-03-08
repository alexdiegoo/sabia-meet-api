import { Router } from "express";

import { validateData } from "../middlewares/validationMiddleware";
import { authMiddleware } from "../middlewares/authMiddleware";

import { userRegistrationSchema, userLoginShema } from "../schemas/userSchemas";
import UserController from "../controllers/userController";

import { createIntegrationSchema } from "../schemas/integrationSchemas";
import { IntegrationController } from "../controllers/integrationController";

const routes = Router();

const userController = new UserController();
const integrationController = new IntegrationController();

routes.post("/accounts", validateData(userRegistrationSchema), userController.create);
routes.post("/accounts/login", validateData(userLoginShema), userController.login);

routes.get("/integrations", authMiddleware, integrationController.list);
routes.post("/integrations", authMiddleware, validateData(createIntegrationSchema), integrationController.create);
routes.delete("/integrations/:id", authMiddleware, integrationController.delete);

export default routes;
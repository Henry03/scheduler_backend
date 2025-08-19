import { Router } from "express";
import authenticateJWT from "../middlewares/authenticateJWT";
import { createScheduleValidation } from "../validations/schedule.validation";
import { validateRequest } from "../middlewares/validateRequest";
import * as scheduleController from "../controllers/schedule.controller";

const router = Router();

router.use(authenticateJWT);

router.post('/create', createScheduleValidation, validateRequest, scheduleController.create)

export default router;
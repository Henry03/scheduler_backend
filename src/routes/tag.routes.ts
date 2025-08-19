import { Router } from 'express';
import * as tagController from '../controllers/tag.controller';
import { validateRequest } from '../middlewares/validateRequest';
import authenticateJWT from '../middlewares/authenticateJWT';
import { createTagValidation } from '../validations/tag.validation';

const router = Router();

router.use(authenticateJWT);
router.post('/create', createTagValidation, validateRequest, tagController.create);

export default router;
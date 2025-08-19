import { Router } from 'express';
import * as channelController from '../controllers/channel.controller';
import { validateRequest } from '../middlewares/validateRequest';
import { createChannelValidation } from '../validations/channel.validation';
import authenticateJWT from '../middlewares/authenticateJWT';

const router = Router();

router.use(authenticateJWT);
router.post('/create', createChannelValidation, validateRequest, channelController.create);

export default router;
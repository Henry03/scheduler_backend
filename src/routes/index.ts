import { Router } from 'express';

import authRoutes from './auth.routes';
import scheduleRoutes from './schedule.routes';
import channelRoutes from './channel.routes';
import tagRoutes from './tag.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/schedules', scheduleRoutes);
router.use('/channels', channelRoutes);
router.use('/tags', tagRoutes)

export default router;
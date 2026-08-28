import { Router, Request, Response } from 'express';
import { NotificationController } from './notification.controller';
import { asyncHandler } from '../../common/utils/async-handler';
import { paginationValidation, idValidation } from '../rules/rule.validation';

const router = Router();
const controller = new NotificationController();

router.get('/stats', asyncHandler((req: Request, res: Response) => controller.getStats(req, res)));
router.get('/', paginationValidation, asyncHandler((req: Request, res: Response) => controller.getAll(req, res)));
router.get('/:id', idValidation, asyncHandler((req: Request, res: Response) => controller.getById(req, res)));

export default router;

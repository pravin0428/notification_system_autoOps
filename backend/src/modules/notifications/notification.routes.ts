import { Router, Request, Response } from 'express';
import { NotificationController } from './notification.controller';
import { paginationValidation, idValidation } from '../rules/rule.validation';

const router = Router();
const controller = new NotificationController();

router.get('/stats', (req: Request, res: Response) => controller.getStats(req, res));
router.get('/', paginationValidation, (req: Request, res: Response) => controller.getAll(req, res));
router.get('/:id', idValidation, (req: Request, res: Response) => controller.getById(req, res));

export default router;

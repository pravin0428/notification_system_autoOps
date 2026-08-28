import { Router, Request, Response } from 'express';
import { EventController } from './event.controller';
import { eventValidation } from '../rules/rule.validation';
import { asyncHandler } from '../../common/utils/async-handler';

const router = Router();
const controller = new EventController();

router.post('/', eventValidation, asyncHandler((req: Request, res: Response) => controller.trigger(req, res)));

export default router;

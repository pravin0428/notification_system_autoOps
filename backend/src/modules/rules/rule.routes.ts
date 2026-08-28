import { Router, Request, Response } from 'express';
import { RuleController } from './rule.controller';
import { asyncHandler } from '../../common/utils/async-handler';
import {
  createRuleValidation,
  updateRuleValidation,
  idValidation,
} from './rule.validation';

const router = Router();
const controller = new RuleController();

router.get('/', asyncHandler((req: Request, res: Response) => controller.getAll(req, res)));
router.get('/:id', idValidation, asyncHandler((req: Request, res: Response) => controller.getById(req, res)));
router.post('/', createRuleValidation, asyncHandler((req: Request, res: Response) => controller.create(req, res)));
router.put('/:id', updateRuleValidation, asyncHandler((req: Request, res: Response) => controller.update(req, res)));
router.patch('/:id/status', idValidation, asyncHandler((req: Request, res: Response) => controller.updateStatus(req, res)));
router.delete('/:id', idValidation, asyncHandler((req: Request, res: Response) => controller.delete(req, res)));

export default router;

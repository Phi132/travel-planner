import { Router } from 'express';
import * as journalController from '../controllers/journal.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  createJournalSchema,
  updateJournalSchema,
  listJournalsQuerySchema,
  journalIdParamSchema
} from '../validators/journal.validator.js';

const router = Router();

// Toàn bộ route Journals đều thao tác trên dữ liệu của chính user đang đăng nhập.
router.use(authenticate);

router.get('/', validate(listJournalsQuerySchema, 'query'), journalController.list);
router.post('/', validate(createJournalSchema), journalController.create);
router.get('/:id', validate(journalIdParamSchema, 'params'), journalController.getOne);
router.patch(
  '/:id',
  validate(journalIdParamSchema, 'params'),
  validate(updateJournalSchema),
  journalController.update
);
router.delete('/:id', validate(journalIdParamSchema, 'params'), journalController.remove);

export default router;

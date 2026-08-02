import { Router } from 'express';
import * as expenseController from '../controllers/expense.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  createExpenseSchema,
  updateExpenseSchema,
  listExpensesQuerySchema,
  expenseSummaryQuerySchema,
  expenseIdParamSchema
} from '../validators/expense.validator.js';

const router = Router();

// Toàn bộ route Expenses đều thao tác trên dữ liệu của chính user đang đăng nhập.
router.use(authenticate);

router.get('/summary', validate(expenseSummaryQuerySchema, 'query'), expenseController.summary);
router.get('/', validate(listExpensesQuerySchema, 'query'), expenseController.list);
router.post('/', validate(createExpenseSchema), expenseController.create);
router.get('/:id', validate(expenseIdParamSchema, 'params'), expenseController.getOne);
router.patch(
  '/:id',
  validate(expenseIdParamSchema, 'params'),
  validate(updateExpenseSchema),
  expenseController.update
);
router.delete('/:id', validate(expenseIdParamSchema, 'params'), expenseController.remove);

export default router;

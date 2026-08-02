import { forwardRef } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { ExpenseCategoryIcon, EXPENSE_CATEGORY_LABELS } from '@/components/expenses/ExpenseCategoryBadge';
import { formatCurrency, formatDate } from '@/lib/utils';

export const ExpenseListItem = forwardRef(function ExpenseListItem({ expense, onEdit, onDelete }, ref) {
  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3.5"
    >
      <ExpenseCategoryIcon category={expense.category} />

      <div className="min-w-0 flex-1">
        <p className="font-semibold text-[15px] truncate">
          {expense.description || EXPENSE_CATEGORY_LABELS[expense.category]}
        </p>
        <p className="text-xs text-muted-foreground">{formatDate(expense.date)}</p>
      </div>

      <div className="text-right shrink-0">
        <p className="font-bold text-[15px]">{formatCurrency(expense.amount)}</p>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => onEdit(expense)}
          className="h-8 w-8 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => onDelete(expense)}
          className="h-8 w-8 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </motion.div>
  );
});

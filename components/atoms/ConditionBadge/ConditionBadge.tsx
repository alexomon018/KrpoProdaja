import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import cn from '@/lib/utils';

const conditionBadgeVariants = cva(
  'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors',
  {
    variants: {
      condition: {
        new: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        'very-good': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
        good: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
        satisfactory: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
      },
    },
    defaultVariants: {
      condition: 'good',
    },
  }
);

export interface ConditionBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof conditionBadgeVariants> {
  condition: 'new' | 'very-good' | 'good' | 'satisfactory';
}

const ConditionBadge = forwardRef<HTMLSpanElement, ConditionBadgeProps>(
  ({ className, condition, ...props }, ref) => {
    const conditionLabels = {
      new: 'Novo',
      'very-good': 'Veoma dobro',
      good: 'Dobro',
      satisfactory: 'Zadovoljavajuće',
    };

    return (
      <span
        ref={ref}
        className={cn(conditionBadgeVariants({ condition }), className)}
        {...props}
      >
        {conditionLabels[condition]}
      </span>
    );
  }
);

ConditionBadge.displayName = 'ConditionBadge';

export { ConditionBadge, conditionBadgeVariants };

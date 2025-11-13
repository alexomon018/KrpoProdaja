import { forwardRef } from 'react';
import cn from '@/lib/utils';

export interface ItemDetail {
  label: string;
  value: string;
}

export interface ProductDescriptionProps extends React.HTMLAttributes<HTMLDivElement> {
  description: string;
  details?: ItemDetail[];
}

const ProductDescription = forwardRef<HTMLDivElement, ProductDescriptionProps>(
  ({ className, description, details = [], ...props }, ref) => {
    return (
      <div ref={ref} className={cn('space-y-6', className)} {...props}>
        {/* Description Section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Description
          </h2>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
            {description}
          </p>
        </div>

        {/* Item Details Table */}
        {details.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Item Details
            </h2>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <table className="w-full">
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {details.map((detail, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white w-1/3">
                        {detail.label}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                        {detail.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  }
);

ProductDescription.displayName = 'ProductDescription';

export { ProductDescription };

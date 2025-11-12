import React from 'react';
import { Truck, Package, MapPin } from 'lucide-react';
import cn, { formatPrice } from '@/lib/utils';

export interface ShippingOption {
  id: string;
  name: string;
  price: number;
  estimatedDays: string;
  icon?: 'truck' | 'package' | 'mappin';
}

export interface ShippingOptionsProps extends React.HTMLAttributes<HTMLDivElement> {
  options: ShippingOption[];
  location?: string;
}

const ShippingOptions = React.forwardRef<HTMLDivElement, ShippingOptionsProps>(
  ({ className, options, location, ...props }, ref) => {
    const getIcon = (iconType?: string) => {
      switch (iconType) {
        case 'truck':
          return <Truck className="h-5 w-5 text-primary-600 dark:text-primary-400" />;
        case 'package':
          return <Package className="h-5 w-5 text-primary-600 dark:text-primary-400" />;
        case 'mappin':
          return <MapPin className="h-5 w-5 text-primary-600 dark:text-primary-400" />;
        default:
          return <Truck className="h-5 w-5 text-primary-600 dark:text-primary-400" />;
      }
    };

    return (
      <div ref={ref} className={cn('space-y-4', className)} {...props}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Shipping Options
          </h2>
          {location && (
            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
              <MapPin className="h-4 w-4" />
              <span>{location}</span>
            </div>
          )}
        </div>

        <div className="space-y-3">
          {options.map((option) => (
            <div
              key={option.id}
              className="flex items-start gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-500 dark:hover:border-primary-500 transition-colors cursor-pointer"
            >
              <div className="flex-shrink-0 mt-0.5">{getIcon(option.icon)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    {option.name}
                  </h3>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                    {option.price === 0 ? 'Free' : formatPrice(option.price)}
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Estimated delivery: {option.estimatedDays}
                </p>
              </div>
            </div>
          ))}
        </div>

        {options.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No shipping options available</p>
          </div>
        )}
      </div>
    );
  }
);

ShippingOptions.displayName = 'ShippingOptions';

export { ShippingOptions };

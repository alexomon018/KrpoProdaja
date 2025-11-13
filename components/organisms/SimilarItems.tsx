import { forwardRef } from 'react';
import cn from '@/lib/utils';
import { ProductCard } from '@/components/molecules/ProductCard/ProductCard';
import type { ProductType } from '@/lib/types';

export interface SimilarItemsProps extends React.HTMLAttributes<HTMLDivElement> {
  products: ProductType[];
  currentProductId?: string;
  onFavoriteClick?: (productId: string) => void;
}

const SimilarItems = forwardRef<HTMLDivElement, SimilarItemsProps>(
  ({ className, products, currentProductId, onFavoriteClick, ...props }, ref) => {
    // Filter out current product from similar items
    const filteredProducts = products.filter(
      (product) => product.id !== currentProductId
    );

    if (filteredProducts.length === 0) {
      return null;
    }

    return (
      <div ref={ref} className={cn('space-y-6', className)} {...props}>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Similar Items
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.slice(0, 8).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onFavoriteClick={onFavoriteClick}
            />
          ))}
        </div>
      </div>
    );
  }
);

SimilarItems.displayName = 'SimilarItems';

export { SimilarItems };

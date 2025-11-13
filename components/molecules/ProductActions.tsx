'use client';

import { forwardRef } from 'react';
import { MessageCircle } from 'lucide-react';
import cn from '@/lib/utils';
import { Button } from '@/components/atoms/Button/Button';

export interface ProductActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  onMessageSeller?: () => void;
  sellerId: string;
  productId: string;
}

const ProductActions = forwardRef<HTMLDivElement, ProductActionsProps>(
  (
    {
      className,
      onMessageSeller,
      sellerId,
      productId,
      ...props
    },
    ref
  ) => {
    const handleMessageSeller = () => {
      if (onMessageSeller) {
        onMessageSeller();
      } else {
        console.log(`Message seller ${sellerId} about product ${productId}`);
        // TODO: Implement messaging functionality
      }
    };

    return (
      <div ref={ref} className={cn('space-y-3', className)} {...props}>
        {/* Message Seller Button */}
        <Button
          variant="primary"
          size="default"
          onClick={handleMessageSeller}
          className="w-full text-base py-3"
        >
          <MessageCircle className="mr-2 h-5 w-5" />
          Message Seller
        </Button>
      </div>
    );
  }
);

ProductActions.displayName = 'ProductActions';

export { ProductActions };

'use client';

import React from 'react';
import { MessageCircle, ShoppingCart, HandCoins } from 'lucide-react';
import cn from '@/lib/utils';
import { Button } from '@/components/atoms/Button/Button';

export interface ProductActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  onMessageSeller?: () => void;
  onBuyNow?: () => void;
  onMakeOffer?: () => void;
  sellerId: string;
  productId: string;
}

const ProductActions = React.forwardRef<HTMLDivElement, ProductActionsProps>(
  (
    {
      className,
      onMessageSeller,
      onBuyNow,
      onMakeOffer,
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

    const handleBuyNow = () => {
      if (onBuyNow) {
        onBuyNow();
      } else {
        console.log(`Buy now product ${productId}`);
        // TODO: Implement checkout flow
      }
    };

    const handleMakeOffer = () => {
      if (onMakeOffer) {
        onMakeOffer();
      } else {
        console.log(`Make offer for product ${productId}`);
        // TODO: Implement offer modal
      }
    };

    return (
      <div ref={ref} className={cn('space-y-3', className)} {...props}>
        {/* Primary Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Button
            variant="primary"
            size="lg"
            onClick={handleBuyNow}
            className="w-full"
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            Buy Now
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={handleMakeOffer}
            className="w-full"
          >
            <HandCoins className="mr-2 h-5 w-5" />
            Make Offer
          </Button>
        </div>

        {/* Message Seller Button */}
        <Button
          variant="secondary"
          size="lg"
          onClick={handleMessageSeller}
          className="w-full"
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

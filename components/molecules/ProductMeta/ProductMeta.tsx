"use client";

import { forwardRef } from "react";
import { Share2, Flag, Eye } from "lucide-react";
import cn from "@/lib/utils";
import { Button } from "@/components/atoms/Button/Button";

export interface ProductMetaProps extends React.HTMLAttributes<HTMLDivElement> {
  viewCount?: number;
  onShare?: () => void;
  onReport?: () => void;
  productId: string;
}

const ProductMeta = forwardRef<HTMLDivElement, ProductMetaProps>(
  (
    { className, viewCount = 0, onShare, onReport, productId, ...props },
    ref
  ) => {
    const handleShare = async () => {
      if (onShare) {
        onShare();
        return;
      }

      const shareData = {
        title: "Check out this item",
        text: "I found this interesting item on Krpo Prodaja",
        url: typeof window !== "undefined" ? window.location.href : "",
      };

      try {
        if (navigator.share && typeof window !== "undefined") {
          await navigator.share(shareData);
        } else {
          // Fallback: Copy to clipboard
          await navigator.clipboard.writeText(shareData.url);
          alert("Link copied to clipboard!");
        }
      } catch (error) {
        console.error("Error sharing:", error);
      }
    };

    const handleReport = () => {
      if (onReport) {
        onReport();
      } else {
        console.log(`Report product ${productId}`);
        // TODO: Implement report modal
        alert("Report functionality coming soon!");
      }
    };

    return (
      <div
        ref={ref}
        className={cn("flex items-center justify-between gap-4", className)}
        {...props}
      >
        {/* View Count */}
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Eye className="h-4 w-4" />
          <span>{viewCount.toLocaleString()} views</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={handleShare}
            className="gap-2"
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          <Button variant="primary" size="sm" onClick={handleReport}>
            <Flag className="h-4 w-4" />
            Report
          </Button>
        </div>
      </div>
    );
  }
);

ProductMeta.displayName = "ProductMeta";

export { ProductMeta };

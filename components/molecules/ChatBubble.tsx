import * as React from "react";
import cn, { formatRelativeTime } from "@/lib/utils";
import { Typography } from "@/components/atoms";
import { Check } from "@/components/atoms/Icon";

export interface ChatBubbleProps extends React.HTMLAttributes<HTMLDivElement> {
  message: string;
  timestamp: Date;
  /**
   * Is this message from the current user?
   */
  isOwn?: boolean;
  /**
   * Message status: sent, delivered, read
   */
  status?: "sent" | "delivered" | "read";
  /**
   * Optional image attachment
   */
  image?: string;
  /**
   * System message (e.g., "Buyer has paid")
   */
  isSystem?: boolean;
}

/**
 * ChatBubble Component - Atomic Design: Molecule
 *
 * Message bubble for chat interface
 * Follows Vinted's messaging patterns:
 * - Blue bubbles for buyer
 * - White bubbles for seller
 * - System messages centered
 *
 * @example
 * ```tsx
 * <ChatBubble
 *   message="Da li je ovo još uvek dostupno?"
 *   timestamp={new Date()}
 *   isOwn={false}
 * />
 * ```
 */
const ChatBubble = React.forwardRef<HTMLDivElement, ChatBubbleProps>(
  (
    {
      className,
      message,
      timestamp,
      isOwn = false,
      status = "sent",
      image,
      isSystem = false,
      ...props
    },
    ref
  ) => {
    if (isSystem) {
      return (
        <div
          ref={ref}
          className={cn("flex justify-center my-4", className)}
          {...props}
        >
          <div className="px-4 py-2 bg-background rounded-full max-w-[80%]">
            <Typography variant="caption" className="text-center">
              {message}
            </Typography>
          </div>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex gap-2 mb-3",
          isOwn ? "justify-end" : "justify-start",
          className
        )}
        {...props}
      >
        <div
          className={cn(
            "max-w-[75%] rounded-2xl px-4 py-2",
            isOwn
              ? "bg-primary text-white rounded-br-md"
              : "bg-surface border border-border rounded-bl-md"
          )}
        >
          {/* Image Attachment */}
          {image && (
            <div className="mb-2 rounded-lg overflow-hidden">
              <img
                src={image}
                alt="Attachment"
                className="max-w-full h-auto"
              />
            </div>
          )}

          {/* Message Text */}
          <Typography
            variant="bodySmall"
            className={cn(isOwn ? "text-white" : "text-text-primary")}
          >
            {message}
          </Typography>

          {/* Timestamp and Status */}
          <div
            className={cn(
              "flex items-center gap-1 mt-1",
              isOwn ? "justify-end" : "justify-start"
            )}
          >
            <Typography
              variant="caption"
              className={cn(isOwn ? "text-white/70" : "text-text-tertiary")}
            >
              {formatRelativeTime(timestamp)}
            </Typography>

            {/* Message Status (for own messages) */}
            {isOwn && (
              <div className="flex items-center">
                {status === "read" && (
                  <div className="flex -space-x-1">
                    <Check size={14} className="text-white/70" />
                    <Check size={14} className="text-white/70" />
                  </div>
                )}
                {status === "delivered" && (
                  <div className="flex -space-x-1">
                    <Check size={14} className="text-white/50" />
                    <Check size={14} className="text-white/50" />
                  </div>
                )}
                {status === "sent" && (
                  <Check size={14} className="text-white/50" />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

ChatBubble.displayName = "ChatBubble";

export { ChatBubble };

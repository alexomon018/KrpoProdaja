"use client";

import * as React from "react";
import cn from "@lib/utils";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Container size variant
   */
  size?: "regular" | "wide" | "small-margin";
  /**
   * Enable grid layout
   */
  withGrid?: boolean;
  /**
   * Children elements
   */
  children: React.ReactNode;
}

/**
 * Container Component - Atomic Design: Atom
 *
 * Responsive container with configurable max-width and optional grid layout.
 * Used to wrap page content and provide consistent spacing.
 *
 * @example
 * ```tsx
 * <Container size="regular">
 *   <h1>Content</h1>
 * </Container>
 *
 * <Container size="wide" withGrid>
 *   <div className="col-span-6">Left</div>
 *   <div className="col-span-6">Right</div>
 * </Container>
 * ```
 */
const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  (
    {
      size = "regular",
      withGrid = false,
      children,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "mx-auto w-full px-4 sm:px-8 xl:px-16",
          {
            "max-w-8xl px-2": size === "small-margin",
            "max-w-8xl": size === "regular",
            "max-w-[145.5rem]": size === "wide",
            "grid grid-cols-12 gap-x-3 sm:gap-x-5": withGrid,
          },
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Container.displayName = "Container";

export { Container };

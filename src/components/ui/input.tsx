import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-xl bg-input px-4 py-3 text-body text-foreground transition-all duration-200 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:shadow-glow focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50 border-0",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };

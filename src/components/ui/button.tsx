import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl font-heading font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lavender-300",
  {
    variants: {
      variant: {
        default:
          "bg-lavender-500 text-white shadow-soft hover:bg-lavender-600 hover:shadow-glow",
        mint: "bg-mint-400 text-white shadow-soft hover:bg-mint-500 hover:shadow-glow",
        peach: "bg-peach-400 text-white shadow-soft hover:bg-peach-500 hover:shadow-glow",
        sky: "bg-sky-400 text-white shadow-soft hover:bg-sky-500 hover:shadow-glow",
        outline:
          "border-2 border-lavender-200 bg-white text-lavender-600 hover:bg-lavender-50",
        ghost: "text-lavender-500 hover:bg-lavender-50",
        destructive: "bg-red-400 text-white hover:bg-red-500 shadow-soft",
      },
      size: {
        default: "h-12 px-6 text-base",
        sm: "h-10 px-4 text-sm",
        lg: "h-14 px-8 text-lg",
        icon: "h-11 w-11",
        fab: "h-16 w-16 rounded-full text-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

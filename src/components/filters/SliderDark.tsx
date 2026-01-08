import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

const SliderDark = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => {
  const initialValue = Array.isArray(props.value) 
    ? props.value 
    : (Array.isArray(props.defaultValue) ? props.defaultValue : [props.min || 0]);

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn("relative flex w-full touch-none select-none items-center", className)}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-[#3a3a3a]">
        <SliderPrimitive.Range className="absolute h-full bg-[#ff6b35]" />
      </SliderPrimitive.Track>
      {initialValue.map((_, index) => (
        <SliderPrimitive.Thumb
          key={index}
          className="block h-5 w-5 rounded-full border-2 border-[#ff6b35] bg-[#ff6b35] ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff6b35] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-[#ff5722] hover:border-[#ff5722]"
        />
      ))}
    </SliderPrimitive.Root>
  );
});
SliderDark.displayName = SliderPrimitive.Root.displayName;

export { SliderDark };

import { LabelHTMLAttributes } from "react";
import { cn } from "@commerceos/shared/lib/utils";

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn("text-sm font-medium leading-none", className)} {...props} />;
}

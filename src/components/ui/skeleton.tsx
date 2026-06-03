import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-gradient-to-r from-slate-200/60 via-slate-100/60 to-slate-200/60 bg-[length:200%_100%]",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };

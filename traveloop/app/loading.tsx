import { Skeleton } from "@/components/ui/skeleton";

export default function RootLoading() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-6xl flex-col justify-center gap-6 px-4">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-5 w-full max-w-xl" />
      <div className="grid gap-4 md:grid-cols-3">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  );
}

export default function ProductSkeleton() {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md">
      <div className="h-52 animate-pulse bg-slate-200" />

      <div className="space-y-3 p-5">
        <div className="h-5 w-3/4 animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />

        <div className="pt-2">
          <div className="h-10 w-32 animate-pulse rounded bg-slate-200" />
        </div>
      </div>
    </article>
  );
}

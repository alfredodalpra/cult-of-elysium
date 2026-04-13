import { Skeleton } from '@/components/ui/loading-skeleton'

export default function StoreLoading() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <Skeleton className="h-8 w-48 mb-10" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i}>
            <Skeleton className="aspect-[3/4] rounded-lg" />
            <Skeleton className="h-3 w-20 mt-4" />
            <Skeleton className="h-5 w-40 mt-2" />
            <Skeleton className="h-4 w-16 mt-2" />
          </div>
        ))}
      </div>
    </div>
  )
}

import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn('animate-pulse rounded-2xl bg-slate-200', className)} />
  )
}

export function HorseCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-card">
      <Skeleton className="w-full aspect-[4/3] rounded-none" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex justify-between items-center pt-1">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-7 w-20 rounded-full" />
        </div>
      </div>
    </div>
  )
}

export function HorseDetailSkeleton() {
  return (
    <div className="animate-pulse">
      <Skeleton className="w-full aspect-[4/3] rounded-none" />
      <div className="px-4 pt-4 space-y-4">
        <div className="flex justify-between">
          <div className="space-y-2">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="space-y-2 text-right">
            <Skeleton className="h-7 w-28" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
      </div>
      <div className="h-2 bg-slate-100 my-4" />
      <div className="px-4 space-y-2">
        <Skeleton className="h-5 w-36" />
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-11 w-full" />
        ))}
      </div>
    </div>
  )
}

export function FeedSkeleton() {
  return (
    <div className="space-y-4 p-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="bg-white rounded-3xl p-4 space-y-3 shadow-card">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="space-y-1.5">
              <Skeleton className="h-3.5 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-4/5" />
          <Skeleton className="w-full aspect-[16/9]" />
        </div>
      ))}
    </div>
  )
}

export function ChatListSkeleton() {
  return (
    <div className="space-y-px">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-4 py-3 bg-white animate-pulse">
          <Skeleton className="w-12 h-12 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
          <Skeleton className="w-10 h-8 rounded-xl" />
        </div>
      ))}
    </div>
  )
}

/**
 * MERIDIAN LIVING - Amenity Booking Widget Skeleton
 * 
 * Loading state that mimics the shape of the final widget.
 * This provides visual continuity during AI tool execution.
 */

import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/Card";
import { Skeleton, SkeletonButton } from "@/components/ui/Skeleton";
import type { WidgetSkeletonProps } from "@/types";
import { cn } from "@/lib/utils";

export function AmenityBookingSkeleton({ className }: WidgetSkeletonProps) {
  return (
    <div className={cn("widget-enter", className)}>
      <Card variant="widget" className="overflow-hidden">
        {/* Header skeleton */}
        <div className="bg-gradient-to-br from-[--color-sand]/50 to-transparent">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {/* Icon */}
                <Skeleton className="h-10 w-10 rounded-xl" />
                <div className="space-y-2">
                  {/* Title */}
                  <Skeleton className="h-5 w-32" />
                  {/* Location */}
                  <Skeleton className="h-3.5 w-40" />
                </div>
              </div>
              {/* Date */}
              <Skeleton className="h-5 w-28" />
            </div>
          </CardHeader>
        </div>

        <CardContent className="pt-4">
          {/* Availability text */}
          <Skeleton className="h-4 w-36 mb-3" />

          {/* Time slots grid */}
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton
                key={i}
                className="h-12 rounded-xl"
                style={{
                  animationDelay: `${i * 50}ms`,
                }}
              />
            ))}
          </div>

          {/* Rules section */}
          <div className="mt-4 p-3 rounded-xl bg-[--color-sand]/30">
            <div className="space-y-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-4/5" />
              <Skeleton className="h-3 w-3/5" />
            </div>
          </div>
        </CardContent>

        <CardFooter className="border-t border-[--color-sand] bg-[--color-sand]/20">
          <Skeleton className="h-4 w-48" />
        </CardFooter>
      </Card>
    </div>
  );
}

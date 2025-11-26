/**
 * MERIDIAN LIVING - Widget Registry
 * 
 * Central registry that maps AI tool names to their visual components.
 * This is the "Component Router" that prevents the AI from hallucinating HTML.
 * 
 * When the AI calls a tool, we look up the corresponding component here
 * and render it with the tool's output data.
 */

import type { ComponentType } from "react";
import type { WidgetComponentProps, WidgetSkeletonProps, AmenityBookingData } from "@/types";

// Import widgets
import { AmenityBookingWidget } from "./AmenityBooking";
import { AmenityBookingSkeleton } from "./AmenityBooking/skeleton";

// ============================================
// Registry Types
// ============================================

interface WidgetRegistryEntry<TData = unknown> {
  /**
   * The main widget component that renders the tool output
   */
  component: ComponentType<WidgetComponentProps<TData>>;
  
  /**
   * Loading skeleton that matches the widget's shape
   */
  skeleton: ComponentType<WidgetSkeletonProps>;
  
  /**
   * Human-readable name for the widget
   */
  displayName: string;
  
  /**
   * Optional category for grouping
   */
  category?: "amenities" | "services" | "communication" | "settings";
}

// ============================================
// Widget Registry
// ============================================

/**
 * The central registry mapping tool names to widget components.
 * 
 * To add a new widget:
 * 1. Create the component in /components/widgets/[Name]/index.tsx
 * 2. Create the skeleton in /components/widgets/[Name]/skeleton.tsx
 * 3. Define the tool in /lib/ai/tools.ts
 * 4. Register it here
 */
export const widgetRegistry = {
  book_amenity: {
    component: AmenityBookingWidget,
    skeleton: AmenityBookingSkeleton,
    displayName: "Reserva de Amenity",
    category: "amenities",
  } satisfies WidgetRegistryEntry<AmenityBookingData>,

  // Future widgets will be added here:
  // manage_visits: { ... },
  // package_tracking: { ... },
  // maintenance_request: { ... },
} as const;

// ============================================
// Type Helpers
// ============================================

export type WidgetName = keyof typeof widgetRegistry;

export function isValidWidgetName(name: string): name is WidgetName {
  return name in widgetRegistry;
}

/**
 * Get a widget entry from the registry with type safety
 */
export function getWidgetEntry<T extends WidgetName>(
  name: T
): (typeof widgetRegistry)[T] {
  return widgetRegistry[name];
}

/**
 * Get just the component for a widget
 */
export function getWidgetComponent(name: string): ComponentType<WidgetComponentProps<unknown>> | null {
  if (!isValidWidgetName(name)) {
    console.warn(`[WidgetRegistry] Unknown widget: ${name}`);
    return null;
  }
  return widgetRegistry[name].component as ComponentType<WidgetComponentProps<unknown>>;
}

/**
 * Get the skeleton component for a widget
 */
export function getWidgetSkeleton(name: string): ComponentType<WidgetSkeletonProps> | null {
  if (!isValidWidgetName(name)) {
    return null;
  }
  return widgetRegistry[name].skeleton;
}

// ============================================
// Widget Renderer Component
// ============================================

interface WidgetRendererProps {
  readonly toolName: string;
  readonly data: unknown;
  readonly isLoading?: boolean;
  readonly onAction?: (action: { type: string; payload?: unknown }) => void;
}

/**
 * Universal widget renderer that handles tool name -> component mapping
 */
export function WidgetRenderer({
  toolName,
  data,
  isLoading = false,
  onAction,
}: WidgetRendererProps) {
  // Show skeleton while loading
  if (isLoading) {
    const Skeleton = getWidgetSkeleton(toolName);
    if (Skeleton) {
      return <Skeleton />;
    }
    // Generic loading fallback
    return (
      <div className="animate-pulse p-6 rounded-xl bg-[--color-sand]/50">
        <div className="h-4 w-32 bg-[--color-sand] rounded mb-4" />
        <div className="h-24 bg-[--color-sand] rounded" />
      </div>
    );
  }

  // Get and render the component
  const Component = getWidgetComponent(toolName);
  
  if (!Component) {
    // Unknown tool - render graceful fallback
    return (
      <div className="p-4 rounded-xl bg-[--color-warning]/10 border border-[--color-warning]/20">
        <p className="text-sm text-[--color-midnight-muted]">
          Widget no disponible: {toolName}
        </p>
      </div>
    );
  }

  return (
    <Component
      data={data}
      isStreaming={false}
      onAction={onAction}
    />
  );
}

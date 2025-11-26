/**
 * MERIDIAN LIVING - Core Type Definitions
 * Central type system for the Generative UI architecture
 */

import type { ReactNode } from "react";
import type { z } from "zod";

// ============================================
// Temporal Context Types
// ============================================

export interface TemporalContext {
  readonly currentDate: string; // ISO date: 2024-01-15
  readonly currentTime: string; // 24h format: 14:30
  readonly currentDateTime: string; // ISO datetime
  readonly dayOfWeek: string; // Monday, Tuesday, etc.
  readonly timezone: string; // Europe/Madrid
  readonly locale: string; // es-ES
}

// ============================================
// Widget System Types
// ============================================

export type WidgetStatus = "idle" | "loading" | "streaming" | "complete" | "error";

export interface WidgetState<TData = unknown> {
  readonly id: string;
  readonly toolName: string;
  readonly status: WidgetStatus;
  readonly data: TData | null;
  readonly error: string | null;
  readonly timestamp: number;
}

export interface WidgetComponentProps<TData = unknown> {
  readonly data: TData;
  readonly isStreaming?: boolean;
  readonly onAction?: (action: WidgetAction) => void;
}

export interface WidgetSkeletonProps {
  readonly className?: string;
}

export interface WidgetAction {
  readonly type: string;
  readonly payload?: unknown;
}

// ============================================
// Tool Registry Types
// ============================================

export interface ToolDefinition<TSchema extends z.ZodType = z.ZodType> {
  readonly name: string;
  readonly description: string;
  readonly schema: TSchema;
  readonly component: React.ComponentType<WidgetComponentProps<z.infer<TSchema>>>;
  readonly skeleton: React.ComponentType<WidgetSkeletonProps>;
  readonly keywords: readonly string[];
}

export type ToolRegistry = Map<string, ToolDefinition>;

// ============================================
// Chat Message Types
// ============================================

export type MessageRole = "user" | "assistant" | "system";

export interface ChatMessage {
  readonly id: string;
  readonly role: MessageRole;
  readonly content: string;
  readonly timestamp: number;
  readonly widgets?: readonly WidgetState[];
}

export interface StreamingMessage {
  readonly id: string;
  readonly isStreaming: boolean;
  readonly partialContent?: string;
  readonly toolCalls?: readonly ToolCallState[];
}

export interface ToolCallState {
  readonly toolCallId: string;
  readonly toolName: string;
  readonly args: unknown;
  readonly result?: unknown;
  readonly status: "pending" | "executing" | "complete" | "error";
}

// ============================================
// Amenity Booking Types
// ============================================

export type AmenityType =
  | "padel"
  | "tennis"
  | "pool"
  | "gym"
  | "spa"
  | "coworking"
  | "cinema"
  | "rooftop";

export interface TimeSlot {
  readonly id: string;
  readonly startTime: string; // HH:mm
  readonly endTime: string; // HH:mm
  readonly available: boolean;
  readonly price?: number;
}

export interface AmenityBookingData {
  readonly amenityType: AmenityType;
  readonly amenityName: string;
  readonly date: string; // ISO date
  readonly suggestedSlots: readonly TimeSlot[];
  readonly location?: string;
  readonly maxDuration?: number; // minutes
  readonly rules?: readonly string[];
}

export interface BookingConfirmation {
  readonly bookingId: string;
  readonly amenityName: string;
  readonly date: string;
  readonly timeSlot: TimeSlot;
  readonly confirmationCode: string;
}

// ============================================
// User & Resident Types
// ============================================

export interface Resident {
  readonly id: string;
  readonly name: string;
  readonly unit: string; // e.g., "12B"
  readonly email: string;
  readonly membershipTier: "standard" | "premium" | "platinum";
}

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: {
    readonly code: string;
    readonly message: string;
  };
}

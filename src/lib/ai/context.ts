/**
 * MERIDIAN LIVING - Temporal Context System
 * 
 * Solves the "AI doesn't know today's date" problem by providing
 * a consistent temporal context that gets injected into every prompt.
 * 
 * This runs on the SERVER to ensure accurate, non-manipulable time.
 */

import type { TemporalContext } from "@/types";

const DEFAULT_TIMEZONE = "Europe/Madrid";
const DEFAULT_LOCALE = "es-ES";

/**
 * Generate the current temporal context
 * Called on the server for each AI request
 */
export function getTemporalContext(
  timezone = DEFAULT_TIMEZONE,
  locale = DEFAULT_LOCALE
): TemporalContext {
  const now = new Date();

  // Format date components
  const dateFormatter = new Intl.DateTimeFormat(locale, {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const timeFormatter = new Intl.DateTimeFormat(locale, {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const dayFormatter = new Intl.DateTimeFormat(locale, {
    timeZone: timezone,
    weekday: "long",
  });

  // Parse formatted date to ISO format
  const dateParts = dateFormatter.formatToParts(now);
  const year = dateParts.find((p) => p.type === "year")?.value ?? "";
  const month = dateParts.find((p) => p.type === "month")?.value ?? "";
  const day = dateParts.find((p) => p.type === "day")?.value ?? "";
  const currentDate = `${year}-${month}-${day}`;

  const timeParts = timeFormatter.formatToParts(now);
  const hour = timeParts.find((p) => p.type === "hour")?.value ?? "";
  const minute = timeParts.find((p) => p.type === "minute")?.value ?? "";
  const currentTime = `${hour}:${minute}`;

  return {
    currentDate,
    currentTime,
    currentDateTime: now.toISOString(),
    dayOfWeek: dayFormatter.format(now),
    timezone,
    locale,
  };
}

/**
 * Format temporal context as a string block for the system prompt
 */
export function formatTemporalContextForPrompt(context: TemporalContext): string {
  return `
## CONTEXTO TEMPORAL (Información en tiempo real)
- Fecha actual: ${context.currentDate} (${context.dayOfWeek})
- Hora actual: ${context.currentTime}
- Zona horaria: ${context.timezone}

Utiliza esta información para interpretar referencias temporales del usuario:
- "hoy" = ${context.currentDate}
- "mañana" = el día siguiente a ${context.currentDate}
- "esta semana" = la semana que contiene ${context.currentDate}
`.trim();
}

/**
 * Parse relative date references to absolute dates
 * Useful for tool parameters
 */
export function resolveRelativeDate(
  reference: "today" | "tomorrow" | "next_week" | string,
  context: TemporalContext
): string {
  const baseDate = new Date(context.currentDate);

  switch (reference) {
    case "today":
      return context.currentDate;

    case "tomorrow": {
      const tomorrow = new Date(baseDate);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow.toISOString().split("T")[0] ?? context.currentDate;
    }

    case "next_week": {
      const nextWeek = new Date(baseDate);
      nextWeek.setDate(nextWeek.getDate() + 7);
      return nextWeek.toISOString().split("T")[0] ?? context.currentDate;
    }

    default:
      // Assume it's already an ISO date
      return reference;
  }
}

/**
 * Calculate available dates for booking (next 14 days)
 */
export function getAvailableDates(
  context: TemporalContext,
  daysAhead = 14
): readonly string[] {
  const dates: string[] = [];
  const baseDate = new Date(context.currentDate);

  for (let i = 0; i < daysAhead; i++) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() + i);
    const isoDate = date.toISOString().split("T")[0];
    if (isoDate) {
      dates.push(isoDate);
    }
  }

  return dates;
}

/**
 * MERIDIAN LIVING - AI Tools Definition
 * 
 * Tools are the bridge between user intent and UI components.
 * Each tool has:
 * - A Zod schema defining its parameters
 * - An execute function that returns data for the widget
 * - Associated UI components (defined in the registry)
 */

import { z } from "zod";
import { tool } from "ai";
import { resolveRelativeDate, getTemporalContext } from "./context";
import type { AmenityBookingData, TimeSlot } from "@/types";

// ============================================
// Amenity Type Schema
// ============================================

export const amenityTypeSchema = z.enum([
  "padel",
  "tennis",
  "pool",
  "gym",
  "spa",
  "coworking",
  "cinema",
  "rooftop",
]);

// ============================================
// Book Amenity Tool Schema
// ============================================

export const bookAmenitySchema = z.object({
  amenityType: amenityTypeSchema.describe(
    "El tipo de amenity a reservar: padel, tennis, pool, gym, spa, coworking, cinema, rooftop"
  ),
  date: z
    .string()
    .describe(
      "La fecha para la reserva. Puede ser 'today', 'tomorrow', o una fecha ISO (YYYY-MM-DD)"
    ),
  preferredTime: z
    .string()
    .optional()
    .describe("Hora preferida en formato HH:mm (opcional)"),
  duration: z
    .number()
    .optional()
    .describe("Duración deseada en minutos (opcional)"),
});

export type BookAmenityInput = z.infer<typeof bookAmenitySchema>;

// ============================================
// Amenity Metadata
// ============================================

const AMENITY_METADATA: Record<
  z.infer<typeof amenityTypeSchema>,
  {
    name: string;
    location: string;
    maxDuration: number;
    rules: string[];
  }
> = {
  padel: {
    name: "Pista de Pádel",
    location: "Nivel -1, Zona Deportiva",
    maxDuration: 90,
    rules: [
      "Máximo 4 jugadores por reserva",
      "Calzado deportivo obligatorio",
      "Cancelación gratuita hasta 2h antes",
    ],
  },
  tennis: {
    name: "Pista de Tenis",
    location: "Nivel -1, Zona Deportiva",
    maxDuration: 120,
    rules: [
      "Máximo 4 jugadores",
      "Raquetas disponibles en recepción",
      "Cancelación gratuita hasta 2h antes",
    ],
  },
  pool: {
    name: "Piscina Climatizada",
    location: "Nivel 2, Área Wellness",
    maxDuration: 120,
    rules: [
      "Aforo máximo: 20 personas",
      "Gorro de baño obligatorio",
      "Duchas antes de entrar",
    ],
  },
  gym: {
    name: "Gimnasio",
    location: "Nivel 2, Área Wellness",
    maxDuration: 120,
    rules: [
      "Toalla obligatoria",
      "Limpiar equipos después de usar",
      "Entrenadores disponibles bajo cita",
    ],
  },
  spa: {
    name: "Spa & Wellness",
    location: "Nivel 2, Área Wellness",
    maxDuration: 90,
    rules: [
      "Reserva requerida",
      "Llegar 10 min antes",
      "Servicios adicionales disponibles",
    ],
  },
  coworking: {
    name: "Sala de Coworking",
    location: "Nivel 1, Business Center",
    maxDuration: 480,
    rules: [
      "WiFi premium incluido",
      "Café y snacks disponibles",
      "Salas de reuniones bajo reserva",
    ],
  },
  cinema: {
    name: "Cine Privado",
    location: "Nivel -1, Área de Entretenimiento",
    maxDuration: 180,
    rules: [
      "Capacidad: 12 personas",
      "Catálogo de películas en tablet",
      "Servicio de catering disponible",
    ],
  },
  rooftop: {
    name: "Rooftop Lounge",
    location: "Nivel 15, Terraza",
    maxDuration: 180,
    rules: [
      "Solo adultos después de las 21h",
      "Bar service disponible",
      "Reserva obligatoria para grupos > 6",
    ],
  },
};

// ============================================
// Mock Time Slots Generator
// ============================================

function generateMockTimeSlots(
  date: string,
  amenityType: z.infer<typeof amenityTypeSchema>,
  preferredTime?: string
): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const startHour = amenityType === "rooftop" ? 18 : 8;
  const endHour = amenityType === "rooftop" ? 24 : 22;

  for (let hour = startHour; hour < endHour; hour++) {
    const timeStr = `${hour.toString().padStart(2, "0")}:00`;
    const endTimeStr = `${(hour + 1).toString().padStart(2, "0")}:00`;

    // Simulate some slots being unavailable
    const isAvailable = Math.random() > 0.3;

    // If there's a preferred time, make nearby slots more likely available
    const isNearPreferred =
      preferredTime &&
      Math.abs(hour - parseInt(preferredTime.split(":")[0] ?? "12")) <= 2;

    slots.push({
      id: `slot-${date}-${hour}`,
      startTime: timeStr,
      endTime: endTimeStr,
      available: isNearPreferred ? true : isAvailable,
      price: amenityType === "spa" ? 25 : undefined,
    });
  }

  return slots;
}

// ============================================
// Book Amenity Tool Executor
// ============================================

export async function executeBookAmenity(
  input: BookAmenityInput
): Promise<AmenityBookingData> {
  const context = getTemporalContext();
  const resolvedDate = resolveRelativeDate(input.date, context);
  const metadata = AMENITY_METADATA[input.amenityType];

  // Simulate API latency
  await new Promise((resolve) => setTimeout(resolve, 300));

  const slots = generateMockTimeSlots(
    resolvedDate,
    input.amenityType,
    input.preferredTime
  );

  return {
    amenityType: input.amenityType,
    amenityName: metadata.name,
    date: resolvedDate,
    suggestedSlots: slots,
    location: metadata.location,
    maxDuration: metadata.maxDuration,
    rules: metadata.rules,
  };
}

// ============================================
// Export Tools for AI SDK
// ============================================

export const tools = {
  book_amenity: tool({
    description: `
      Reservar un amenity del complejo residencial.
      Usa esta herramienta cuando el usuario quiera reservar o consultar disponibilidad de:
      - Pistas de pádel o tenis
      - Gimnasio, piscina o spa
      - Sala de coworking
      - Cine privado
      - Rooftop lounge
      
      La herramienta mostrará los horarios disponibles para que el usuario elija.
    `.trim(),
    parameters: bookAmenitySchema,
    execute: executeBookAmenity,
  }),
};

export type Tools = typeof tools;

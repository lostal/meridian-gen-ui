/**
 * MERIDIAN LIVING - Amenity Booking Widget
 * 
 * The visual component that renders when a user wants to book an amenity.
 * This is a "smart" component that handles its own state and interactions.
 */

"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  Info,
  Check,
  ChevronRight,
  Dumbbell,
  Waves,
  Sparkles,
  Monitor,
  Sunrise,
  Laptop,
  Film,
  CircleDot,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn, formatDate, formatTime } from "@/lib/utils";
import type { AmenityBookingData, TimeSlot, AmenityType, WidgetComponentProps } from "@/types";

// ============================================
// Amenity Icons Map
// ============================================

const AMENITY_ICONS: Record<AmenityType, typeof Dumbbell> = {
  padel: CircleDot,
  tennis: CircleDot,
  pool: Waves,
  gym: Dumbbell,
  spa: Sparkles,
  coworking: Laptop,
  cinema: Film,
  rooftop: Sunrise,
};

// ============================================
// Time Slot Component
// ============================================

interface TimeSlotButtonProps {
  readonly slot: TimeSlot;
  readonly isSelected: boolean;
  readonly onSelect: () => void;
}

function TimeSlotButton({ slot, isSelected, onSelect }: TimeSlotButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={slot.available ? onSelect : undefined}
      disabled={!slot.available}
      className={cn(
        "time-slot relative px-4 py-3 rounded-xl text-sm font-medium",
        "border transition-all duration-200",
        slot.available
          ? isSelected
            ? "bg-[--color-midnight] text-white border-transparent"
            : "bg-white border-[--color-sand-deep]/30 hover:border-[--color-midnight]/30"
          : "bg-[--color-sand]/50 text-[--color-midnight-muted]/50 border-transparent cursor-not-allowed"
      )}
      data-selected={isSelected}
      whileHover={slot.available && !isSelected ? { scale: 1.02 } : undefined}
      whileTap={slot.available ? { scale: 0.98 } : undefined}
    >
      <span className="flex items-center justify-center gap-2">
        <Clock className="h-3.5 w-3.5" />
        {formatTime(slot.startTime)}
      </span>
      {slot.price !== undefined && (
        <span className="text-xs opacity-70 mt-0.5 block">
          {slot.price}€
        </span>
      )}
      {isSelected && (
        <motion.div
          className="absolute -top-1 -right-1 h-5 w-5 bg-[--color-success] rounded-full flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <Check className="h-3 w-3 text-white" />
        </motion.div>
      )}
    </motion.button>
  );
}

// ============================================
// Main Widget Component
// ============================================

export function AmenityBookingWidget({
  data,
  isStreaming,
  onAction,
}: WidgetComponentProps<AmenityBookingData>) {
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isBooked, setIsBooked] = useState(false);

  const Icon = AMENITY_ICONS[data.amenityType];
  const availableSlots = data.suggestedSlots.filter((slot) => slot.available);

  const handleConfirmBooking = useCallback(async () => {
    if (!selectedSlot) return;

    setIsConfirming(true);

    // Simulate booking API call
    await new Promise((resolve) => setTimeout(resolve, 1200));

    setIsBooked(true);
    setIsConfirming(false);

    onAction?.({
      type: "BOOKING_CONFIRMED",
      payload: {
        amenityType: data.amenityType,
        date: data.date,
        slot: selectedSlot,
      },
    });
  }, [selectedSlot, data, onAction]);

  // Success state
  if (isBooked && selectedSlot) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="widget-enter"
      >
        <Card variant="widget" className="overflow-hidden">
          <div className="bg-gradient-to-br from-[--color-success]/10 to-transparent p-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.1 }}
              className="mx-auto w-16 h-16 rounded-full bg-[--color-success] flex items-center justify-center mb-4"
            >
              <Check className="h-8 w-8 text-white" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <h3 className="font-display text-2xl text-[--color-midnight] mb-2">
                Reserva Confirmada
              </h3>
              <p className="text-[--color-midnight-muted]">
                {data.amenityName} · {formatDate(data.date)}
              </p>
              <p className="text-lg font-medium text-[--color-midnight] mt-2">
                {formatTime(selectedSlot.startTime)} - {formatTime(selectedSlot.endTime)}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-6 p-4 bg-white/80 rounded-xl text-center"
            >
              <p className="text-xs text-[--color-midnight-muted] uppercase tracking-wide mb-1">
                Código de confirmación
              </p>
              <p className="font-mono text-lg font-semibold text-[--color-midnight]">
                MRD-{Math.random().toString(36).slice(2, 8).toUpperCase()}
              </p>
            </motion.div>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="widget-enter"
    >
      <Card variant="widget" className="overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-br from-[--color-sand]/50 to-transparent">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[--color-midnight] text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>{data.amenityName}</CardTitle>
                  <CardDescription className="flex items-center gap-1.5 mt-0.5">
                    <MapPin className="h-3.5 w-3.5" />
                    {data.location}
                  </CardDescription>
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center gap-1.5 text-sm text-[--color-midnight]">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">{formatDate(data.date)}</span>
                </div>
              </div>
            </div>
          </CardHeader>
        </div>

        <CardContent className="pt-4">
          {/* Available slots */}
          <div className="mb-4">
            <p className="text-sm text-[--color-midnight-muted] mb-3">
              {availableSlots.length} horas disponibles
            </p>

            <div className="grid grid-cols-4 gap-2">
              <AnimatePresence mode="popLayout">
                {data.suggestedSlots.map((slot, index) => (
                  <motion.div
                    key={slot.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: index * 0.03,
                      duration: 0.2,
                    }}
                  >
                    <TimeSlotButton
                      slot={slot}
                      isSelected={selectedSlot?.id === slot.id}
                      onSelect={() => setSelectedSlot(slot)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Rules section */}
          {data.rules && data.rules.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="p-3 rounded-xl bg-[--color-sand]/30 border border-[--color-sand-deep]/20"
            >
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-[--color-midnight-muted] mt-0.5 shrink-0" />
                <div className="text-xs text-[--color-midnight-muted] space-y-1">
                  {data.rules.map((rule, i) => (
                    <p key={i}>{rule}</p>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>

        <CardFooter className="border-t border-[--color-sand] bg-[--color-sand]/20">
          <AnimatePresence mode="wait">
            {selectedSlot ? (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex items-center justify-between w-full"
              >
                <div>
                  <p className="text-sm text-[--color-midnight-muted]">Seleccionado</p>
                  <p className="font-medium text-[--color-midnight]">
                    {formatTime(selectedSlot.startTime)} - {formatTime(selectedSlot.endTime)}
                  </p>
                </div>
                <Button
                  onClick={handleConfirmBooking}
                  isLoading={isConfirming}
                  className="gap-2"
                >
                  Confirmar Reserva
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </motion.div>
            ) : (
              <motion.p
                key="select"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm text-[--color-midnight-muted]"
              >
                Selecciona una hora para continuar
              </motion.p>
            )}
          </AnimatePresence>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

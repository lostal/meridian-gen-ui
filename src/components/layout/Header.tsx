/**
 * MERIDIAN LIVING - Header Component
 * Elegant, minimal header with the Meridian branding
 */

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, Settings, User, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  readonly className?: string;
}

function CurrentTime() {
  const [time, setTime] = useState<string>("");
  const [date, setDate] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("es-ES", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      );
      setDate(
        now.toLocaleDateString("es-ES", {
          weekday: "long",
          day: "numeric",
          month: "long",
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!time) return null;

  return (
    <div className="text-right">
      <p className="text-2xl font-light text-[--color-midnight] tabular-nums">
        {time}
      </p>
      <p className="text-sm text-[--color-midnight-muted] capitalize">
        {date}
      </p>
    </div>
  );
}

export function Header({ className }: HeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "sticky top-0 z-50",
        "border-b border-[--color-sand]",
        "bg-[--color-cream]/80 backdrop-blur-xl",
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo & Branding */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              {/* Logo mark */}
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-[--color-midnight] flex items-center justify-center">
                  <span className="font-display text-xl text-white font-semibold">
                    M
                  </span>
                </div>
                {/* Subtle glow effect */}
                <div className="absolute inset-0 rounded-xl bg-[--color-midnight]/20 blur-lg -z-10" />
              </div>

              {/* Wordmark */}
              <div>
                <h1 className="font-display text-xl tracking-tight text-[--color-midnight]">
                  Meridian
                </h1>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[--color-midnight-muted] -mt-0.5">
                  Living
                </p>
              </div>
            </div>

            {/* Unit indicator */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[--color-sand]/50">
              <span className="text-xs text-[--color-midnight-muted]">Unidad</span>
              <span className="text-sm font-medium text-[--color-midnight]">12B</span>
            </div>
          </div>

          {/* Center - Current Time */}
          <div className="hidden lg:block">
            <CurrentTime />
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2.5 rounded-xl hover:bg-[--color-sand]/50 transition-colors"
            >
              <Bell className="h-5 w-5 text-[--color-midnight]" />
              {/* Notification dot */}
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[--color-accent]" />
            </motion.button>

            {/* Settings */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2.5 rounded-xl hover:bg-[--color-sand]/50 transition-colors"
            >
              <Settings className="h-5 w-5 text-[--color-midnight]" />
            </motion.button>

            {/* User menu */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 ml-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-[--color-sand]/50 transition-colors"
            >
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[--color-midnight] to-[--color-midnight-soft] flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-[--color-midnight]">Carlos</p>
                <p className="text-[10px] text-[--color-midnight-muted]">Premium</p>
              </div>
              <ChevronDown className="h-4 w-4 text-[--color-midnight-muted]" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

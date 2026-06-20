"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Calendar as CalIcon, Clock, MapPin, Users, CircleCheck,
  ChevronLeft, ChevronRight, Loader2, CalendarCheck, AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useNav } from "@/store/nav";
import { useContent } from "@/store/content";
import { formatNaira, PAYSTACK_LOGO_URL, type Amenity } from "@/data/content";
import { cn } from "@/lib/utils";

/* ─── Types ─── */
interface SlotInfo { time: string; status: "available" | "booked" }
interface AvailConfig {
  openTime: string; closeTime: string; slotDuration: number;
  availableDays: number[]; blackoutDates: string[];
}
type DayStatus = "available" | "partial" | "full" | "unavailable" | "blackout" | "past";
const BOOKING_REASONS = ["Co-working Space", "Private Meeting", "Seminar", "Workshop", "Events", "Other"];

/* ─── Helpers ─── */
function toDateStr(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function parseDate(s: string) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}
function addMins(t: string, mins: number) {
  const [h, m] = t.split(":").map(Number);
  const tot = h * 60 + m + mins;
  return `${String(Math.floor(tot / 60)).padStart(2, "0")}:${String(tot % 60).padStart(2, "0")}`;
}
function slotsBetween(slots: SlotInfo[], s: string, e: string) {
  // Exclusive end: end slot is the booking's END TIME, not an included slot.
  // e.g. start=15:00 end=19:00 → 4 slots (15,16,17,18) → booking 3pm–7pm
  return slots.filter(sl => sl.time >= s && sl.time < e);
}
function fmt12(t: string) {
  const [h, m] = t.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, "0")} ${suffix}`;
}

/* ══════════════════════════════════════════
   SLOT RANGE PICKER (shared)
══════════════════════════════════════════ */
interface SlotPickerProps {
  slots: SlotInfo[];
  config: AvailConfig;
  startSlot: string | null;
  endSlot: string | null;
  onStartSlot: (t: string) => void;
  onEndSlot: (t: string) => void;
  onClear: () => void;
  hourlyRate: number;
}

function SlotPicker({
  slots, config, startSlot, endSlot, onStartSlot, onEndSlot, onClear, hourlyRate,
}: SlotPickerProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const phase = !startSlot ? "pick-start" : !endSlot ? "pick-end" : "done";

  const isDisabledForEnd = (slot: SlotInfo): boolean => {
    if (!startSlot || slot.time <= startSlot) return true;
    const between = slotsBetween(slots, startSlot, slot.time);
    return between.some(s => s.status === "booked");
  };

  const getState = (slot: SlotInfo): string => {
    if (slot.status === "booked") return "booked";
    if (phase === "pick-start") return "available";
    if (slot.time === startSlot) return "start";
    if (phase === "pick-end") {
      if (isDisabledForEnd(slot)) return "disabled-end";
      const eff = endSlot || hovered;
      if (eff && slot.time < eff && slot.time > startSlot!) return "in-range";
      if (slot.time === eff) return "end";
      return "end-available";
    }
    if (endSlot) {
      if (slot.time === endSlot) return "end";
      if (slot.time > startSlot! && slot.time < endSlot) return "in-range";
    }
    return "available";
  };

  // Duration + price
  const { slotCount, startDisp, endDisp, totalPrice } = (() => {
    if (!startSlot) return { slotCount: 0, startDisp: null, endDisp: null, totalPrice: 0 };
    const effectiveEnd = endSlot ?? startSlot;
    const inRange = slotsBetween(slots, startSlot, effectiveEnd);
    const count = inRange.length;
    return { slotCount: count, startDisp: fmt12(startSlot), endDisp: fmt12(effectiveEnd), totalPrice: count * hourlyRate };
  })();

  return (
    <div className="space-y-4">
      {/* Instructions */}
      <div className="rounded-lg bg-muted/60 px-3 py-2 text-sm text-muted-foreground text-center">
        {phase === "pick-start" && "Click a time slot to set your start time"}
        {phase === "pick-end" && `Start: ${fmt12(startSlot!)} — now click your end time`}
        {phase === "done" && (
          <span className="font-medium text-foreground">
            {startDisp} → {endDisp} · {slotCount}h · {formatNaira(totalPrice)}
          </span>
        )}
      </div>

      {/* Slot grid */}
      <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-4">
        {slots.map(slot => {
          const state = getState(slot);
          const disabled = state === "booked" || state === "disabled-end";
          return (
            <button
              key={slot.time}
              disabled={disabled}
              onClick={() => {
                if (phase === "pick-start") { onStartSlot(slot.time); }
                else if (phase === "pick-end" && !isDisabledForEnd(slot)) { onEndSlot(slot.time); }
                else if (phase === "done") { onClear(); onStartSlot(slot.time); }
              }}
              onMouseEnter={() => phase === "pick-end" && setHovered(slot.time)}
              onMouseLeave={() => setHovered(null)}
              className={cn(
                "relative rounded-md py-2 px-1 text-xs font-semibold transition-all duration-150 text-center leading-tight",
                state === "booked" && "bg-red-50 text-red-400 line-through cursor-not-allowed border border-red-100",
                state === "disabled-end" && "opacity-30 cursor-not-allowed bg-muted",
                state === "available" && "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300",
                state === "end-available" && "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-primary/10 hover:border-primary/30",
                state === "start" && "bg-primary text-white border border-primary shadow-sm",
                state === "end" && "bg-primary text-white border border-primary shadow-sm",
                state === "in-range" && "bg-primary/20 text-primary border border-primary/30",
              )}
            >
              <span>{fmt12(slot.time)}</span>
              {state === "start" && <span className="block text-[9px] opacity-80 mt-0.5">START</span>}
              {state === "end" && <span className="block text-[9px] opacity-80 mt-0.5">END</span>}
              {state === "booked" && <span className="block text-[9px] mt-0.5">Taken</span>}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm bg-emerald-100 border border-emerald-300" /> Available</span>
        <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm bg-primary" /> Selected</span>
        <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm bg-primary/20 border border-primary/30" /> Range</span>
        <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm bg-red-50 border border-red-200" /> Booked</span>
      </div>
      {startSlot && (
        <button onClick={onClear} className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2">
          Clear selection
        </button>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   MINI CALENDAR (month view with day statuses)
══════════════════════════════════════════ */
const DAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

interface MiniCalProps {
  selectedDate: string | null;
  onSelectDate: (d: string) => void;
  workspaceId: string;
}

function MiniCal({ selectedDate, onSelectDate, workspaceId }: MiniCalProps) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [dayStatuses, setDayStatuses] = useState<Record<string, DayStatus>>({});
  const [loading, setLoading] = useState(false);

  const fetchMonth = useCallback(async (y: number, m: number) => {
    setLoading(true);
    try {
      const r = await fetch(`/api/workspaces/${workspaceId}/calendar?year=${y}&month=${m}`);
      const data = await r.json();
      setDayStatuses(data.days ?? {});
    } catch { /* show neutral */ }
    finally { setLoading(false); }
  }, [workspaceId]);

  useEffect(() => { fetchMonth(year, month); }, [year, month, fetchMonth]);

  const prevMonth = () => {
    if (month === 1) { setYear(y => y - 1); setMonth(12); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 12) { setYear(y => y + 1); setMonth(1); }
    else setMonth(m => m + 1);
  };

  const firstDow = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const todayStr = toDateStr(today);

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={prevMonth} className="rounded-md p-1 hover:bg-muted transition-colors">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-sm font-semibold">
          {MONTH_NAMES[month - 1]} {year}
          {loading && <Loader2 className="inline ml-1 h-3 w-3 animate-spin" />}
        </span>
        <button onClick={nextMonth} className="rounded-md p-1 hover:bg-muted transition-colors">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      {/* Day labels */}
      <div className="grid grid-cols-7 text-center">
        {DAY_LABELS.map(l => <span key={l} className="text-[10px] font-medium text-muted-foreground py-1">{l}</span>)}
      </div>
      {/* Days */}
      <div className="grid grid-cols-7 gap-0.5">
        {Array.from({ length: firstDow }).map((_, i) => <span key={`e${i}`} />)}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => {
          const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
          const status: DayStatus = dayStatuses[dateStr] ?? (dateStr < todayStr ? "past" : "available");
          const isSelected = dateStr === selectedDate;
          const isToday = dateStr === todayStr;
          const disabled = status === "past" || status === "unavailable" || status === "blackout" || status === "full";
          return (
            <button
              key={d}
              disabled={disabled}
              onClick={() => !disabled && onSelectDate(dateStr)}
              title={status}
              className={cn(
                "rounded-md py-1.5 text-xs font-medium transition-all duration-150 relative",
                isSelected && "bg-primary text-white shadow-sm",
                !isSelected && status === "available" && "text-emerald-700 hover:bg-emerald-50 bg-emerald-50/60",
                !isSelected && status === "partial" && "text-amber-700 hover:bg-amber-50 bg-amber-50/60",
                !isSelected && status === "full" && "text-red-400 bg-red-50/60 cursor-not-allowed",
                !isSelected && (status === "past" || status === "unavailable") && "text-muted-foreground/40 cursor-not-allowed",
                !isSelected && status === "blackout" && "text-muted-foreground/40 line-through cursor-not-allowed",
                isToday && !isSelected && "ring-1 ring-primary/50 ring-offset-0",
              )}
            >
              {d}
              {!isSelected && status === "available" && <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-emerald-400" />}
              {!isSelected && status === "partial" && <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-amber-400" />}
              {!isSelected && status === "full" && <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-red-400" />}
            </button>
          );
        })}
      </div>
      {/* Legend */}
      <div className="flex flex-wrap gap-3 pt-1 text-[10px] text-muted-foreground border-t">
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-400" />Available</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-400" />Partial</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-red-400" />Full</span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   CHECK AVAILABILITY MODAL
══════════════════════════════════════════ */
export function CheckAvailabilityModal() {
  const { modal, closeModal, openModal } = useNav();
  const { workspaces } = useContent();
  const wsId = modal.kind === "check-availability" ? modal.workspaceId : null;
  const ws = workspaces.find(w => w.id === wsId);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [slots, setSlots] = useState<SlotInfo[]>([]);
  const [config, setConfig] = useState<AvailConfig | null>(null);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [startSlot, setStartSlot] = useState<string | null>(null);
  const [endSlot, setEndSlot] = useState<string | null>(null);

  const fetchSlots = useCallback(async (date: string, id: string) => {
    setSlotsLoading(true);
    try {
      const r = await fetch(`/api/workspaces/${id}/slots?date=${date}`);
      const data = await r.json();
      setSlots(data.slots ?? []);
      setConfig(data.config ?? null);
    } finally { setSlotsLoading(false); }
  }, []);

  const handleDate = (d: string) => {
    setSelectedDate(d); setStartSlot(null); setEndSlot(null);
    if (wsId) fetchSlots(d, wsId);
  };

  const close = () => {
    closeModal();
    setSelectedDate(null); setSlots([]); setStartSlot(null); setEndSlot(null);
  };

  const proceedToBook = () => {
    if (!wsId) return;
    close();
    openModal({ kind: "booking", workspaceId: wsId });
  };

  if (!ws) return null;

  const canBook = startSlot !== null;

  return (
    <Dialog open={modal.kind === "check-availability"} onOpenChange={o => !o && close()}>
      <DialogContent className="max-w-2xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <CalendarCheck className="h-5 w-5 text-emerald-600" />
            <DialogTitle>Check Availability — {ws.name}</DialogTitle>
          </div>
          <DialogDescription>Select a date to see available time slots.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 md:grid-cols-[1fr_1.2fr]">
          {/* Calendar */}
          <div className="rounded-lg border bg-card p-4">
            <MiniCal selectedDate={selectedDate} onSelectDate={handleDate} workspaceId={ws.id} />
          </div>

          {/* Slots panel */}
          <div className="rounded-lg border bg-card p-4 min-h-[200px]">
            {!selectedDate && (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-muted-foreground py-8">
                <CalIcon className="h-8 w-8 opacity-30" />
                <p className="text-sm">Pick a date on the calendar to see available slots.</p>
              </div>
            )}
            {selectedDate && slotsLoading && (
              <div className="flex h-full items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            )}
            {selectedDate && !slotsLoading && slots.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-center py-8">
                <AlertCircle className="h-8 w-8 text-muted-foreground opacity-40" />
                <p className="text-sm text-muted-foreground">No slots available for this day.</p>
              </div>
            )}
            {selectedDate && !slotsLoading && slots.length > 0 && config && (
              <div className="space-y-3">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {parseDate(selectedDate).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                </p>
                <SlotPicker
                  slots={slots}
                  config={config}
                  startSlot={startSlot}
                  endSlot={endSlot}
                  onStartSlot={setStartSlot}
                  onEndSlot={setEndSlot}
                  onClear={() => { setStartSlot(null); setEndSlot(null); }}
                  hourlyRate={ws.hourlyRate}
                />
              </div>
            )}
          </div>
        </div>

        {canBook && (
          <div className="flex items-center justify-between gap-3 border-t pt-4">
            <div className="text-sm text-muted-foreground">
              {startSlot && endSlot && config ? (
                <>
                  <span className="font-semibold text-foreground">{fmt12(startSlot)} → {fmt12(endSlot)}</span>
                  {" · "}
                  {slotsBetween(slots, startSlot, endSlot).length} hrs
                  {" · "}
                  <span className="text-primary font-semibold">{formatNaira(slotsBetween(slots, startSlot, endSlot).length * ws.hourlyRate)}</span>
                </>
              ) : startSlot && config ? (
                <>Start: {fmt12(startSlot)} · <span className="text-muted-foreground">pick an end time</span></>
              ) : null}
            </div>
            <Button onClick={proceedToBook} className="rounded-full px-6">
              Book This Slot
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

/* ══════════════════════════════════════════
   BOOKING MODAL (redesigned)
══════════════════════════════════════════ */
type BookStep = "date" | "slots" | "daily-confirm" | "form";


/* ──────────────────────────────────────────────────────────────
   Paystack inline hook — loads the Paystack popup script once
   and exposes an `initPay` function.
────────────────────────────────────────────────────────────── */
type PaystackOptions = {
  email: string;
  amount: number;       // in KOBO (multiply Naira × 100)
  ref: string;
  onSuccess: (ref: string) => void;
  onCancel?: () => void;
};

function usePaystack() {
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current || document.getElementById("paystack-script")) return;
    const script = document.createElement("script");
    script.id  = "paystack-script";
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    document.head.appendChild(script);
    loaded.current = true;
  }, []);

  const initPay = (opts: PaystackOptions) => {
    const key = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
    if (!key) {
      toast.error("Paystack key not configured", {
        description: "Set NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY in .env.local",
      });
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handler = (window as any).PaystackPop?.setup({
      key,
      email: opts.email,
      amount: opts.amount,
      currency: "NGN",
      ref: opts.ref,
      callback: (res: { reference: string }) => opts.onSuccess(res.reference),
      onClose: () => opts.onCancel?.(),
    });
    handler?.openIframe();
  };

  return initPay;
}

export function BookingModal() {
  const { modal, closeModal } = useNav();
  const { workspaces } = useContent();
  const wsId = modal.kind === "booking" ? modal.workspaceId : null;
  const ws = workspaces.find(w => w.id === wsId);

  const [bookType, setBookType] = useState<"hourly" | "daily">("hourly");
  const [step, setStep] = useState<BookStep>("date");

  // Date state
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Slot state (hourly)
  const [slots, setSlots] = useState<SlotInfo[]>([]);
  const [config, setConfig] = useState<AvailConfig | null>(null);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [startSlot, setStartSlot] = useState<string | null>(null);
  const [endSlot, setEndSlot] = useState<string | null>(null);

  // Form state
  const [form, setForm] = useState({ name: "", phone: "", email: "", reason: "" });
  const [submitting, setSubmitting] = useState(false);

  const fetchSlots = useCallback(async (date: string, id: string) => {
    setSlotsLoading(true);
    try {
      const r = await fetch(`/api/workspaces/${id}/slots?date=${date}`);
      const data = await r.json();
      setSlots(data.slots ?? []);
      setConfig(data.config ?? null);
    } finally { setSlotsLoading(false); }
  }, []);

  const handleDate = (d: string) => {
    setSelectedDate(d); setStartSlot(null); setEndSlot(null);
    if (wsId) fetchSlots(d, wsId);
    if (bookType === "hourly") setStep("slots");
    else setStep("daily-confirm");
  };

  const clearAll = () => {
    setStep("date"); setSelectedDate(null); setSlots([]);
    setStartSlot(null); setEndSlot(null);
    setForm({ name: "", phone: "", email: "", reason: "" });
  };

  const close = () => { closeModal(); clearAll(); };

  // Computed booking details
  const { durationLabel, totalPrice, startTime, endTime } = (() => {
    if (bookType === "daily") return {
      durationLabel: "1 day", totalPrice: ws?.dailyRate ?? 0,
      startTime: "09:00", endTime: "20:00",
    };
    if (!startSlot || !config) return { durationLabel: "—", totalPrice: 0, startTime: "09:00", endTime: "09:00" };
    const eff = endSlot ?? startSlot;
    const count = slotsBetween(slots, startSlot, eff).length;
    return {
      durationLabel: `${count} hour${count !== 1 ? "s" : ""}`,
      totalPrice: count * (ws?.hourlyRate ?? 0),
      startTime: startSlot,
      endTime: eff,
    };
  })();

  const canProceedFromSlots = bookType === "daily"
    ? !!selectedDate
    : startSlot !== null && endSlot !== null;

  const initPay = usePaystack();

  const submitBooking = async (paystackRef?: string) => {
    if (!ws || !selectedDate) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/workspaces/${ws.id}/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: selectedDate, startTime, endTime, bookingType: bookType,
          name: form.name, email: form.email, phone: form.phone, reason: form.reason,
          paystackRef,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error("Booking failed", { description: data.error ?? "Please try again." });
        return;
      }
      toast.success("Booking confirmed! 🎉", {
        description: `Ticket ${data.ticketId} sent to ${form.email}`,
        duration: 6000,
      });
      close();
    } catch {
      toast.error("Network error — please try again.");
    } finally { setSubmitting(false); }
  };

  const pay = () => {
    if (!ws || !selectedDate) return;
    if (!form.name || !form.email || !form.phone || !form.reason) {
      toast.error("Please fill in all fields before paying.");
      return;
    }
    if (totalPrice === 0) { submitBooking(); return; }
    const ref = `YH-WS-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    initPay({
      email:     form.email,
      amount:    totalPrice * 100,
      ref,
      onSuccess: (paystackRef) => submitBooking(paystackRef),
      onCancel:  () => toast.info("Payment cancelled"),
    });
  };

  if (!ws) return null;

  const stepTitle: Record<BookStep, string> = {
    date: "Pick a Date",
    slots: "Choose Your Time",
    "daily-confirm": "Confirm Date",
    form: "Your Details",
  };

  const Steps = () => (
    <div className="flex items-center gap-1 text-xs">
      {(bookType === "hourly" ? ["date","slots","form"] : ["date","form"]).map((s, i, arr) => (
        <React.Fragment key={s}>
          <span className={cn(
            "rounded-full px-2 py-0.5 font-medium",
            step === s ? "bg-primary text-white" : "bg-muted text-muted-foreground"
          )}>
            {i + 1}
          </span>
          {i < arr.length - 1 && <span className="text-muted-foreground">›</span>}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <Dialog open={modal.kind === "booking"} onOpenChange={o => !o && close()}>
      <DialogContent className="max-w-xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between gap-2">
            <DialogTitle>Book {ws.name}</DialogTitle>
            <Steps />
          </div>
          <DialogDescription>{stepTitle[step]}</DialogDescription>
        </DialogHeader>

        {/* Booking type tabs */}
        {step === "date" && (
          <div className="flex rounded-lg border bg-muted p-1 gap-1">
            {(["hourly", "daily"] as const).map(t => (
              <button key={t} onClick={() => { setBookType(t); clearAll(); }}
                className={cn(
                  "flex-1 rounded-md py-1.5 text-sm font-medium capitalize transition-all",
                  bookType === t ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}>
                {t} · {t === "hourly" ? `${formatNaira(ws.hourlyRate)}/hr` : formatNaira(ws.dailyRate)}
              </button>
            ))}
          </div>
        )}

        {/* DATE STEP */}
        {step === "date" && (
          <div className="rounded-lg border bg-card p-4">
            <MiniCal selectedDate={selectedDate} onSelectDate={handleDate} workspaceId={ws.id} />
          </div>
        )}

        {/* SLOTS STEP (hourly) */}
        {step === "slots" && selectedDate && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <button onClick={() => setStep("date")} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                <ChevronLeft className="h-3 w-3" /> {parseDate(selectedDate).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
              </button>
            </div>
            {slotsLoading ? (
              <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
            ) : slots.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-8 text-muted-foreground text-sm">
                <AlertCircle className="h-6 w-6 opacity-40" />No slots available this day.
              </div>
            ) : config ? (
              <SlotPicker
                slots={slots} config={config}
                startSlot={startSlot} endSlot={endSlot}
                onStartSlot={setStartSlot} onEndSlot={setEndSlot}
                onClear={() => { setStartSlot(null); setEndSlot(null); }}
                hourlyRate={ws.hourlyRate}
              />
            ) : null}
            <div className="flex justify-between gap-2">
              <Button variant="outline" onClick={() => setStep("date")}>Back</Button>
              <Button onClick={() => setStep("form")} disabled={!canProceedFromSlots}>Continue</Button>
            </div>
          </div>
        )}

        {/* DAILY CONFIRM STEP */}
        {step === "daily-confirm" && selectedDate && (
          <div className="space-y-4">
            <div className="rounded-lg border bg-muted/40 p-4 text-sm space-y-2">
              <p className="font-semibold">{parseDate(selectedDate).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</p>
              <p className="text-muted-foreground">Full day access · {formatNaira(ws.dailyRate)}</p>
            </div>
            <div className="flex justify-between gap-2">
              <Button variant="outline" onClick={() => setStep("date")}>Back</Button>
              <Button onClick={() => setStep("form")}>Continue</Button>
            </div>
          </div>
        )}

        {/* FORM STEP */}
        {step === "form" && (
          <div className="space-y-4">
            {/* Summary strip */}
            <div className="rounded-lg border bg-primary/5 p-3 text-sm space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-primary">{formatNaira(totalPrice)}</span>
                <Badge variant="outline" className="text-xs">{durationLabel}</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {selectedDate && parseDate(selectedDate).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                {bookType === "hourly" && startSlot && config && ` · ${fmt12(startTime)} – ${fmt12(endTime)}`}
              </p>
            </div>

            <div className="grid gap-3">
              <div><Label>Full Name</Label>
                <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your full name" />
              </div>
              <div><Label>Phone</Label>
                <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="0801 234 5678" />
              </div>
              <div><Label>Email</Label>
                <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@email.com" />
              </div>
              <div><Label>Purpose</Label>
                <Select value={form.reason} onValueChange={v => setForm({ ...form, reason: v })}>
                  <SelectTrigger><SelectValue placeholder="Select purpose" /></SelectTrigger>
                  <SelectContent>
                    {BOOKING_REASONS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-center py-1">
              <img src={PAYSTACK_LOGO_URL} alt="Paystack" className="h-5 opacity-70" />
            </div>

            <div className="flex justify-between gap-2">
              <Button variant="outline" onClick={() => setStep(bookType === "hourly" ? "slots" : "date")}>Back</Button>
              <Button onClick={pay} disabled={submitting || !form.name || !form.phone || !form.email || !form.reason}>
                {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                {totalPrice === 0 ? "Confirm Booking" : `Pay ${formatNaira(totalPrice)}`}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

/* ══════════════════════════════════════════
   REMAINING MODALS (unchanged)
══════════════════════════════════════════ */
export function ViewSpaceModal() {
  const { modal, closeModal } = useNav();
  const { workspaces } = useContent();
  const wsId = modal.kind === "view-space" ? modal.workspaceId : null;
  const ws = workspaces.find(w => w.id === wsId);
  return (
    <Dialog open={modal.kind === "view-space"} onOpenChange={o => !o && closeModal()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader><DialogTitle className="text-2xl">{ws?.name}</DialogTitle></DialogHeader>
        {ws && (
          <div className="space-y-4">
            <div className="aspect-video w-full overflow-hidden rounded-lg border bg-muted">
              <img src={ws.imageUrl} alt={ws.name} className="h-full w-full object-cover" />
            </div>
            <p className="text-sm text-muted-foreground">{ws.description}</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function AmenitiesModal() {
  const { modal, closeModal } = useNav();
  const { workspaces } = useContent();
  const wsId = modal.kind === "amenities" ? modal.workspaceId : null;
  const ws = workspaces.find(w => w.id === wsId);
  return (
    <Dialog open={modal.kind === "amenities"} onOpenChange={o => !o && closeModal()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>All Amenities</DialogTitle>
          <DialogDescription>Everything available at {ws?.name}.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-3 py-2 sm:grid-cols-2">
          {ws?.amenities.map((a: Amenity, i: number) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <CircleCheck className="h-4 w-4 text-primary" />
              <span>{a.label}</span>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function EnrollModal() {
  const { modal, closeModal } = useNav();
  const { upcomingPrograms } = useContent();
  const programId = modal.kind === "enroll" ? modal.programId : null;
  const program = upcomingPrograms.find(p => p.id === programId);
  const [step, setStep] = useState<1 | 2>(1);
  const [contact, setContact] = useState({ name: "", email: "", phone: "" });
  const [details, setDetails] = useState({ gender: "", education: "" });
  const initPay = usePaystack();
  const [submitting, setSubmitting] = useState(false);
  if (!program) return null;
  const close = () => { setStep(1); setContact({ name: "", email: "", phone: "" }); setDetails({ gender: "", education: "" }); closeModal(); };

  const submitEnroll = async (paystackRef?: string) => {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/programs/${program.id}/enroll`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:       contact.name,
          email:      contact.email,
          phone:      contact.phone,
          gender:     details.gender,
          education:  details.education,
          paystackRef,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error("Enrollment failed", { description: data.error ?? "Please try again." });
        return;
      }
      toast.success("Enrollment confirmed! 🎓", {
        description: `Ticket ${data.ticketId} sent to ${contact.email}`,
        duration: 6000,
      });
      close();
    } catch {
      toast.error("Network error — please try again.");
    } finally { setSubmitting(false); }
  };

  const pay = () => {
    if (program.price === 0) { submitEnroll(); return; }
    const ref = `YH-CS-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    initPay({
      email:     contact.email,
      amount:    program.price * 100,
      ref,
      onSuccess: (paystackRef) => submitEnroll(paystackRef),
      onCancel:  () => toast.info("Payment cancelled"),
    });
  };
  return (
    <Dialog open={modal.kind === "enroll"} onOpenChange={o => !o && close()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Enroll in {program.name}</DialogTitle>
          <DialogDescription>{step === 1 ? "Enter your contact info." : "Tell us more about yourself."}</DialogDescription>
        </DialogHeader>
        <div className="rounded-md border p-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="font-semibold">{program.name}</span>
            <span className="font-bold">{formatNaira(program.price)}</span>
          </div>
          <p className="text-xs text-muted-foreground">{program.duration}</p>
        </div>
        {step === 1 && (
          <div className="grid gap-3">
            <div><Label>Full Name</Label><Input value={contact.name} onChange={e => setContact({ ...contact, name: e.target.value })} placeholder="Your full name" /></div>
            <div><Label>Email</Label><Input type="email" value={contact.email} onChange={e => setContact({ ...contact, email: e.target.value })} placeholder="Your email" /></div>
            <div><Label>Phone</Label><Input value={contact.phone} onChange={e => setContact({ ...contact, phone: e.target.value })} placeholder="0801 234 5678" /></div>
            <div className="flex justify-end"><Button onClick={() => setStep(2)} disabled={!contact.name || !contact.email || !contact.phone}>Next</Button></div>
          </div>
        )}
        {step === 2 && (
          <div className="grid gap-3">
            <div><Label>Gender</Label>
              <Select value={details.gender} onValueChange={v => setDetails({ ...details, gender: v })}>
                <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                <SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem></SelectContent>
              </Select>
            </div>
            <div><Label>Educational Level</Label><Input value={details.education} onChange={e => setDetails({ ...details, education: e.target.value })} placeholder="e.g., BSc Mechanical Engineering" /></div>
            <div className="flex items-center justify-center py-2"><img src={PAYSTACK_LOGO_URL} alt="Paystack" className="h-6" /></div>
            <div className="flex justify-between gap-2">
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button onClick={pay} disabled={!details.gender || !details.education || submitting}>{submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}{program.price === 0 ? "Confirm Enrollment" : `Pay ${formatNaira(program.price)}`}</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function EventBookModal() {
  const { modal, closeModal } = useNav();
  const { homeEvents, pastEvents } = useContent();
  const eventId = modal.kind === "event-book" ? modal.eventId : null;
  const event = [...homeEvents, ...pastEvents].find(e => e.id === eventId);
  const [form, setForm] = useState({ name: "", gender: "", email: "", phone: "" });
  const initPay = usePaystack();
  const [submitting, setSubmitting] = useState(false);
  if (!event) return null;
  const close = () => { setForm({ name: "", gender: "", email: "", phone: "" }); closeModal(); };

  const submitReg = async (paystackRef?: string) => {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/events/${event.id}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:  form.name,
          email: form.email,
          phone: form.phone,
          gender: form.gender,
          paystackRef,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error("Registration failed", { description: data.error ?? "Please try again." });
        return;
      }
      toast.success("Registration confirmed! 🎫", {
        description: `Ticket ${data.ticketId} sent to ${form.email}`,
        duration: 6000,
      });
      close();
    } catch {
      toast.error("Network error — please try again.");
    } finally { setSubmitting(false); }
  };

  const submit = () => {
    if (event.fee === 0) { submitReg(); return; }
    const ref = `YH-EV-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    initPay({
      email:     form.email,
      amount:    event.fee * 100,
      ref,
      onSuccess: (paystackRef) => submitReg(paystackRef),
      onCancel:  () => toast.info("Payment cancelled"),
    });
  };
  return (
    <Dialog open={modal.kind === "event-book"} onOpenChange={o => !o && close()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Book a Spot for {event.title}</DialogTitle>
          <DialogDescription>Fill in your details to reserve your place at this event.</DialogDescription>
        </DialogHeader>
        <div className="rounded-md border p-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="font-semibold">{event.category}</span>
            <span className="font-bold">{formatNaira(event.fee)}</span>
          </div>
        </div>
        <div className="grid gap-3">
          <div><Label>Full Name</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your full name" /></div>
          <div><Label>Gender</Label>
            <Select value={form.gender} onValueChange={v => setForm({ ...form, gender: v })}>
              <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
              <SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem></SelectContent>
            </Select>
          </div>
          <div><Label>Email</Label><Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Your email" /></div>
          <div><Label>Phone</Label><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="0801 234 5678" /></div>
        </div>
        <div className="flex justify-between gap-2">
          <Button variant="outline" onClick={close}>Cancel</Button>
          <Button onClick={submit} disabled={!form.name || !form.gender || !form.email || !form.phone || submitting}>{submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}{event.fee === 0 ? "Register Free" : `Pay ${formatNaira(event.fee)}`}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function EventDetailsModal() {
  const { modal, closeModal, openModal } = useNav();
  const { pastEvents } = useContent();
  const eventId = modal.kind === "event-details" ? modal.eventId : null;
  const event = pastEvents.find(e => e.id === eventId);
  return (
    <Dialog open={modal.kind === "event-details"} onOpenChange={o => !o && closeModal()}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-secondary/20 text-secondary-foreground border-secondary/30">{event?.category}</Badge>
            <Badge variant="outline">{event?.mode}</Badge>
            {event?.isMostRecent && <Badge className="bg-primary/10 text-primary border-primary/30">MOST RECENT</Badge>}
          </div>
          <DialogTitle className="text-2xl">{event?.title}</DialogTitle>
        </DialogHeader>
        {event && (
          <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground">{event.description}</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4 text-primary" /><span>{event.audience}</span>
            </div>
            {event.longWriteUp && (
              <div className="rounded-md border bg-muted/40 p-4">
                <p className="text-sm leading-relaxed">{event.longWriteUp}</p>
              </div>
            )}
            <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
              <div className="flex items-center gap-2"><CalIcon className="h-4 w-4 text-primary" /><span>{event.date}</span></div>
              <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /><span>{event.time}</span></div>
              <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /><span>{event.location}</span></div>
            </div>
            <div className="flex items-center justify-between border-t pt-4">
              <div><p className="text-xs text-muted-foreground">FEE</p><p className="text-lg font-bold">{formatNaira(event.fee)}</p></div>
              <Button onClick={() => { closeModal(); setTimeout(() => openModal({ kind: "event-book", eventId: event.id }), 50); }}>
                {event.fee === 0 ? "Register Free" : `Book — ${formatNaira(event.fee)}`}
              </Button>
            </div>
          </div>
        )}
        </DialogContent>
      </Dialog>
  );
}

export function ModalsHost() {
  return (
    <>
      <CheckAvailabilityModal />
      <BookingModal />
      <EnrollModal />
      <EventBookModal />
      <EventDetailsModal />
    </>
  );
}

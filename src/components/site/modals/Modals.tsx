"use client";

import { useState } from "react";
import { Calendar as CalIcon, Clock, MapPin, Users, CircleCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useNav } from "@/store/nav";
import {
  workspaces,
  upcomingPrograms,
  homeEvents,
  pastEvents,
  formatNaira,
  PAYSTACK_LOGO_URL,
  type Amenity,
} from "@/data/content";

const HOURS_SLOTS = [
  "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00",
  "17:00", "18:00", "19:00", "20:00",
];

const BOOKING_REASONS = ["Private Meeting", "Seminar", "Workshop", "Events"];

/* ---------- View Space ---------- */
export function ViewSpaceModal() {
  const { modal, closeModal } = useNav();
  const workspaceId =
    modal.kind === "view-space" ? modal.workspaceId : null;
  const ws = workspaces.find((w) => w.id === workspaceId);

  return (
    <Dialog
      open={modal.kind === "view-space"}
      onOpenChange={(o) => !o && closeModal()}
    >
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">{ws?.name}</DialogTitle>
        </DialogHeader>
        {ws && (
          <div className="space-y-4">
            <div className="aspect-video w-full overflow-hidden rounded-lg border bg-muted">
              <img
                src={ws.imageUrl}
                alt={ws.name}
                className="h-full w-full object-cover"
              />
            </div>
            <p className="text-sm text-muted-foreground">{ws.description}</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

/* ---------- Amenities ---------- */
export function AmenitiesModal() {
  const { modal, closeModal } = useNav();
  const workspaceId = modal.kind === "amenities" ? modal.workspaceId : null;
  const ws = workspaces.find((w) => w.id === workspaceId);

  return (
    <Dialog
      open={modal.kind === "amenities"}
      onOpenChange={(o) => !o && closeModal()}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>All Amenities</DialogTitle>
          <DialogDescription>
            Everything available at {ws?.name}.
          </DialogDescription>
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

/* ---------- Booking ---------- */
export function BookingModal() {
  const { modal, closeModal } = useNav();
  const workspaceId = modal.kind === "booking" ? modal.workspaceId : null;
  const ws = workspaces.find((w) => w.id === workspaceId);

  const [tab, setTab] = useState<"daily" | "hourly">("daily");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [hourlyYear, setHourlyYear] = useState<string>(String(new Date().getFullYear()));
  const [hourlyMonth, setHourlyMonth] = useState<string>(String(new Date().getMonth()));
  const [hourlyDay, setHourlyDay] = useState<string>(String(new Date().getDate()));
  const [selectedHours, setSelectedHours] = useState<string[]>([]);
  const [reviewOpen, setReviewOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    reason: "",
  });

  if (!ws) return null;

  const price =
    tab === "daily"
      ? ws.dailyRate
      : ws.hourlyRate * Math.max(selectedHours.length, 1);
  const duration =
    tab === "daily"
      ? "1 day"
      : `${selectedHours.length || 1} hour${selectedHours.length > 1 ? "s" : ""}`;

  const clearSelection = () => {
    setSelectedDate(undefined);
    setSelectedHours([]);
  };

  const canCheckout =
    tab === "daily" ? !!selectedDate : selectedHours.length > 0;

  const toggleHour = (h: string) => {
    setSelectedHours((prev) =>
      prev.includes(h) ? prev.filter((x) => x !== h) : [...prev, h].sort()
    );
  };

  const closeAll = () => {
    setReviewOpen(false);
    closeModal();
    clearSelection();
    setForm({ name: "", phone: "", email: "", reason: "" });
  };

  const pay = () => {
    toast.success("Payment initiated", {
      description: `Your ${ws.name} booking is being processed via Paystack.`,
    });
    closeAll();
  };

  return (
    <>
      {/* Schedule modal */}
      <Dialog
        open={modal.kind === "booking" && !reviewOpen}
        onOpenChange={(o) => !o && closeAll()}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Schedule Your Visit</DialogTitle>
            <DialogDescription>
              Book {ws.name}. Choose a daily or hourly rate.
            </DialogDescription>
          </DialogHeader>

          <Tabs value={tab} onValueChange={(v) => setTab(v as "daily" | "hourly")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="hourly">Hourly</TabsTrigger>
            </TabsList>

            <TabsContent value="daily" className="space-y-4">
              <div className="rounded-md border p-3 flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                  className="mx-auto"
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-semibold">{formatNaira(ws.dailyRate)}</p>
                  <p className="text-muted-foreground">1 day</p>
                </div>
                {selectedDate && (
                  <p className="text-xs text-muted-foreground">
                    Selected: {selectedDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="hourly" className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <Select value={hourlyYear} onValueChange={setHourlyYear}>
                  <SelectTrigger><SelectValue placeholder="Year" /></SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 3 }, (_, i) => new Date().getFullYear() + i).map((y) => (
                      <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={hourlyMonth} onValueChange={setHourlyMonth}>
                  <SelectTrigger><SelectValue placeholder="Month" /></SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => i).map((m) => (
                      <SelectItem key={m} value={String(m)}>
                        {new Date(2000, m, 1).toLocaleString("en-US", { month: "long" })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={hourlyDay} onValueChange={setHourlyDay}>
                  <SelectTrigger><SelectValue placeholder="Day" /></SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                      <SelectItem key={d} value={String(d)}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {HOURS_SLOTS.map((h) => {
                  const active = selectedHours.includes(h);
                  return (
                    <button
                      key={h}
                      onClick={() => toggleHour(h)}
                      className={`rounded-md border px-2 py-2 text-xs font-medium transition-colors ${
                        active
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background hover:bg-muted"
                      }`}
                    >
                      {h}
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-semibold">{formatNaira(ws.hourlyRate)}/hour</p>
                  <p className="text-muted-foreground">
                    {selectedHours.length} hour{selectedHours.length !== 1 ? "s" : ""} selected
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex items-center justify-between gap-2">
            <Button variant="outline" onClick={clearSelection} disabled={!canCheckout}>
              Clear
            </Button>
            <Button onClick={() => setReviewOpen(true)} disabled={!canCheckout}>
              Checkout
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Review / Payment modal */}
      <Dialog open={reviewOpen} onOpenChange={(o) => !o && closeAll()}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Review Your Booking</DialogTitle>
            <DialogDescription>
              Review your details for {ws.name} before payment.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="rounded-md border p-4 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="font-semibold">{formatNaira(price)}</span>
                <span className="text-muted-foreground">{duration}</span>
              </div>
              {tab === "daily" && selectedDate && (
                <p className="text-xs text-muted-foreground">
                  Date: {selectedDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
                </p>
              )}
              {tab === "hourly" && selectedHours.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  {hourlyMonth && new Date(2000, Number(hourlyMonth), 1).toLocaleString("en-US", { month: "long" })} {hourlyDay}, {hourlyYear} · {selectedHours.join(", ")}
                </p>
              )}
            </div>

            <div className="grid gap-3">
              <div>
                <Label htmlFor="bk-name">Name</Label>
                <Input id="bk-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your full name" />
              </div>
              <div>
                <Label htmlFor="bk-phone">Phone</Label>
                <Input id="bk-phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="0801 234 5678" />
              </div>
              <div>
                <Label htmlFor="bk-email">Email</Label>
                <Input id="bk-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@email.com" />
              </div>
              <div>
                <Label htmlFor="bk-reason">Reason for booking</Label>
                <Select value={form.reason} onValueChange={(v) => setForm({ ...form, reason: v })}>
                  <SelectTrigger id="bk-reason"><SelectValue placeholder="Select reason" /></SelectTrigger>
                  <SelectContent>
                    {BOOKING_REASONS.map((r) => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-center py-2">
              <img src={PAYSTACK_LOGO_URL} alt="Paystack" className="h-6" />
            </div>

            <div className="flex items-center justify-between gap-2">
              <Button variant="outline" onClick={() => setReviewOpen(false)}>Back</Button>
              <Button onClick={pay} disabled={!form.name || !form.phone || !form.email || !form.reason}>
                Pay Now
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

/* ---------- Enroll ---------- */
export function EnrollModal() {
  const { modal, closeModal } = useNav();
  const programId = modal.kind === "enroll" ? modal.programId : null;
  const program = upcomingPrograms.find((p) => p.id === programId);

  const [step, setStep] = useState<1 | 2>(1);
  const [contact, setContact] = useState({ name: "", email: "", phone: "" });
  const [details, setDetails] = useState({ gender: "", education: "" });

  if (!program) return null;

  const close = () => {
    setStep(1);
    setContact({ name: "", email: "", phone: "" });
    setDetails({ gender: "", education: "" });
    closeModal();
  };

  const pay = () => {
    toast.success("Enrollment submitted", {
      description: `You're enrolled in ${program.name}. Paystack payment window opening…`,
    });
    close();
  };

  return (
    <Dialog
      open={modal.kind === "enroll"}
      onOpenChange={(o) => !o && close()}
    >
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Enroll in {program.name}</DialogTitle>
          <DialogDescription>
            {step === 1
              ? "Let's get to know you! Enter your contact information."
              : "Tell us more about yourself & complete your payment."}
          </DialogDescription>
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
            <div>
              <Label htmlFor="en-name">Full Name</Label>
              <Input id="en-name" value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} placeholder="Your full name" />
            </div>
            <div>
              <Label htmlFor="en-email">Email</Label>
              <Input id="en-email" type="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} placeholder="Your email" />
            </div>
            <div>
              <Label htmlFor="en-phone">Phone Number</Label>
              <Input id="en-phone" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} placeholder="0801 234 5678" />
            </div>
            <div className="flex justify-end">
              <Button
                onClick={() => setStep(2)}
                disabled={!contact.name || !contact.email || !contact.phone}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-3">
            <div>
              <Label htmlFor="en-gender">Gender</Label>
              <Select value={details.gender} onValueChange={(v) => setDetails({ ...details, gender: v })}>
                <SelectTrigger id="en-gender"><SelectValue placeholder="Select gender" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="en-edu">Educational Level</Label>
              <Input id="en-edu" value={details.education} onChange={(e) => setDetails({ ...details, education: e.target.value })} placeholder="e.g., BSc Mechanical Engineering" />
            </div>
            <div className="flex items-center justify-center py-2">
              <img src={PAYSTACK_LOGO_URL} alt="Paystack" className="h-6" />
            </div>
            <div className="flex justify-between gap-2">
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button onClick={pay} disabled={!details.gender || !details.education}>Pay Now</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

/* ---------- Event Book Spot ---------- */
export function EventBookModal() {
  const { modal, closeModal } = useNav();
  const eventId = modal.kind === "event-book" ? modal.eventId : null;
  const event = [...homeEvents, ...pastEvents].find((e) => e.id === eventId);

  const [form, setForm] = useState({ name: "", gender: "", email: "", phone: "" });

  if (!event) return null;

  const close = () => {
    setForm({ name: "", gender: "", email: "", phone: "" });
    closeModal();
  };

  const submit = () => {
    toast.success("Spot reserved", {
      description: `You've booked a spot for ${event.title}.`,
    });
    close();
  };

  return (
    <Dialog open={modal.kind === "event-book"} onOpenChange={(o) => !o && close()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Book a Spot for {event.title}</DialogTitle>
          <DialogDescription>
            Fill in your details to reserve your place at this event.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-md border p-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="font-semibold">{event.category}</span>
            <span className="font-bold">{formatNaira(event.fee)}</span>
          </div>
        </div>

        <div className="grid gap-3">
          <div>
            <Label htmlFor="ev-name">Full Name</Label>
            <Input id="ev-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your full name" />
          </div>
          <div>
            <Label htmlFor="ev-gender">Gender</Label>
            <Select value={form.gender} onValueChange={(v) => setForm({ ...form, gender: v })}>
              <SelectTrigger id="ev-gender"><SelectValue placeholder="Select gender" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="ev-email">Email</Label>
            <Input id="ev-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Your email" />
          </div>
          <div>
            <Label htmlFor="ev-phone">Phone Number</Label>
            <Input id="ev-phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="0801 234 5678" />
          </div>
        </div>

        <div className="flex justify-between gap-2">
          <Button variant="outline" onClick={close}>Cancel</Button>
          <Button
            onClick={submit}
            disabled={!form.name || !form.gender || !form.email || !form.phone}
          >
            Register Free
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ---------- Event Details ---------- */
export function EventDetailsModal() {
  const { modal, closeModal } = useNav();
  const eventId = modal.kind === "event-details" ? modal.eventId : null;
  const event = pastEvents.find((e) => e.id === eventId);

  return (
    <Dialog
      open={modal.kind === "event-details"}
      onOpenChange={(o) => !o && closeModal()}
    >
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto scrollbar-thin">
        <DialogHeader>
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-secondary/20 text-secondary-foreground border-secondary/30">{event?.category}</Badge>
            <Badge variant="outline">{event?.mode}</Badge>
            {event?.isMostRecent && (
              <Badge className="bg-primary/10 text-primary border-primary/30">MOST RECENT</Badge>
            )}
          </div>
          <DialogTitle className="text-2xl">{event?.title}</DialogTitle>
        </DialogHeader>

        {event && (
          <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground">{event.description}</p>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4 text-primary" />
              <span>{event.audience}</span>
            </div>

            {event.longWriteUp && (
              <div className="rounded-md border bg-muted/40 p-4">
                <p className="text-sm leading-relaxed text-foreground">
                  {event.longWriteUp}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
              <div className="flex items-center gap-2">
                <CalIcon className="h-4 w-4 text-primary" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>{event.location}</span>
              </div>
            </div>

            <div className="flex items-center justify-between border-t pt-4">
              <div>
                <p className="text-xs text-muted-foreground">FEE</p>
                <p className="text-lg font-bold">{formatNaira(event.fee)}</p>
              </div>
              <Button asChild variant="outline">
                <a href={event.instagramUrl} target="_blank" rel="noreferrer">
                  View on Instagram
                </a>
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// Local Badge import (avoids circular dep risk)
// (moved to top of file)

export function ModalsHost() {
  return (
    <>
      <ViewSpaceModal />
      <AmenitiesModal />
      <BookingModal />
      <EnrollModal />
      <EventBookModal />
      <EventDetailsModal />
    </>
  );
}

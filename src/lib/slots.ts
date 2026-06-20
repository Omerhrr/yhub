/** Generate all slot start-times between openTime and closeTime */
export function generateSlots(open: string, close: string, durMins: number): string[] {
  const toMin = (t: string) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
  const fmt = (min: number) =>
    `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;
  const start = toMin(open), end = toMin(close);
  const slots: string[] = [];
  for (let t = start; t + durMins <= end; t += durMins) slots.push(fmt(t));
  return slots;
}

/** Does a slot overlap with any of the given bookings? */
export function isSlotBooked(
  slotStart: string,
  durMins: number,
  bookings: { startTime: string; endTime: string }[]
): boolean {
  const toMin = (t: string) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
  const sMin = toMin(slotStart), eMin = sMin + durMins;
  return bookings.some(b => {
    const bS = toMin(b.startTime), bE = toMin(b.endTime);
    return !(eMin <= bS || sMin >= bE);
  });
}

/** Add minutes to a "HH:MM" string */
export function addMins(t: string, mins: number): string {
  const [h, m] = t.split(":").map(Number);
  const total = h * 60 + m + mins;
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

export const DEFAULT_CONFIG = {
  availableDays: [1, 2, 3, 4, 5] as number[],
  openTime: "09:00",
  closeTime: "20:00",
  slotDuration: 60,
  blackoutDates: [] as string[],
};

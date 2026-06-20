"use client";

import { useState, useEffect } from "react";
import { Search, CheckCircle2, XCircle, Loader2, MapPin, Calendar, Clock, User, Ticket, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input }  from "@/components/ui/input";
import { Badge }  from "@/components/ui/badge";
import { cn }     from "@/lib/utils";
import { useNav } from "@/store/nav";
import { LOGO_URL, formatNaira } from "@/data/content";

type TicketResult = {
  found:     boolean;
  type?:     "workspace" | "course" | "event";
  ticketId?: string;
  title?:    string;
  name?:     string;
  email?:    string;
  date?:     string;
  time?:     string;
  location?: string;
  amount?:   number;
  status?:   string;
  createdAt?: string;
  extra?:    { label: string; value: unknown }[];
};

const TYPE_META: Record<string, { label: string; color: string; bg: string }> = {
  workspace: { label: "Workspace Booking",  color: "text-[#013156]", bg: "bg-[#013156]" },
  course:    { label: "Course Enrollment",  color: "text-emerald-700", bg: "bg-emerald-700" },
  event:     { label: "Event Registration", color: "text-violet-700",  bg: "bg-violet-700"  },
};

export function TicketTrackPage({ initialId }: { initialId?: string }) {
  const { navigate } = useNav();
  const [input,   setInput]   = useState(initialId ?? "");
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState<TicketResult | null>(null);
  const [error,   setError]   = useState("");

  // Auto-lookup when arriving from email link
  useEffect(() => {
    if (initialId) lookup(initialId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialId]);

  const lookup = async (id?: string) => {
    const ticketId = (id ?? input).trim().toUpperCase();
    if (!ticketId) { setError("Please enter a ticket ID."); return; }
    setLoading(true); setError(""); setResult(null);
    try {
      const res  = await fetch(`/api/track?id=${encodeURIComponent(ticketId)}`);
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Lookup failed."); return; }
      setResult(data);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const meta = result?.type ? TYPE_META[result.type] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Nav bar */}
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto max-w-4xl flex items-center gap-3 px-4 py-3">
          <button onClick={() => navigate("home")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="h-4 w-4" />
            <img src={LOGO_URL} alt="Yahya Hub" className="h-7 w-7" />
            <span className="font-semibold text-foreground">Yahya Hub</span>
          </button>
          <span className="text-muted-foreground/40 text-lg ml-1">·</span>
          <span className="text-sm font-medium text-muted-foreground">Ticket Tracker</span>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4">
            <Ticket className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Track Your Ticket</h1>
          <p className="text-muted-foreground">
            Enter your ticket ID to view booking details and confirmation status.
          </p>
        </div>

        {/* Search box */}
        <div className="bg-white rounded-2xl border shadow-sm p-6 mb-6">
          <label className="block text-sm font-medium text-foreground mb-2">Ticket ID</label>
          <div className="flex gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && lookup()}
              placeholder="YH-WS-20260619-ABCD1234"
              className="font-mono text-sm h-11"
            />
            <Button onClick={() => lookup()} disabled={loading} className="h-11 px-5 shrink-0">
              {loading
                ? <Loader2 className="h-4 w-4 animate-spin" />
                : <Search className="h-4 w-4" />}
            </Button>
          </div>
          {error && (
            <p className="mt-3 text-sm text-destructive flex items-center gap-1.5">
              <XCircle className="h-4 w-4 shrink-0" /> {error}
            </p>
          )}
          <p className="mt-3 text-xs text-muted-foreground">
            Your ticket ID was sent to your email after booking. Format: <code className="font-mono bg-muted px-1 rounded">YH-WS-YYYYMMDD-XXXX</code>
          </p>
        </div>

        {/* Result */}
        {result && !result.found && (
          <div className="bg-white rounded-2xl border shadow-sm p-8 text-center">
            <XCircle className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
            <p className="font-semibold text-foreground">Ticket not found</p>
            <p className="text-sm text-muted-foreground mt-1">
              Double-check your ticket ID or contact us at{" "}
              <a href="mailto:yahyahub6@gmail.com" className="text-primary underline-offset-2 hover:underline">yahyahub6@gmail.com</a>
            </p>
          </div>
        )}

        {result?.found && meta && (
          <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
            {/* Header stripe */}
            <div className={cn("px-6 py-5", meta.bg)}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-white/70 mb-1">{meta.label}</p>
                  <h2 className="text-xl font-bold text-white leading-tight">{result.title}</h2>
                </div>
                <Badge className="bg-white/20 text-white border-white/30 text-xs font-bold shrink-0 mt-0.5">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  {String(result.status ?? "confirmed").toUpperCase()}
                </Badge>
              </div>
            </div>

            {/* Ticket body */}
            <div className="p-6">
              {/* Ticket ID */}
              <div className="bg-muted/50 rounded-xl px-4 py-3 mb-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-0.5">Ticket No.</p>
                  <p className={cn("font-mono font-bold text-sm", meta.color)}>{result.ticketId}</p>
                </div>
                <Ticket className={cn("h-5 w-5 opacity-40", meta.color)} />
              </div>

              {/* Details grid */}
              <div className="grid gap-4">
                <Row icon={User} label="Name" value={result.name} />
                {result.date     && <Row icon={Calendar} label="Date"     value={result.date} />}
                {result.time     && <Row icon={Clock}    label="Time"     value={result.time} />}
                {result.location && <Row icon={MapPin}   label="Location" value={result.location} />}

                {(result.extra ?? []).filter(x => x.value).map(x => (
                  <div key={x.label} className="flex items-start gap-3">
                    <div className="w-5 h-5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">{x.label}</p>
                      <p className="text-sm font-medium text-foreground">{String(x.value)}</p>
                    </div>
                  </div>
                ))}

                {/* Amount */}
                <div className="border-t pt-4 mt-1 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Amount Paid</span>
                  <span className={cn("text-lg font-bold", meta.color)}>
                    {result.amount === 0 ? "Free" : formatNaira(Number(result.amount))}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t bg-muted/30 px-6 py-4 text-center">
              <p className="text-xs text-muted-foreground">
                Questions? Contact us at{" "}
                <a href="mailto:yahyahub6@gmail.com" className="text-primary font-medium hover:underline">
                  yahyahub6@gmail.com
                </a>
                {" "}· <a href="https://www.instagram.com/yahyahub/" target="_blank" rel="noreferrer" className="text-primary font-medium hover:underline">@yahyahub</a>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
        <Icon  className="h-4 w-4 text-muted-foreground" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
        <p className="text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}

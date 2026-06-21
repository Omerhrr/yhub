"use client";

import React, { useState } from "react";
import {
  Loader2, Save, Plus, Trash2, Pencil, X, LayoutDashboard,
  Image, Activity, Building2, BookOpen, CalendarDays, Settings,
  LogOut, ChevronRight, Wifi, Zap, Thermometer, BriefcaseBusiness,
  Users, TrendingUp, Menu, Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useNav } from "@/store/nav";
import { useContent, type AboutConfig } from "@/store/content";
import { LOGO_URL } from "@/data/content";
import { cn } from "@/lib/utils";

// ── Admin API helper ────────────────────────────────────────────────────────
function adminHeaders(): HeadersInit {
  const token = typeof window !== "undefined"
    ? sessionStorage.getItem("admin_token") ?? ""
    : "";
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
  };
}



/* ─── Types ─── */
type Tab = "overview" | "hero" | "status" | "workspaces" | "courses" | "events" | "about" | "footer";

type NavItem = { id: Tab; label: string; icon: React.ElementType; badge?: number };

const NAV_ITEMS: NavItem[] = [
  { id: "overview",   label: "Overview",      icon: LayoutDashboard },
  { id: "hero",       label: "Hero Section",  icon: Image },
  { id: "status",     label: "Status Cards",  icon: Activity },
  { id: "workspaces", label: "Workspaces",    icon: Building2 },
  { id: "courses",    label: "Courses",       icon: BookOpen },
  { id: "events",     label: "Events",        icon: CalendarDays },
  { id: "about",      label: "About Page",    icon: Users },
  { id: "footer",     label: "Footer",        icon: Settings },
];

/* ══════════════════════════════════════════
   ROOT SHELL
══════════════════════════════════════════ */
export function AdminDashboard() {
  const { setAuth, navigate } = useNav();
  const { workspaces, upcomingPrograms, completedPrograms, homeEvents, pastEvents, statusCards } = useContent();
  const [tab, setTab] = useState<Tab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const signOut = () => { setAuth("admin", false); navigate("home"); };

  const totalWorkspaces   = workspaces.length;
  const totalCourses      = upcomingPrograms.length + completedPrograms.length;
  const totalEvents       = homeEvents.length + pastEvents.length;
  const activeBookable    = workspaces.filter((w) => w.bookingEnabled).length;

  const currentNav = NAV_ITEMS.find((n) => n.id === tab)!;

  return (
    <div className="flex h-screen overflow-hidden bg-muted/30">

      {/* ── Sidebar ── */}
      <aside className={cn(
        "flex h-full flex-col bg-primary text-white transition-all duration-300 shrink-0",
        sidebarOpen ? "w-64" : "w-16"
      )}>
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-white/10 px-4">
          <img src={LOGO_URL} alt="Logo" className="h-8 w-8 shrink-0" />
          {sidebarOpen && (
            <div className="min-w-0">
              <p className="truncate text-sm font-bold leading-tight">Yahya Hub</p>
              <p className="text-[10px] text-white/50 uppercase tracking-wider">Admin Panel</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 space-y-0.5 px-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                title={!sidebarOpen ? item.label : undefined}
                className={cn(
                  "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
                  active
                    ? "bg-white/15 text-white shadow-inner"
                    : "text-white/60 hover:bg-white/10 hover:text-white"
                )}
              >
                <Icon className={cn("h-4 w-4 shrink-0", active ? "text-secondary" : "text-white/50 group-hover:text-white/80")} />
                {sidebarOpen && <span className="truncate">{item.label}</span>}
                {sidebarOpen && active && <ChevronRight className="ml-auto h-3.5 w-3.5 text-white/40" />}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-white/10 p-3 space-y-1">
          <button
            onClick={signOut}
            title={!sidebarOpen ? "Sign out" : undefined}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          >
            <LogOut className="h-4 w-4 shrink-0 text-white/40" />
            {sidebarOpen && <span>Sign out</span>}
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* Top bar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b bg-white px-6 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-base font-semibold text-foreground">{currentNav.label}</h1>
              <p className="text-xs text-muted-foreground">Yahya Hub · Admin</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-secondary" />
            </button>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
              A
            </div>
          </div>
        </header>

        {/* Content scroll area */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 max-w-6xl">
            {tab === "overview"   && <OverviewPanel ws={totalWorkspaces} courses={totalCourses} events={totalEvents} active={activeBookable} onNavigate={setTab} />}
            {tab === "hero"       && <HeroEditor />}
            {tab === "status"     && <StatusCardsEditor />}
            {tab === "workspaces" && <WorkspacesEditor />}
            {tab === "courses"    && <ProgramsEditor />}
            {tab === "events"     && <EventsEditor />}
            {tab === "about"      && <AboutEditor />}
            {tab === "footer"     && <FooterEditor />}
          </div>
        </main>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   SHARED UI HELPERS
══════════════════════════════════════════ */
function SectionShell({ title, description, action, children }: {
  title: string; description?: string; action?: React.ReactNode; children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</Label>
      {children}
    </div>
  );
}

function SaveButton({ onClick, saving }: { onClick: () => void; saving: boolean }) {
  return (
    <Button onClick={onClick} disabled={saving}>
      {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}Save
    </Button>
  );
}

function FormDialog({ title, onClose, wide, children }: {
  title: string; onClose: () => void; wide?: boolean; children: React.ReactNode;
}) {
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className={cn("max-h-[90vh] overflow-y-auto", wide ? "max-w-2xl" : "max-w-lg")}>
        <DialogHeader><DialogTitle>{title}</DialogTitle></DialogHeader>
        <div className="space-y-4 py-2">{children}</div>
      </DialogContent>
    </Dialog>
  );
}

function DeleteButton({ endpoint, onDeleted, small }: { endpoint: string; onDeleted: () => void; small?: boolean }) {
  const [confirm, setConfirm] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);

  if (!confirm) {
    return (
      <Button
        size={small ? "icon" : "sm"}
        variant="ghost"
        className={cn("text-destructive hover:text-destructive hover:bg-destructive/10", small && "h-7 w-7")}
        onClick={() => setConfirm(true)}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <Button
        size={small ? "icon" : "sm"}
        variant="destructive"
        className={small ? "h-7 w-7" : ""}
        disabled={deleting}
        onClick={async () => {
          setDeleting(true);
          try {
            await fetch(endpoint, { method: "DELETE" });
            onDeleted();
          } catch { toast.error("Failed to delete"); }
          finally { setDeleting(false); }
        }}
      >
        {deleting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
      </Button>
      <Button size={small ? "icon" : "sm"} variant="ghost" className={small ? "h-7 w-7" : ""} onClick={() => setConfirm(false)}>
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
}

/* ══════════════════════════════════════════
   OVERVIEW
══════════════════════════════════════════ */
function OverviewPanel({ ws, courses, events, active, onNavigate }: { ws: number; courses: number; events: number; active: number; onNavigate: (tab: Tab) => void }) {
  const stats = [
    { label: "Workspaces", value: ws,      icon: Building2,    color: "text-primary",   bg: "bg-primary/10" },
    { label: "Bookable",   value: active,  icon: TrendingUp,   color: "text-green-600", bg: "bg-green-50" },
    { label: "Courses",    value: courses, icon: BookOpen,     color: "text-secondary", bg: "bg-secondary/10" },
    { label: "Events",     value: events,  icon: CalendarDays, color: "text-accent",    bg: "bg-accent/10" },
  ];

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className="p-5 border-border/60">
              <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", s.bg)}>
                <Icon className={cn("h-5 w-5", s.color)} />
              </div>
              <p className="mt-3 text-2xl font-extrabold text-foreground">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </Card>
          );
        })}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Quick Actions</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { icon: Building2,    label: "Manage Workspaces",  desc: "Edit spaces, rates, amenities", tab: "workspaces" as Tab },
            { icon: BookOpen,     label: "Manage Courses",     desc: "Add or update course listings", tab: "courses" as Tab },
            { icon: CalendarDays, label: "Manage Events",      desc: "Publish and edit events",       tab: "events" as Tab },
            { icon: Image,        label: "Edit Hero",          desc: "Update hero copy & video",      tab: "hero" as Tab },
          ].map((a) => {
            const Icon = a.icon;
            return (
              <Card
                key={a.tab}
                className="flex cursor-pointer items-center gap-4 p-4 border-border/60 transition-all hover:-translate-y-0.5 hover:shadow-md"
                onClick={() => onNavigate(a.tab)}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">{a.label}</p>
                  <p className="text-xs text-muted-foreground">{a.desc}</p>
                </div>
                <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground shrink-0" />
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   HERO EDITOR
══════════════════════════════════════════ */
function HeroEditor() {
  const { home, fetchContent } = useContent();
  const [form, setForm] = useState({
    heroTitle: home?.heroTitle ?? "",
    heroSubtitle: home?.heroSubtitle ?? "",
    heroCtaPrimaryText: home?.heroCtaPrimaryText ?? "",
    heroCtaPrimaryAnchor: home?.heroCtaPrimaryAnchor ?? "",
    heroCtaSecondaryText: home?.heroCtaSecondaryText ?? "",
    heroCtaSecondaryAnchor: home?.heroCtaSecondaryAnchor ?? "",
    heroVideoUrl: home?.heroVideoUrl ?? "",
  });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/home", { method: "PUT", headers: adminHeaders(), body: JSON.stringify(form) });
      if (!res.ok) throw new Error("Failed");
      toast.success("Hero content saved");
      await fetchContent();
    } catch { toast.error("Failed to save hero content"); }
    finally { setSaving(false); }
  };

  return (
    <SectionShell title="Hero Section" description="Controls the main banner and call-to-action buttons on the home page.">
      <Card className="p-6 space-y-5 border-border/60">
        <Field label="Headline">
          <Input value={form.heroTitle} onChange={(e) => setForm({ ...form, heroTitle: e.target.value })} placeholder="Welcome to Yahya Hub" />
        </Field>
        <Field label="Subtitle">
          <Textarea rows={3} value={form.heroSubtitle} onChange={(e) => setForm({ ...form, heroSubtitle: e.target.value })} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Primary button text">
            <Input value={form.heroCtaPrimaryText} onChange={(e) => setForm({ ...form, heroCtaPrimaryText: e.target.value })} />
          </Field>
          <Field label="Primary button anchor">
            <Input value={form.heroCtaPrimaryAnchor} onChange={(e) => setForm({ ...form, heroCtaPrimaryAnchor: e.target.value })} placeholder="workspaces" />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Secondary button text">
            <Input value={form.heroCtaSecondaryText} onChange={(e) => setForm({ ...form, heroCtaSecondaryText: e.target.value })} />
          </Field>
          <Field label="Secondary button anchor">
            <Input value={form.heroCtaSecondaryAnchor} onChange={(e) => setForm({ ...form, heroCtaSecondaryAnchor: e.target.value })} placeholder="courses" />
          </Field>
        </div>
        <Field label="Background video URL">
          <Input value={form.heroVideoUrl} onChange={(e) => setForm({ ...form, heroVideoUrl: e.target.value })} />
        </Field>
        <SaveButton saving={saving} onClick={save} />
      </Card>
    </SectionShell>
  );
}

/* ══════════════════════════════════════════
   STATUS CARDS EDITOR
══════════════════════════════════════════ */
function StatusCardsEditor() {
  const { statusCards, fetchContent } = useContent();
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  return (
    <SectionShell
      title="Status Cards"
      description="The four glassmorphism cards shown in the hero section."
      action={<Button size="sm" onClick={() => setCreating(true)} className="rounded-lg"><Plus className="h-4 w-4 mr-1.5" /> Add Card</Button>}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {statusCards.map((s) => (
          <Card key={s.id} className="border-border/60 p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <Activity className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">{s.title}</p>
                  <p className="text-xs text-muted-foreground">{s.primary}</p>
                </div>
              </div>
              <Badge className={cn("text-[10px]", s.badgeVariant === "green" ? "bg-green-50 text-green-700 border-green-200" : "bg-yellow-50 text-yellow-700 border-yellow-200")}>
                {s.badgeLabel}
              </Badge>
            </div>
            <p className="mt-2.5 text-xs text-muted-foreground">{s.secondary}</p>
            <div className="mt-3 flex gap-1.5 border-t pt-3">
              <Button size="sm" variant="outline" className="h-7 rounded-md text-xs" onClick={() => setEditing(s.id)}><Pencil className="h-3 w-3 mr-1" /> Edit</Button>
              <DeleteButton endpoint={`/api/admin/status-cards/${s.id}`} onDeleted={fetchContent} small />
            </div>
          </Card>
        ))}
      </div>

      {creating && <StatusCardForm onClose={() => setCreating(false)} onSaved={() => { setCreating(false); fetchContent(); }} />}
      {editing && (
        <StatusCardForm
          id={editing}
          initial={statusCards.find((s) => s.id === editing)!}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); fetchContent(); }}
        />
      )}
    </SectionShell>
  );
}

function StatusCardForm({ id, initial, onClose, onSaved }: {
  id?: string;
  initial?: { title: string; icon: string; badgeLabel: string; badgeVariant: string; primary: string; secondary: string; order: number };
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState(initial ?? { title: "", icon: "signal", badgeLabel: "Operational", badgeVariant: "green", primary: "", secondary: "", order: 0 });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch(id ? `/api/admin/status-cards/${id}` : `/api/admin/status-cards`, {
        method: id ? "PUT" : "POST", headers: adminHeaders(), body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success(id ? "Updated" : "Created");
      onSaved();
    } catch { toast.error("Failed to save"); }
    finally { setSaving(false); }
  };

  return (
    <FormDialog title={id ? "Edit status card" : "New status card"} onClose={onClose}>
      <Field label="Title"><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
      <Field label="Icon key (signal · zap · thermometer · briefcase-business)"><Input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} /></Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Badge label"><Input value={form.badgeLabel} onChange={(e) => setForm({ ...form, badgeLabel: e.target.value })} /></Field>
        <Field label="Badge colour">
          <Select value={form.badgeVariant} onValueChange={(v) => setForm({ ...form, badgeVariant: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="green">Green</SelectItem><SelectItem value="yellow">Yellow</SelectItem></SelectContent>
          </Select>
        </Field>
      </div>
      <Field label="Primary stat"><Input value={form.primary} onChange={(e) => setForm({ ...form, primary: e.target.value })} /></Field>
      <Field label="Secondary text"><Input value={form.secondary} onChange={(e) => setForm({ ...form, secondary: e.target.value })} /></Field>
      <Field label="Order"><Input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} /></Field>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={save} disabled={saving}>{saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}Save</Button>
      </DialogFooter>
    </FormDialog>
  );
}

/* ══════════════════════════════════════════
   WORKSPACES EDITOR
══════════════════════════════════════════ */
function WorkspacesEditor() {
  const { workspaces, fetchContent } = useContent();
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  return (
    <SectionShell
      title="Workspaces"
      description="All rentable spaces shown on the site."
      action={<Button size="sm" onClick={() => setCreating(true)} className="rounded-lg"><Plus className="h-4 w-4 mr-1.5" /> Add Workspace</Button>}
    >
      <div className="overflow-hidden rounded-xl border border-border/60 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/40">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
              <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground sm:table-cell">Hourly</th>
              <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground md:table-cell">Daily</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {workspaces.map((w) => (
              <tr key={w.id} className="hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3">
                  <p className="font-medium text-foreground">{w.name}</p>
                  <p className="text-xs text-muted-foreground">{w.amenities.length} amenities · ⭐ {w.rating}</p>
                </td>
                <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">₦{w.hourlyRate.toLocaleString()}/hr</td>
                <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">₦{w.dailyRate.toLocaleString()}/day</td>
                <td className="px-4 py-3">
                  <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium", w.bookingEnabled ? "bg-green-50 text-green-700" : "bg-muted text-muted-foreground")}>
                    {w.bookingEnabled ? "Active" : "Disabled"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setEditing(w.id)}><Pencil className="h-3.5 w-3.5" /></Button>
                    <DeleteButton endpoint={`/api/admin/workspaces/${w.id}`} onDeleted={fetchContent} small />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {creating && <WorkspaceForm onClose={() => setCreating(false)} onSaved={() => { setCreating(false); fetchContent(); }} />}
      {editing && (
        <WorkspaceForm
          id={editing}
          initial={workspaces.find((w) => w.id === editing) as WorkspaceFormInitial}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); fetchContent(); }}
        />
      )}
    </SectionShell>
  );
}

type WorkspaceFormInitial = {
  name: string; description: string; rating: number; reviewCount: number;
  hourlyRate: number; dailyRate: number; imageUrl: string; bookingEnabled: boolean;
  amenities: { icon: string; label: string }[]; order: number;
};

const DAY_NAMES_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type AvailFormState = {
  availableDays: number[]; openTime: string; closeTime: string;
  slotDuration: number; blackoutDates: string;
};

function WorkspaceForm({ id, initial, onClose, onSaved }: { id?: string; initial?: WorkspaceFormInitial; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState<WorkspaceFormInitial>(initial ?? {
    name: "", description: "", rating: 4.5, reviewCount: 0, hourlyRate: 0, dailyRate: 0, imageUrl: "", bookingEnabled: true, amenities: [], order: 0,
  });
  const [avail, setAvail] = useState<AvailFormState>({
    availableDays: [1, 2, 3, 4, 5], openTime: "09:00", closeTime: "20:00", slotDuration: 60, blackoutDates: "",
  });
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    if (!id) return;
    fetch(`/api/admin/workspaces/${id}/availability`, { headers: adminHeaders() })
      .then(r => r.json())
      .then(data => {
        setAvail({
          availableDays: data.availableDays ?? [1,2,3,4,5],
          openTime: data.openTime ?? "09:00",
          closeTime: data.closeTime ?? "20:00",
          slotDuration: data.slotDuration ?? 60,
          blackoutDates: (data.blackoutDates ?? []).join(", "),
        });
      }).catch(() => {});
  }, [id]);

  const toggleDay = (d: number) => {
    setAvail(a => ({
      ...a,
      availableDays: a.availableDays.includes(d)
        ? a.availableDays.filter(x => x !== d)
        : [...a.availableDays, d].sort(),
    }));
  };

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch(id ? `/api/admin/workspaces/${id}` : `/api/admin/workspaces`, {
        method: id ? "PUT" : "POST", headers: adminHeaders(), body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      const saved = await res.json();
      const wsId = id ?? saved.id;
      if (wsId) {
        const blackoutDates = avail.blackoutDates.split(",").map((s: string) => s.trim()).filter(Boolean);
        await fetch(`/api/admin/workspaces/${wsId}/availability`, {
          method: "PUT", headers: adminHeaders(),
          body: JSON.stringify({ ...avail, blackoutDates }),
        });
      }
      toast.success(id ? "Workspace updated" : "Workspace created");
      onSaved();
    } catch { toast.error("Failed to save"); }
    finally { setSaving(false); }
  };

  return (
    <FormDialog title={id ? "Edit Workspace" : "New Workspace"} onClose={onClose} wide>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Name"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
        <Field label="Image URL"><Input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} /></Field>
      </div>
      <Field label="Description"><Textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
      <div className="grid grid-cols-4 gap-3">
        <Field label="Hourly (₦)"><Input type="number" value={form.hourlyRate} onChange={(e) => setForm({ ...form, hourlyRate: Number(e.target.value) })} /></Field>
        <Field label="Daily (₦)"><Input type="number" value={form.dailyRate} onChange={(e) => setForm({ ...form, dailyRate: Number(e.target.value) })} /></Field>
        <Field label="Rating"><Input type="number" step="0.1" value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} /></Field>
        <Field label="Reviews"><Input type="number" value={form.reviewCount} onChange={(e) => setForm({ ...form, reviewCount: Number(e.target.value) })} /></Field>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="ws-booking" checked={form.bookingEnabled} onCheckedChange={(v) => setForm({ ...form, bookingEnabled: v === true })} />
        <label htmlFor="ws-booking" className="text-sm font-medium">Booking enabled</label>
      </div>
      <div>
        <div className="mb-2 flex items-center justify-between">
          <Label>Amenities</Label>
          <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setForm({ ...form, amenities: [...form.amenities, { icon: "armchair", label: "" }] })}>
            <Plus className="h-3 w-3 mr-1" /> Add
          </Button>
        </div>
        <div className="space-y-2">
          {form.amenities.map((a, i) => (
            <div key={i} className="flex gap-2">
              <Input placeholder="icon (armchair, desk, sofa, tv, projector, whiteboard)" value={a.icon} onChange={(e) => { const next = [...form.amenities]; next[i] = { ...next[i], icon: e.target.value }; setForm({ ...form, amenities: next }); }} className="flex-1" />
              <Input placeholder="label (e.g. 50 Chair)" value={a.label} onChange={(e) => { const next = [...form.amenities]; next[i] = { ...next[i], label: e.target.value }; setForm({ ...form, amenities: next }); }} className="flex-1" />
              <Button size="icon" variant="ghost" onClick={() => setForm({ ...form, amenities: form.amenities.filter((_, j) => j !== i) })}><X className="h-4 w-4" /></Button>
            </div>
          ))}
        </div>
      </div>

      {/* ── Availability Configuration ── */}
      <div className="rounded-lg border border-emerald-200 bg-emerald-50/40 p-4 space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="text-sm font-semibold text-emerald-800">Availability Configuration</span>
        </div>

        {/* Available days */}
        <div>
          <Label className="text-xs text-muted-foreground mb-2 block">Available Days</Label>
          <div className="flex gap-1.5 flex-wrap">
            {DAY_NAMES_SHORT.map((name, i) => (
              <button
                key={i}
                type="button"
                onClick={() => toggleDay(i)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-semibold border transition-all",
                  avail.availableDays.includes(i)
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-white text-muted-foreground border-border hover:border-emerald-300"
                )}
              >{name}</button>
            ))}
          </div>
        </div>

        {/* Times + slot duration */}
        <div className="grid grid-cols-3 gap-3">
          <Field label="Open Time">
            <Input type="time" value={avail.openTime} onChange={e => setAvail({ ...avail, openTime: e.target.value })} />
          </Field>
          <Field label="Close Time">
            <Input type="time" value={avail.closeTime} onChange={e => setAvail({ ...avail, closeTime: e.target.value })} />
          </Field>
          <Field label="Slot Duration">
            <Select value={String(avail.slotDuration)} onValueChange={v => setAvail({ ...avail, slotDuration: Number(v) })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 min</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="90">90 min</SelectItem>
                <SelectItem value="120">2 hours</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>

        {/* Blackout dates */}
        <Field label="Blackout Dates (comma-separated YYYY-MM-DD)">
          <Input
            placeholder="e.g. 2025-12-25, 2025-01-01"
            value={avail.blackoutDates}
            onChange={e => setAvail({ ...avail, blackoutDates: e.target.value })}
          />
        </Field>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={save} disabled={saving}>{saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}Save</Button>
      </DialogFooter>
    </FormDialog>
  );
}

/* ══════════════════════════════════════════
   COURSES EDITOR
══════════════════════════════════════════ */
function ProgramsEditor() {
  const { upcomingPrograms, completedPrograms, fetchContent } = useContent();
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const all = [...upcomingPrograms, ...completedPrograms];

  return (
    <SectionShell
      title="Courses"
      description="Upcoming and completed skill-building programs."
      action={<Button size="sm" onClick={() => setCreating(true)} className="rounded-lg"><Plus className="h-4 w-4 mr-1.5" /> Add Course</Button>}
    >
      <div className="overflow-hidden rounded-xl border border-border/60 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/40">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Course</th>
              <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground sm:table-cell">Duration</th>
              <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground md:table-cell">Price</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {all.map((p) => (
              <tr key={p.id} className="hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3">
                  <p className="font-medium text-foreground">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.cohort ?? p.category}</p>
                </td>
                <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">{p.duration}</td>
                <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">₦{p.price.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium", p.status === "upcoming" ? "bg-secondary/10 text-secondary" : "bg-green-50 text-green-700")}>
                    {p.status === "upcoming" ? "Upcoming" : "Completed"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setEditing(p.id)}><Pencil className="h-3.5 w-3.5" /></Button>
                    <DeleteButton endpoint={`/api/admin/programs/${p.id}`} onDeleted={fetchContent} small />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {creating && <ProgramForm onClose={() => setCreating(false)} onSaved={() => { setCreating(false); fetchContent(); }} />}
      {editing && (
        <ProgramForm
          id={editing}
          initial={all.find((p) => p.id === editing) as ProgramFormInitial}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); fetchContent(); }}
        />
      )}
    </SectionShell>
  );
}

type ProgramFormInitial = {
  name: string; description: string; category: string; duration: string; price: number;
  status: "upcoming" | "completed"; cohort: string; type: string; enrollable: boolean; imageUrl: string; order: number;
};

function ProgramForm({ id, initial, onClose, onSaved }: { id?: string; initial?: ProgramFormInitial; onClose: () => void; onSaved: () => void }) {
  const blank: ProgramFormInitial = { name: "", description: "", category: "", duration: "", price: 0, status: "upcoming", cohort: "", type: "", enrollable: true, imageUrl: "", order: 0 };
  const merged = initial ? { ...blank, ...(initial as ProgramFormInitial) } : blank;
  // API may return null for optional fields — coerce to empty string for controlled inputs
  merged.cohort = merged.cohort ?? "";
  merged.type = merged.type ?? "";
  merged.imageUrl = merged.imageUrl ?? "";
  const [form, setForm] = useState<ProgramFormInitial>(merged);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      const payload = { ...form, cohort: form.cohort || null, type: form.type || null, imageUrl: form.imageUrl || null };
      const res = await fetch(id ? `/api/admin/programs/${id}` : `/api/admin/programs`, {
        method: id ? "PUT" : "POST", headers: adminHeaders(), body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success(id ? "Course updated" : "Course created");
      onSaved();
    } catch { toast.error("Failed to save"); }
    finally { setSaving(false); }
  };

  return (
    <FormDialog title={id ? "Edit Course" : "New Course"} onClose={onClose} wide>
      <Field label="Name"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
      <Field label="Description"><Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Category"><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></Field>
        <Field label="Duration"><Input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} /></Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Price (₦)"><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} /></Field>
        <Field label="Status">
          <Select value={form.status} onValueChange={(v: "upcoming" | "completed") => setForm({ ...form, status: v, enrollable: v === "upcoming" })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="upcoming">Upcoming</SelectItem><SelectItem value="completed">Completed</SelectItem></SelectContent>
          </Select>
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Cohort (optional)"><Input value={form.cohort} onChange={(e) => setForm({ ...form, cohort: e.target.value })} placeholder="Cohort 1" /></Field>
        <Field label="Type (optional)"><Input value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} placeholder="Workshop" /></Field>
      </div>
      <Field label="Cover Image URL (optional)"><Input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." /></Field>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={save} disabled={saving}>{saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}Save</Button>
      </DialogFooter>
    </FormDialog>
  );
}

/* ══════════════════════════════════════════
   EVENTS EDITOR
══════════════════════════════════════════ */
function EventsEditor() {
  const { homeEvents, pastEvents, fetchContent } = useContent();
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const all = [...homeEvents, ...pastEvents];

  return (
    <SectionShell
      title="Events"
      description="Upcoming, ongoing, and past events."
      action={<Button size="sm" onClick={() => setCreating(true)} className="rounded-lg"><Plus className="h-4 w-4 mr-1.5" /> Add Event</Button>}
    >
      <div className="overflow-hidden rounded-xl border border-border/60 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/40">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Event</th>
              <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground sm:table-cell">Date</th>
              <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground md:table-cell">Fee</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {all.map((e) => (
              <tr key={e.id} className="hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3">
                  <p className="font-medium text-foreground line-clamp-1">{e.title}</p>
                  <p className="text-xs text-muted-foreground">{e.category} · {e.mode}</p>
                </td>
                <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">{e.date}</td>
                <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">{e.fee === 0 ? "Free" : `₦${e.fee.toLocaleString()}`}</td>
                <td className="px-4 py-3">
                  <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
                    e.status === "ongoing"  ? "bg-green-50 text-green-700" :
                    e.status === "upcoming" ? "bg-secondary/10 text-secondary" :
                    "bg-muted text-muted-foreground"
                  )}>
                    {e.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setEditing(e.id)}><Pencil className="h-3.5 w-3.5" /></Button>
                    <DeleteButton endpoint={`/api/admin/events/${e.id}`} onDeleted={fetchContent} small />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {creating && <EventForm onClose={() => setCreating(false)} onSaved={() => { setCreating(false); fetchContent(); }} />}
      {editing && (
        <EventForm
          id={editing}
          initial={all.find((e) => e.id === editing) as EventFormInitial}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); fetchContent(); }}
        />
      )}
    </SectionShell>
  );
}

type EventFormInitial = {
  title: string; description: string; longWriteUp: string; category: string;
  mode: "Online" | "Physical" | "Webinar"; isMostRecent: boolean; status: "ongoing" | "upcoming" | "past";
  date: string; time: string; location: string; audience: string; fee: number;
  instagramUrl: string; imageUrl: string; videoUrl: string; bookable: boolean; list: "home" | "past"; order: number;
};

function EventForm({ id, initial, onClose, onSaved }: { id?: string; initial?: EventFormInitial; onClose: () => void; onSaved: () => void }) {
  const blankEvent: EventFormInitial = {
    title: "", description: "", longWriteUp: "", category: "Conference", mode: "Physical",
    isMostRecent: false, status: "upcoming", date: "", time: "", location: "Yahya Hub",
    audience: "", fee: 0, instagramUrl: "https://www.instagram.com/yahyahub/", imageUrl: "", videoUrl: "", bookable: true, list: "home", order: 0,
  };
  const mergedEvent = initial ? { ...blankEvent, ...(initial as EventFormInitial) } : blankEvent;
  mergedEvent.longWriteUp = mergedEvent.longWriteUp ?? "";
  mergedEvent.list = mergedEvent.list ?? "home";
  mergedEvent.imageUrl = mergedEvent.imageUrl ?? "";
  mergedEvent.videoUrl = mergedEvent.videoUrl ?? "";
  const [form, setForm] = useState<EventFormInitial>(mergedEvent);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      const payload = { ...form, longWriteUp: form.longWriteUp || null, imageUrl: form.imageUrl || null, videoUrl: form.videoUrl || null };
      const res = await fetch(id ? `/api/admin/events/${id}` : `/api/admin/events`, {
        method: id ? "PUT" : "POST", headers: adminHeaders(), body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success(id ? "Event updated" : "Event created");
      onSaved();
    } catch { toast.error("Failed to save"); }
    finally { setSaving(false); }
  };

  return (
    <FormDialog title={id ? "Edit Event" : "New Event"} onClose={onClose} wide>
      <Field label="Title"><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
      <Field label="Short description"><Textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
      <Field label="Full write-up (past events)"><Textarea rows={4} value={form.longWriteUp} onChange={(e) => setForm({ ...form, longWriteUp: e.target.value })} /></Field>
      <div className="grid grid-cols-3 gap-4">
        <Field label="Category"><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></Field>
        <Field label="Mode">
          <Select value={form.mode} onValueChange={(v: "Online" | "Physical" | "Webinar") => setForm({ ...form, mode: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="Physical">Physical</SelectItem><SelectItem value="Online">Online</SelectItem><SelectItem value="Webinar">Webinar</SelectItem></SelectContent>
          </Select>
        </Field>
        <Field label="Status">
          <Select value={form.status} onValueChange={(v: "ongoing" | "upcoming" | "past") => setForm({ ...form, status: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="upcoming">Upcoming</SelectItem><SelectItem value="ongoing">Ongoing</SelectItem><SelectItem value="past">Past</SelectItem></SelectContent>
          </Select>
        </Field>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Field label="Date"><Input value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} placeholder="Nov 21, 2026" /></Field>
        <Field label="Time"><Input value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} placeholder="10:00 AM – 01:00 PM" /></Field>
        <Field label="Location"><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Audience"><Input value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value })} /></Field>
        <Field label="Fee (₦, 0 = Free)"><Input type="number" value={form.fee} onChange={(e) => setForm({ ...form, fee: Number(e.target.value) })} /></Field>
      </div>
      <Field label="Cover Image URL (optional)"><Input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://... (shown on card & detail page)" /></Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Instagram URL"><Input value={form.instagramUrl} onChange={(e) => setForm({ ...form, instagramUrl: e.target.value })} /></Field>
        <Field label="List">
          <Select value={form.list} onValueChange={(v: "home" | "past") => setForm({ ...form, list: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="home">Home page</SelectItem><SelectItem value="past">Past events</SelectItem></SelectContent>
          </Select>
        </Field>
      </div>
      <Field label="Video Replay URL (optional — for past/webinar events)"><Input value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} placeholder="https://youtube.com/watch?v=... or Zoom recording" /></Field>
      <div className="flex flex-wrap gap-6">
        <div className="flex items-center gap-2"><Checkbox id="ev-recent" checked={form.isMostRecent} onCheckedChange={(v) => setForm({ ...form, isMostRecent: v === true })} /><label htmlFor="ev-recent" className="text-sm font-medium">Most recent badge</label></div>
        <div className="flex items-center gap-2"><Checkbox id="ev-bookable" checked={form.bookable} onCheckedChange={(v) => setForm({ ...form, bookable: v === true })} /><label htmlFor="ev-bookable" className="text-sm font-medium">Booking enabled</label></div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={save} disabled={saving}>{saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}Save</Button>
      </DialogFooter>
    </FormDialog>
  );
}

/* ══════════════════════════════════════════
   ABOUT PAGE EDITOR
══════════════════════════════════════════ */

const ABOUT_DEFAULTS: AboutConfig = {
  heroTitle: "Where Ideas", heroHighlight: "Become Reality",
  heroSubtitle: "Yahya Hub is more than a coworking space — it's a launchpad for talent, ideas, and community in the heart of Northern Nigeria.",
  heroLocation: "Based in Abuja, Nigeria", heroCtaPrimary: "Explore Workspaces", heroCtaSecondary: "Our Courses",
  stats: [{ value: "500+", label: "Community Members" }, { value: "50+", label: "Events Hosted" }, { value: "3+", label: "Years of Impact" }, { value: "98%", label: "Satisfaction Rate" }],
  missionText: "Yahya Hub exists to lower the cost of turning ideas into reality.", missionSub: "Our mission is to be the connective tissue between talent, opportunity, and the infrastructure that lets both thrive.",
  missionTags: ["Talent Development", "Collaboration", "Access", "Innovation"],
  visionText: "We see a Northern Nigeria where ambition is not gated by access.", visionSub: "Yahya Hub is building toward that future — one program, one event, one workspace at a time.",
  visionTags: ["Northern Nigeria", "Empowerment", "Accessibility", "Future-Ready"],
  timeline: [
    { year: "2021", title: "The Idea", desc: "Yahya Hub was born from a simple belief: that access to great workspace and education shouldn't be a privilege." },
    { year: "2022", title: "Opening Day", desc: "We opened our first coworking space in Abuja." },
    { year: "2023", title: "YH Connect Launches", desc: "We extended our reach into the built environment with YH Connect." },
    { year: "2024", title: "Growing Community", desc: "500+ active members, 50+ events hosted." },
    { year: "2025+", title: "The Future", desc: "Expanding programs, new workspace locations." },
  ],
  values: [
    { title: "Innovation", desc: "We embrace new ideas and challenge conventional thinking.", icon: "lightbulb", color: "amber" },
    { title: "Community", desc: "We believe great things happen when talented people collaborate.", icon: "users", color: "sky" },
    { title: "Integrity", desc: "We operate transparently and honestly.", icon: "shield", color: "green" },
    { title: "Growth", desc: "We help every individual that walks through our doors level up.", icon: "rocket", color: "purple" },
  ],
  visitTitle: "Come Visit Us", visitSubtitle: "We're located in the heart of Abuja. Come in for a tour, grab a hot desk for the day, or just say hello.",
  visitHours: "Open 9:00 AM – 8:00 PM",
  visitFeatures: ["High-speed Starlink internet", "Dedicated desks & private offices", "Event & workshop space", "Collaborative open floor"],
  address: "Abuja, Nigeria",
  ctaTitle: "Join Our Community", ctaSub: "Whether you're looking for a place to work, a skill to learn, or a network to grow with — you have a home at Yahya Hub.",
  ctaCtaPrimary: "Get Started", ctaCtaSecondary: "Upcoming Events",
  faqs: [
    { q: "What is Yahya Hub?", a: "Yahya Hub is a co-working space, innovation center, and community hub in Abuja, Nigeria. We provide flexible workspaces, training programs, and networking events designed to help entrepreneurs, freelancers, and professionals grow." },
    { q: "How do I book a workspace?", a: "Browse available spaces on our website, choose your preferred date and time (hourly or full-day), complete payment via Paystack, and you'll receive an email confirmation with your ticket." },
    { q: "What payment methods do you accept?", a: "We accept card payments (Visa, Mastercard, Verve) and bank transfers through Paystack. Payment is required upfront to confirm your booking or registration." },
    { q: "Can I get a refund if I cancel?", a: "Cancellations made at least 48 hours before your scheduled date are eligible for a refund. Please contact us via email or WhatsApp to initiate a cancellation." },
    { q: "Do I need to be a member to attend events?", a: "No, most of our events are open to the public. Some events may require registration or have a fee. Check the event details on our Events page for specific requirements." },
    { q: "What amenities are available at the hub?", a: "We offer high-speed Wi-Fi, power backup, printing/scanning, meeting rooms, a lounge area, and on-site support. Specific amenities vary by workspace type." },
    { q: "How do I track my booking or registration ticket?", a: "After booking or registering, you'll receive a ticket ID via email. Visit the Track page on our website and enter your ticket ID to check the status at any time." },
    { q: "How can I reach you quickly?", a: "You can reach us by email, call or WhatsApp us, or simply walk in during our operating hours. We typically respond to WhatsApp messages within a few hours." },
  ],
  whatsapp: "https://wa.me/2347043925169",
  socialFacebook: "https://www.facebook.com/share/1913yPdrYe/",
  socialTwitter: "https://x.com/YahyaHub",
  socialLinkedin: "https://www.linkedin.com/company/yahyahub/posts",
  chatModel: "deepseek/deepseek-v4-flash:free",
};

const VALUE_ICONS = ["lightbulb", "users", "shield", "rocket", "star", "heart", "zap", "globe", "award"];
const VALUE_COLORS = ["amber", "sky", "green", "purple", "blue", "rose", "orange"];

function AboutEditor() {
  const { aboutConfig: raw, fetchContent } = useContent();
  const [cfg, setCfg] = React.useState<AboutConfig>({ ...ABOUT_DEFAULTS, ...(raw ?? {}) });
  const [saving, setSaving] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState<"hero" | "stats" | "mission" | "timeline" | "values" | "visit" | "faq" | "chatbot" | "cta">("hero");

  // Keep in sync when store loads
  React.useEffect(() => {
    if (raw) setCfg({ ...ABOUT_DEFAULTS, ...raw });
  }, [raw]);

  const save = async () => {
    setSaving(true);
    try {
      await fetch("/api/admin/about", { method: "PUT", headers: adminHeaders(), body: JSON.stringify(cfg) });
      toast.success("About page saved");
      fetchContent();
    } catch { toast.error("Failed to save"); }
    finally { setSaving(false); }
  };

  const set = (patch: Partial<AboutConfig>) => setCfg(c => ({ ...c, ...patch }));

  const SECTIONS = [
    { id: "hero" as const, label: "Hero" },
    { id: "stats" as const, label: "Stats" },
    { id: "mission" as const, label: "Mission & Vision" },
    { id: "timeline" as const, label: "Timeline" },
    { id: "values" as const, label: "Core Values" },
    { id: "visit" as const, label: "Visit / Contact" },
    { id: "faq" as const, label: "FAQ" },
    { id: "chatbot" as const, label: "Chatbot" },
    { id: "cta" as const, label: "CTA Banner" },
  ];

  return (
    <SectionShell
      title="About Page"
      description="Edit every section of the About Us page."
      action={<Button onClick={save} disabled={saving}>{saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}Save All</Button>}
    >

      {/* Section tabs */}
      <div className="flex flex-wrap gap-1.5 rounded-xl bg-muted/60 p-1.5">
        {SECTIONS.map(s => (
          <button key={s.id} onClick={() => setActiveSection(s.id)}
            className={cn("rounded-lg px-3 py-1.5 text-xs font-semibold transition-all",
              activeSection === s.id ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}>
            {s.label}
          </button>
        ))}
      </div>

      {/* ── Hero ── */}
      {activeSection === "hero" && (
        <Card className="p-6 space-y-4 border-border/60">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Title Line 1"><Input value={cfg.heroTitle} onChange={e => set({ heroTitle: e.target.value })} /></Field>
            <Field label="Title Highlight (coloured)"><Input value={cfg.heroHighlight} onChange={e => set({ heroHighlight: e.target.value })} /></Field>
          </div>
          <Field label="Subtitle"><Textarea rows={3} value={cfg.heroSubtitle} onChange={e => set({ heroSubtitle: e.target.value })} /></Field>
          <Field label="Location Badge Text"><Input value={cfg.heroLocation} onChange={e => set({ heroLocation: e.target.value })} /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="CTA Primary Label"><Input value={cfg.heroCtaPrimary} onChange={e => set({ heroCtaPrimary: e.target.value })} /></Field>
            <Field label="CTA Secondary Label"><Input value={cfg.heroCtaSecondary} onChange={e => set({ heroCtaSecondary: e.target.value })} /></Field>
          </div>
        </Card>
      )}

      {/* ── Stats ── */}
      {activeSection === "stats" && (
        <Card className="p-6 space-y-4 border-border/60">
          <div className="flex items-center justify-between mb-2">
            <Label className="text-sm font-semibold">Stats Cards</Label>
            <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => set({ stats: [...cfg.stats, { value: "0+", label: "New Stat" }] })}>
              <Plus className="h-3 w-3 mr-1" /> Add
            </Button>
          </div>
          <div className="space-y-3">
            {cfg.stats.map((s, i) => (
              <div key={i} className="flex gap-3 items-center">
                <Input className="w-28" placeholder="Value (e.g. 500+)" value={s.value}
                  onChange={e => { const n = [...cfg.stats]; n[i] = { ...n[i], value: e.target.value }; set({ stats: n }); }} />
                <Input placeholder="Label (e.g. Community Members)" value={s.label}
                  onChange={e => { const n = [...cfg.stats]; n[i] = { ...n[i], label: e.target.value }; set({ stats: n }); }} />
                <Button size="icon" variant="ghost" className="h-8 w-8 shrink-0 text-destructive" onClick={() => set({ stats: cfg.stats.filter((_, j) => j !== i) })}>
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ── Mission & Vision ── */}
      {activeSection === "mission" && (
        <div className="space-y-4">
          <Card className="p-6 space-y-4 border-border/60">
            <p className="text-sm font-semibold text-primary">Our Mission</p>
            <Field label="Main Text"><Textarea rows={4} value={cfg.missionText} onChange={e => set({ missionText: e.target.value })} /></Field>
            <Field label="Sub Text"><Textarea rows={2} value={cfg.missionSub} onChange={e => set({ missionSub: e.target.value })} /></Field>
            <Field label="Tags (comma-separated)">
              <Input value={cfg.missionTags.join(", ")} onChange={e => set({ missionTags: e.target.value.split(",").map(t => t.trim()).filter(Boolean) })} />
            </Field>
          </Card>
          <Card className="p-6 space-y-4 border-border/60">
            <p className="text-sm font-semibold text-secondary">Our Vision</p>
            <Field label="Main Text"><Textarea rows={4} value={cfg.visionText} onChange={e => set({ visionText: e.target.value })} /></Field>
            <Field label="Sub Text"><Textarea rows={2} value={cfg.visionSub} onChange={e => set({ visionSub: e.target.value })} /></Field>
            <Field label="Tags (comma-separated)">
              <Input value={cfg.visionTags.join(", ")} onChange={e => set({ visionTags: e.target.value.split(",").map(t => t.trim()).filter(Boolean) })} />
            </Field>
          </Card>
        </div>
      )}

      {/* ── Timeline ── */}
      {activeSection === "timeline" && (
        <Card className="p-6 space-y-4 border-border/60">
          <div className="flex items-center justify-between mb-2">
            <Label className="text-sm font-semibold">Timeline Entries</Label>
            <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => set({ timeline: [...cfg.timeline, { year: "2026", title: "", desc: "" }] })}>
              <Plus className="h-3 w-3 mr-1" /> Add
            </Button>
          </div>
          <div className="space-y-4">
            {cfg.timeline.map((t, i) => (
              <div key={i} className="rounded-lg border p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Entry {i + 1}</span>
                  <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => set({ timeline: cfg.timeline.filter((_, j) => j !== i) })}>
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <Field label="Year"><Input value={t.year} onChange={e => { const n = [...cfg.timeline]; n[i] = { ...n[i], year: e.target.value }; set({ timeline: n }); }} /></Field>
                  <div className="col-span-2"><Field label="Title"><Input value={t.title} onChange={e => { const n = [...cfg.timeline]; n[i] = { ...n[i], title: e.target.value }; set({ timeline: n }); }} /></Field></div>
                </div>
                <Field label="Description"><Textarea rows={2} value={t.desc} onChange={e => { const n = [...cfg.timeline]; n[i] = { ...n[i], desc: e.target.value }; set({ timeline: n }); }} /></Field>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ── Core Values ── */}
      {activeSection === "values" && (
        <Card className="p-6 space-y-4 border-border/60">
          <div className="flex items-center justify-between mb-2">
            <Label className="text-sm font-semibold">Core Values</Label>
            <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => set({ values: [...cfg.values, { title: "", desc: "", icon: "star", color: "amber" }] })}>
              <Plus className="h-3 w-3 mr-1" /> Add
            </Button>
          </div>
          <div className="space-y-4">
            {cfg.values.map((v, i) => (
              <div key={i} className="rounded-lg border p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Value {i + 1}</span>
                  <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => set({ values: cfg.values.filter((_, j) => j !== i) })}>
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Title"><Input value={v.title} onChange={e => { const n = [...cfg.values]; n[i] = { ...n[i], title: e.target.value }; set({ values: n }); }} /></Field>
                  <div className="grid grid-cols-2 gap-2">
                    <Field label="Icon">
                      <Select value={v.icon} onValueChange={val => { const n = [...cfg.values]; n[i] = { ...n[i], icon: val }; set({ values: n }); }}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {["lightbulb","users","shield","rocket","star","heart","zap","globe","award"].map(ic => <SelectItem key={ic} value={ic}>{ic}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field label="Colour">
                      <Select value={v.color} onValueChange={val => { const n = [...cfg.values]; n[i] = { ...n[i], color: val }; set({ values: n }); }}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {["amber","sky","green","purple","blue","rose","orange"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </Field>
                  </div>
                </div>
                <Field label="Description"><Textarea rows={2} value={v.desc} onChange={e => { const n = [...cfg.values]; n[i] = { ...n[i], desc: e.target.value }; set({ values: n }); }} /></Field>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ── Visit / Contact ── */}
      {activeSection === "visit" && (
        <Card className="p-6 space-y-4 border-border/60">
          <Field label="Section Title"><Input value={cfg.visitTitle} onChange={e => set({ visitTitle: e.target.value })} /></Field>
          <Field label="Section Subtitle"><Textarea rows={2} value={cfg.visitSubtitle} onChange={e => set({ visitSubtitle: e.target.value })} /></Field>
          <Field label="Address"><Input value={cfg.address} onChange={e => set({ address: e.target.value })} /></Field>
          <Field label="Opening Hours Badge"><Input value={cfg.visitHours} onChange={e => set({ visitHours: e.target.value })} /></Field>
          <Field label="WhatsApp Link"><Input value={cfg.whatsapp ?? ""} onChange={e => set({ whatsapp: e.target.value })} placeholder="https://wa.me/234..." /></Field>
          <div className="pt-1">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3 block">Social Links</Label>
            <div className="space-y-2">
              <Field label="Facebook URL"><Input value={cfg.socialFacebook ?? ""} onChange={e => set({ socialFacebook: e.target.value })} placeholder="https://facebook.com/..." /></Field>
              <Field label="Twitter / X URL"><Input value={cfg.socialTwitter ?? ""} onChange={e => set({ socialTwitter: e.target.value })} placeholder="https://x.com/..." /></Field>
              <Field label="LinkedIn URL"><Input value={cfg.socialLinkedin ?? ""} onChange={e => set({ socialLinkedin: e.target.value })} placeholder="https://linkedin.com/..." /></Field>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Visit Features</Label>
              <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => set({ visitFeatures: [...cfg.visitFeatures, ""] })}>
                <Plus className="h-3 w-3 mr-1" /> Add
              </Button>
            </div>
            <div className="space-y-2">
              {cfg.visitFeatures.map((f, i) => (
                <div key={i} className="flex gap-2">
                  <Input value={f} onChange={e => { const n = [...cfg.visitFeatures]; n[i] = e.target.value; set({ visitFeatures: n }); }} />
                  <Button size="icon" variant="ghost" className="h-9 w-9 shrink-0 text-destructive" onClick={() => set({ visitFeatures: cfg.visitFeatures.filter((_, j) => j !== i) })}>
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* ── FAQ ── */}
      {activeSection === "faq" && (
        <Card className="p-6 space-y-4 border-border/60">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Add, edit, or remove FAQ items. They appear on the About page.</p>
            <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => set({ faqs: [...(cfg.faqs ?? []), { q: "", a: "" }] })}>
              <Plus className="h-3 w-3 mr-1" /> Add Question
            </Button>
          </div>
          <div className="space-y-4">
            {(cfg.faqs ?? []).map((faq, i) => (
              <div key={i} className="rounded-lg border border-border/60 p-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Question {i + 1}</span>
                  <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => set({ faqs: cfg.faqs.filter((_, j) => j !== i) })}>
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <Field label="Question">
                  <Input
                    value={faq.q}
                    onChange={e => { const n = [...cfg.faqs]; n[i] = { ...n[i], q: e.target.value }; set({ faqs: n }); }}
                    placeholder="e.g. How do I book a workspace?"
                  />
                </Field>
                <Field label="Answer">
                  <Textarea
                    rows={3}
                    value={faq.a}
                    onChange={e => { const n = [...cfg.faqs]; n[i] = { ...n[i], a: e.target.value }; set({ faqs: n }); }}
                    placeholder="Type the answer here..."
                  />
                </Field>
              </div>
            ))}
            {(cfg.faqs ?? []).length === 0 && (
              <p className="text-center text-sm text-muted-foreground py-6">No FAQ items yet. Click &quot;Add Question&quot; to get started.</p>
            )}
          </div>
        </Card>
      )}

      {/* ── CTA Banner ── */}
      {activeSection === "chatbot" && (
        <Card className="p-6 space-y-4 border-border/60">
          <div className="space-y-1">
            <p className="text-sm font-medium">AI Model (OpenRouter slug)</p>
            <p className="text-xs text-muted-foreground mb-2">
              Enter any OpenRouter model ID. Append <code className="bg-muted px-1 rounded">:free</code> for free-tier models.
              Browse available models at <span className="text-primary">openrouter.ai/models</span>.
            </p>
            <Input
              value={cfg.chatModel ?? "deepseek/deepseek-v4-flash:free"}
              onChange={e => set({ chatModel: e.target.value })}
              placeholder="e.g. deepseek/deepseek-v4-flash:free"
              className="font-mono text-sm"
            />
          </div>
          <div className="rounded-md bg-muted/50 p-3 text-xs text-muted-foreground space-y-1">
            <p className="font-medium text-foreground">Recommended free models:</p>
            {[
              "deepseek/deepseek-v4-flash:free",
              "google/gemma-4-31b-it:free",
              "google/gemma-4-26b-a4b-it:free",
              "moonshotai/kimi-k2.6:free",
            ].map(m => (
              <button
                key={m}
                type="button"
                className="block font-mono hover:text-primary transition-colors cursor-pointer"
                onClick={() => set({ chatModel: m })}
              >{m}</button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Note: if <code className="bg-muted px-1 rounded">OPENROUTER_MODEL</code> is set in your Vercel environment variables, it overrides this setting.
          </p>
        </Card>
      )}

      {activeSection === "cta" && (
        <Card className="p-6 space-y-4 border-border/60">
          <Field label="Banner Title"><Input value={cfg.ctaTitle} onChange={e => set({ ctaTitle: e.target.value })} /></Field>
          <Field label="Banner Subtitle"><Textarea rows={3} value={cfg.ctaSub} onChange={e => set({ ctaSub: e.target.value })} /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Primary CTA Label"><Input value={cfg.ctaCtaPrimary} onChange={e => set({ ctaCtaPrimary: e.target.value })} /></Field>
            <Field label="Secondary CTA Label"><Input value={cfg.ctaCtaSecondary} onChange={e => set({ ctaCtaSecondary: e.target.value })} /></Field>
          </div>
        </Card>
      )}
    </SectionShell>
  );
}

function FooterEditor() {
  const { footer, fetchContent } = useContent();
  const [form, setForm] = useState({ email: footer?.email ?? "", phone: footer?.phone ?? "", facebook: footer?.facebook ?? "", twitter: footer?.twitter ?? "", linkedin: footer?.linkedin ?? "" });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/footer", { method: "PUT", headers: adminHeaders(), body: JSON.stringify(form) });
      if (!res.ok) throw new Error("Failed");
      toast.success("Footer updated");
      fetchContent();
    } catch { toast.error("Failed to save"); }
    finally { setSaving(false); }
  };

  return (
    <SectionShell title="Footer Settings" description="Update contact and social links shown in the footer.">
      <div className="grid gap-4 max-w-lg">
        <Field label="Email"><Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
        <Field label="Phone"><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
        <Field label="Facebook URL"><Input value={form.facebook} onChange={(e) => setForm({ ...form, facebook: e.target.value })} /></Field>
        <Field label="Twitter/X URL"><Input value={form.twitter} onChange={(e) => setForm({ ...form, twitter: e.target.value })} /></Field>
        <Field label="LinkedIn URL"><Input value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} /></Field>
        <div className="pt-2">
          <Button onClick={save} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}Save Footer
          </Button>
        </div>
      </div>
    </SectionShell>
  );
}

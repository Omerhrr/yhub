"use client";

import { useState } from "react";
import { Loader2, Save, Plus, Trash2, Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useNav } from "@/store/nav";
import { useContent } from "@/store/content";
import { cn } from "@/lib/utils";

type Tab = "hero" | "status" | "workspaces" | "programs" | "events" | "footer";

const TABS: { id: Tab; label: string }[] = [
  { id: "hero", label: "Hero" },
  { id: "status", label: "Status Cards" },
  { id: "workspaces", label: "Workspaces" },
  { id: "programs", label: "Programs" },
  { id: "events", label: "Events" },
  { id: "footer", label: "Footer" },
];

export function AdminDashboard() {
  const { setAuth, navigate } = useNav();
  const [tab, setTab] = useState<Tab>("hero");

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Edit the content shown on the public site. Changes save instantly to
            the database.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            setAuth("admin", false);
            navigate("home");
          }}
        >
          Sign out
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[200px_1fr]">
        {/* Sidebar */}
        <nav className="flex md:flex-col gap-1 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "rounded-md px-3 py-2 text-left text-sm font-medium transition-colors whitespace-nowrap",
                tab === t.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {t.label}
            </button>
          ))}
        </nav>

        {/* Content */}
        <div>
          {tab === "hero" && <HeroEditor />}
          {tab === "status" && <StatusCardsEditor />}
          {tab === "workspaces" && <WorkspacesEditor />}
          {tab === "programs" && <ProgramsEditor />}
          {tab === "events" && <EventsEditor />}
          {tab === "footer" && <FooterEditor />}
        </div>
      </div>
    </div>
  );
}

/* ---------- Hero ---------- */
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

  // Re-sync when home data loads
  useState(() => {
    if (home) {
      setForm({
        heroTitle: home.heroTitle,
        heroSubtitle: home.heroSubtitle,
        heroCtaPrimaryText: home.heroCtaPrimaryText,
        heroCtaPrimaryAnchor: home.heroCtaPrimaryAnchor,
        heroCtaSecondaryText: home.heroCtaSecondaryText,
        heroCtaSecondaryAnchor: home.heroCtaSecondaryAnchor,
        heroVideoUrl: home.heroVideoUrl,
      });
    }
  });

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/home", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Hero content saved");
      await fetchContent();
    } catch {
      toast.error("Failed to save hero content");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <h2 className="text-lg font-semibold">Hero Section</h2>
      <Field label="Title">
        <Input value={form.heroTitle} onChange={(e) => setForm({ ...form, heroTitle: e.target.value })} />
      </Field>
      <Field label="Subtitle">
        <Textarea rows={3} value={form.heroSubtitle} onChange={(e) => setForm({ ...form, heroSubtitle: e.target.value })} />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Primary CTA text">
          <Input value={form.heroCtaPrimaryText} onChange={(e) => setForm({ ...form, heroCtaPrimaryText: e.target.value })} />
        </Field>
        <Field label="Primary CTA anchor (workspaces / programs / events)">
          <Input value={form.heroCtaPrimaryAnchor} onChange={(e) => setForm({ ...form, heroCtaPrimaryAnchor: e.target.value })} />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Secondary CTA text">
          <Input value={form.heroCtaSecondaryText} onChange={(e) => setForm({ ...form, heroCtaSecondaryText: e.target.value })} />
        </Field>
        <Field label="Secondary CTA anchor">
          <Input value={form.heroCtaSecondaryAnchor} onChange={(e) => setForm({ ...form, heroCtaSecondaryAnchor: e.target.value })} />
        </Field>
      </div>
      <Field label="Background video URL">
        <Input value={form.heroVideoUrl} onChange={(e) => setForm({ ...form, heroVideoUrl: e.target.value })} />
      </Field>
      <Button onClick={save} disabled={saving}>
        {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
        Save Hero
      </Button>
    </Card>
  );
}

/* ---------- Status Cards ---------- */
function StatusCardsEditor() {
  const { statusCards, fetchContent } = useContent();
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Status Cards</h2>
        <Button size="sm" onClick={() => setCreating(true)}>
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </div>

      <div className="grid gap-3">
        {statusCards.map((s) => (
          <Card key={s.id} className="p-4 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{s.title}</span>
                <Badge variant="outline" className="capitalize">{s.badgeVariant}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{s.primary} · {s.secondary}</p>
            </div>
            <div className="flex gap-1">
              <Button size="icon" variant="ghost" onClick={() => setEditing(s.id)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <DeleteButton
                endpoint={`/api/admin/status-cards/${s.id}`}
                onDeleted={fetchContent}
              />
            </div>
          </Card>
        ))}
      </div>

      {creating && (
        <StatusCardForm
          onClose={() => setCreating(false)}
          onSaved={() => {
            setCreating(false);
            fetchContent();
          }}
        />
      )}
      {editing && (
        <StatusCardForm
          id={editing}
          initial={statusCards.find((s) => s.id === editing)!}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            fetchContent();
          }}
        />
      )}
    </div>
  );
}

function StatusCardForm({
  id,
  initial,
  onClose,
  onSaved,
}: {
  id?: string;
  initial?: { title: string; icon: string; badgeLabel: string; badgeVariant: string; primary: string; secondary: string; order: number };
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState(
    initial ?? {
      title: "",
      icon: "signal",
      badgeLabel: "Operational",
      badgeVariant: "green",
      primary: "",
      secondary: "",
      order: 0,
    }
  );
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch(
        id ? `/api/admin/status-cards/${id}` : `/api/admin/status-cards`,
        {
          method: id ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );
      if (!res.ok) throw new Error("Failed");
      toast.success(id ? "Status card updated" : "Status card created");
      onSaved();
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalDialog title={id ? "Edit status card" : "New status card"} onClose={onClose}>
      <Field label="Title">
        <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
      </Field>
      <Field label="Icon (signal | zap | thermometer | briefcase-business)">
        <Input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Badge label">
          <Input value={form.badgeLabel} onChange={(e) => setForm({ ...form, badgeLabel: e.target.value })} />
        </Field>
        <Field label="Badge variant">
          <Select value={form.badgeVariant} onValueChange={(v) => setForm({ ...form, badgeVariant: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="green">green</SelectItem>
              <SelectItem value="yellow">yellow</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </div>
      <Field label="Primary text">
        <Input value={form.primary} onChange={(e) => setForm({ ...form, primary: e.target.value })} />
      </Field>
      <Field label="Secondary text">
        <Input value={form.secondary} onChange={(e) => setForm({ ...form, secondary: e.target.value })} />
      </Field>
      <Field label="Order (lower = first)">
        <Input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
      </Field>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={save} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          Save
        </Button>
      </DialogFooter>
    </ModalDialog>
  );
}

/* ---------- Workspaces ---------- */
function WorkspacesEditor() {
  const { workspaces, fetchContent } = useContent();
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Workspaces</h2>
        <Button size="sm" onClick={() => setCreating(true)}>
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </div>

      <div className="grid gap-3">
        {workspaces.map((w) => (
          <Card key={w.id} className="p-4 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{w.name}</span>
                {!w.bookingEnabled && <Badge variant="outline">disabled</Badge>}
              </div>
              <p className="text-sm text-muted-foreground">
                ₦{w.hourlyRate.toLocaleString()}/hr · ₦{w.dailyRate.toLocaleString()}/day · {w.amenities.length} amenities
              </p>
            </div>
            <div className="flex gap-1">
              <Button size="icon" variant="ghost" onClick={() => setEditing(w.id)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <DeleteButton
                endpoint={`/api/admin/workspaces/${w.id}`}
                onDeleted={fetchContent}
              />
            </div>
          </Card>
        ))}
      </div>

      {creating && (
        <WorkspaceForm
          onClose={() => setCreating(false)}
          onSaved={() => {
            setCreating(false);
            fetchContent();
          }}
        />
      )}
      {editing && (
        <WorkspaceForm
          id={editing}
          initial={workspaces.find((w) => w.id === editing)!}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            fetchContent();
          }}
        />
      )}
    </div>
  );
}

type WorkspaceFormInitial = {
  name: string;
  description: string;
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  dailyRate: number;
  imageUrl: string;
  bookingEnabled: boolean;
  amenities: { icon: string; label: string }[];
  order: number;
};

function WorkspaceForm({
  id,
  initial,
  onClose,
  onSaved,
}: {
  id?: string;
  initial?: WorkspaceFormInitial;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<WorkspaceFormInitial>(
    initial ?? {
      name: "",
      description: "",
      rating: 4.5,
      reviewCount: 0,
      hourlyRate: 0,
      dailyRate: 0,
      imageUrl: "",
      bookingEnabled: true,
      amenities: [],
      order: 0,
    }
  );
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch(
        id ? `/api/admin/workspaces/${id}` : `/api/admin/workspaces`,
        {
          method: id ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );
      if (!res.ok) throw new Error("Failed");
      toast.success(id ? "Workspace updated" : "Workspace created");
      onSaved();
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalDialog title={id ? "Edit workspace" : "New workspace"} onClose={onClose} wide>
      <Field label="Name">
        <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      </Field>
      <Field label="Description">
        <Textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      </Field>
      <div className="grid grid-cols-3 gap-4">
        <Field label="Rating">
          <Input type="number" step="0.1" value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} />
        </Field>
        <Field label="Reviews">
          <Input type="number" value={form.reviewCount} onChange={(e) => setForm({ ...form, reviewCount: Number(e.target.value) })} />
        </Field>
        <Field label="Order">
          <Input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Hourly rate (₦)">
          <Input type="number" value={form.hourlyRate} onChange={(e) => setForm({ ...form, hourlyRate: Number(e.target.value) })} />
        </Field>
        <Field label="Daily rate (₦)">
          <Input type="number" value={form.dailyRate} onChange={(e) => setForm({ ...form, dailyRate: Number(e.target.value) })} />
        </Field>
      </div>
      <Field label="Image URL">
        <Input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
      </Field>
      <div className="flex items-center gap-2">
        <Checkbox
          id="ws-booking"
          checked={form.bookingEnabled}
          onCheckedChange={(v) => setForm({ ...form, bookingEnabled: v === true })}
        />
        <label htmlFor="ws-booking" className="text-sm">Booking enabled</label>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>Amenities</Label>
          <Button size="sm" variant="outline" onClick={() => setForm({ ...form, amenities: [...form.amenities, { icon: "armchair", label: "" }] })}>
            <Plus className="h-3 w-3 mr-1" /> Add amenity
          </Button>
        </div>
        <div className="space-y-2">
          {form.amenities.map((a, i) => (
            <div key={i} className="flex gap-2">
              <Input
                placeholder="icon (armchair, desk, sofa, tv, projector, whiteboard)"
                value={a.icon}
                onChange={(e) => {
                  const next = [...form.amenities];
                  next[i] = { ...next[i], icon: e.target.value };
                  setForm({ ...form, amenities: next });
                }}
                className="flex-1"
              />
              <Input
                placeholder="label (e.g. 50 Chair)"
                value={a.label}
                onChange={(e) => {
                  const next = [...form.amenities];
                  next[i] = { ...next[i], label: e.target.value };
                  setForm({ ...form, amenities: next });
                }}
                className="flex-1"
              />
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setForm({ ...form, amenities: form.amenities.filter((_, j) => j !== i) })}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={save} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          Save
        </Button>
      </DialogFooter>
    </ModalDialog>
  );
}

/* ---------- Programs ---------- */
function ProgramsEditor() {
  const { upcomingPrograms, completedPrograms, fetchContent } = useContent();
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Programs</h2>
        <Button size="sm" onClick={() => setCreating(true)}>
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Upcoming ({upcomingPrograms.length})</h3>
          <div className="grid gap-2">
            {upcomingPrograms.map((p) => (
              <Card key={p.id} className="p-3 flex items-center justify-between">
                <div>
                  <span className="font-medium">{p.name}</span>
                  <span className="text-sm text-muted-foreground"> · {p.duration} · ₦{p.price.toLocaleString()}</span>
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => setEditing(p.id)}><Pencil className="h-4 w-4" /></Button>
                  <DeleteButton endpoint={`/api/admin/programs/${p.id}`} onDeleted={fetchContent} />
                </div>
              </Card>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Completed ({completedPrograms.length})</h3>
          <div className="grid gap-2">
            {completedPrograms.map((p) => (
              <Card key={p.id} className="p-3 flex items-center justify-between">
                <div>
                  <span className="font-medium">{p.name}</span>
                  <span className="text-sm text-muted-foreground"> · {p.cohort ?? p.type} · ₦{p.price.toLocaleString()}</span>
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => setEditing(p.id)}><Pencil className="h-4 w-4" /></Button>
                  <DeleteButton endpoint={`/api/admin/programs/${p.id}`} onDeleted={fetchContent} />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {creating && (
        <ProgramForm onClose={() => setCreating(false)} onSaved={() => { setCreating(false); fetchContent(); }} />
      )}
      {editing && (
        <ProgramForm
          id={editing}
          initial={[...upcomingPrograms, ...completedPrograms].find((p) => p.id === editing)!}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); fetchContent(); }}
        />
      )}
    </div>
  );
}

type ProgramFormInitial = {
  name: string;
  description: string;
  category: string;
  duration: string;
  price: number;
  status: "upcoming" | "completed";
  cohort: string;
  type: string;
  enrollable: boolean;
  order: number;
};

function ProgramForm({
  id,
  initial,
  onClose,
  onSaved,
}: {
  id?: string;
  initial?: ProgramFormInitial;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<ProgramFormInitial>(
    initial ?? {
      name: "",
      description: "",
      category: "",
      duration: "",
      price: 0,
      status: "upcoming",
      cohort: "",
      type: "",
      enrollable: true,
      order: 0,
    }
  );
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      const payload = { ...form, cohort: form.cohort || null, type: form.type || null };
      const res = await fetch(
        id ? `/api/admin/programs/${id}` : `/api/admin/programs`,
        {
          method: id ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) throw new Error("Failed");
      toast.success(id ? "Program updated" : "Program created");
      onSaved();
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalDialog title={id ? "Edit program" : "New program"} onClose={onClose} wide>
      <Field label="Name">
        <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      </Field>
      <Field label="Description">
        <Textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Category">
          <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
        </Field>
        <Field label="Duration">
          <Input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Price (₦)">
          <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
        </Field>
        <Field label="Status">
          <Select value={form.status} onValueChange={(v: "upcoming" | "completed") => setForm({ ...form, status: v, enrollable: v === "upcoming" })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="upcoming">upcoming</SelectItem>
              <SelectItem value="completed">completed</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Cohort (optional, for completed)">
          <Input value={form.cohort} onChange={(e) => setForm({ ...form, cohort: e.target.value })} placeholder="e.g. Cohort 1" />
        </Field>
        <Field label="Type (optional, for completed)">
          <Input value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} placeholder="e.g. Workshop" />
        </Field>
      </div>
      <Field label="Order">
        <Input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
      </Field>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={save} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          Save
        </Button>
      </DialogFooter>
    </ModalDialog>
  );
}

/* ---------- Events ---------- */
function EventsEditor() {
  const { homeEvents, pastEvents, fetchContent } = useContent();
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Events</h2>
        <Button size="sm" onClick={() => setCreating(true)}>
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Home events ({homeEvents.length})</h3>
          <div className="grid gap-2">
            {homeEvents.map((e) => (
              <Card key={e.id} className="p-3 flex items-center justify-between">
                <div>
                  <span className="font-medium">{e.title}</span>
                  <span className="text-sm text-muted-foreground"> · {e.date} · {e.status}</span>
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => setEditing(e.id)}><Pencil className="h-4 w-4" /></Button>
                  <DeleteButton endpoint={`/api/admin/events/${e.id}`} onDeleted={fetchContent} />
                </div>
              </Card>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Past events ({pastEvents.length})</h3>
          <div className="grid gap-2">
            {pastEvents.map((e) => (
              <Card key={e.id} className="p-3 flex items-center justify-between">
                <div>
                  <span className="font-medium">{e.title}</span>
                  <span className="text-sm text-muted-foreground"> · {e.date}</span>
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => setEditing(e.id)}><Pencil className="h-4 w-4" /></Button>
                  <DeleteButton endpoint={`/api/admin/events/${e.id}`} onDeleted={fetchContent} />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {creating && (
        <EventForm onClose={() => setCreating(false)} onSaved={() => { setCreating(false); fetchContent(); }} />
      )}
      {editing && (
        <EventForm
          id={editing}
          initial={[...homeEvents, ...pastEvents].find((e) => e.id === editing)!}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); fetchContent(); }}
        />
      )}
    </div>
  );
}

type EventFormInitial = {
  title: string;
  description: string;
  longWriteUp: string;
  category: string;
  mode: "Online" | "Physical";
  isMostRecent: boolean;
  status: "ongoing" | "upcoming" | "past";
  date: string;
  time: string;
  location: string;
  audience: string;
  fee: number;
  instagramUrl: string;
  bookable: boolean;
  list: "home" | "past";
  order: number;
};

function EventForm({
  id,
  initial,
  onClose,
  onSaved,
}: {
  id?: string;
  initial?: EventFormInitial;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<EventFormInitial>(
    initial ?? {
      title: "",
      description: "",
      longWriteUp: "",
      category: "Conference",
      mode: "Physical",
      isMostRecent: false,
      status: "upcoming",
      date: "",
      time: "",
      location: "Yahya Hub",
      audience: "",
      fee: 0,
      instagramUrl: "https://www.instagram.com/yahyahub/",
      bookable: true,
      list: "home",
      order: 0,
    }
  );
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      const payload = { ...form, longWriteUp: form.longWriteUp || null };
      const res = await fetch(
        id ? `/api/admin/events/${id}` : `/api/admin/events`,
        {
          method: id ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) throw new Error("Failed");
      toast.success(id ? "Event updated" : "Event created");
      onSaved();
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalDialog title={id ? "Edit event" : "New event"} onClose={onClose} wide>
      <Field label="Title">
        <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
      </Field>
      <Field label="Description">
        <Textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      </Field>
      <Field label="Long write-up (shown in event details modal — past events only)">
        <Textarea rows={5} value={form.longWriteUp} onChange={(e) => setForm({ ...form, longWriteUp: e.target.value })} />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Category">
          <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
        </Field>
        <Field label="Mode">
          <Select value={form.mode} onValueChange={(v: "Online" | "Physical") => setForm({ ...form, mode: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Physical">Physical</SelectItem>
              <SelectItem value="Online">Online</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Field label="Status">
          <Select value={form.status} onValueChange={(v: "ongoing" | "upcoming" | "past") => setForm({ ...form, status: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="upcoming">upcoming</SelectItem>
              <SelectItem value="ongoing">ongoing</SelectItem>
              <SelectItem value="past">past</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="List">
          <Select value={form.list} onValueChange={(v: "home" | "past") => setForm({ ...form, list: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="home">home (on home page)</SelectItem>
              <SelectItem value="past">past (on /events page)</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Fee (₦)">
          <Input type="number" value={form.fee} onChange={(e) => setForm({ ...form, fee: Number(e.target.value) })} />
        </Field>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Field label="Date">
          <Input value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} placeholder="Nov 21, 2026" />
        </Field>
        <Field label="Time">
          <Input value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} placeholder="10:00 AM - 01:00 PM" />
        </Field>
        <Field label="Location">
          <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
        </Field>
      </div>
      <Field label="Audience">
        <Input value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value })} />
      </Field>
      <Field label="Instagram URL">
        <Input value={form.instagramUrl} onChange={(e) => setForm({ ...form, instagramUrl: e.target.value })} />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Order">
          <Input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
        </Field>
        <div className="flex flex-col gap-2 pt-6">
          <div className="flex items-center gap-2">
            <Checkbox id="ev-most-recent" checked={form.isMostRecent} onCheckedChange={(v) => setForm({ ...form, isMostRecent: v === true })} />
            <label htmlFor="ev-most-recent" className="text-sm">Most recent badge</label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="ev-bookable" checked={form.bookable} onCheckedChange={(v) => setForm({ ...form, bookable: v === true })} />
            <label htmlFor="ev-bookable" className="text-sm">Bookable (button enabled)</label>
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={save} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          Save
        </Button>
      </DialogFooter>
    </ModalDialog>
  );
}

/* ---------- Footer ---------- */
function FooterEditor() {
  const { footer, fetchContent } = useContent();
  const [form, setForm] = useState({
    email: footer?.email ?? "",
    phone: footer?.phone ?? "",
    facebook: footer?.facebook ?? "",
    twitter: footer?.twitter ?? "",
    linkedin: footer?.linkedin ?? "",
  });
  const [saving, setSaving] = useState(false);

  useState(() => {
    if (footer) {
      setForm({
        email: footer.email,
        phone: footer.phone,
        facebook: footer.facebook,
        twitter: footer.twitter,
        linkedin: footer.linkedin,
      });
    }
  });

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/footer", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Footer saved");
      await fetchContent();
    } catch {
      toast.error("Failed to save footer");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <h2 className="text-lg font-semibold">Footer</h2>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Email">
          <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </Field>
        <Field label="Phone">
          <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </Field>
      </div>
      <Field label="Facebook URL">
        <Input value={form.facebook} onChange={(e) => setForm({ ...form, facebook: e.target.value })} />
      </Field>
      <Field label="Twitter URL">
        <Input value={form.twitter} onChange={(e) => setForm({ ...form, twitter: e.target.value })} />
      </Field>
      <Field label="LinkedIn URL">
        <Input value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} />
      </Field>
      <Button onClick={save} disabled={saving}>
        {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
        Save Footer
      </Button>
    </Card>
  );
}

/* ---------- Shared UI helpers ---------- */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function ModalDialog({
  title,
  onClose,
  children,
  wide,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className={cn("max-h-[90vh] overflow-y-auto scrollbar-thin", wide ? "max-w-3xl" : "max-w-lg")}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">{children}</div>
      </DialogContent>
    </Dialog>
  );
}

function DeleteButton({ endpoint, onDeleted }: { endpoint: string; onDeleted: () => void }) {
  const [deleting, setDeleting] = useState(false);
  const handle = async () => {
    if (!confirm("Delete this item?")) return;
    setDeleting(true);
    try {
      const res = await fetch(endpoint, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      toast.success("Deleted");
      onDeleted();
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeleting(false);
    }
  };
  return (
    <Button size="icon" variant="ghost" onClick={handle} disabled={deleting}>
      {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 text-destructive" />}
    </Button>
  );
}

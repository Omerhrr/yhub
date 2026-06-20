"use client";

import { useState } from "react";
import { ChevronLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useNav } from "@/store/nav";
import { LOGO_URL } from "@/data/content";

/* ── Shared layout ── */
function AuthShell({ title, subtitle, children }: {
  title: string; subtitle?: string; children: React.ReactNode;
}) {
  const { navigate } = useNav();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 px-4 py-12">
      <button onClick={() => navigate("home")} className="mb-6" aria-label="Yahya Hub home">
        <img src={LOGO_URL} alt="" width={48} height={48} className="h-12 w-12" />
      </button>
      <Card className="w-full max-w-md p-8">
        <h1 className="text-2xl font-bold">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
        <div className="mt-6">{children}</div>
      </Card>
      <button
        onClick={() => navigate("home")}
        className="mt-6 flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" /> Back to Home
      </button>
    </div>
  );
}

function PasswordInput({ id, value, onChange, placeholder }: {
  id: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input
        id={id}
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pr-10"
      />
      <button
        type="button"
        onClick={() => setShow(s => !s)}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════
   ADMIN LOGIN
══════════════════════════════════════════ */
export function AdminLoginPage() {
  const { navigate, setAuth } = useNav();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);

  const submit = async () => {
    if (!email || !password) {
      toast.error("Login Failed", { description: "Please enter both email and password." });
      return;
    }
    setLoading(true);
    try {
      const res  = await fetch("/api/admin/auth", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error("Login Failed", { description: data.error ?? "Invalid credentials." });
        return;
      }
      sessionStorage.setItem("admin_token", data.token);
      setAuth("admin", true);
      toast.success("Logged in", { description: "Welcome back, Admin." });
      navigate("admin-dashboard");
    } catch {
      toast.error("Login Failed", { description: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Admin Login" subtitle="Sign in to manage Yahya Hub">
      <div className="grid gap-4">
        <div>
          <Label htmlFor="a-email">Email Address</Label>
          <Input
            id="a-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@yahyahub.ng"
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />
        </div>
        <div>
          <Label htmlFor="a-pw">Password</Label>
          <PasswordInput id="a-pw" value={password} onChange={setPassword} placeholder="Your password" />
        </div>
        <Button onClick={submit} disabled={loading} className="w-full">
          {loading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Signing in…</> : "Login"}
        </Button>
      </div>
    </AuthShell>
  );
}

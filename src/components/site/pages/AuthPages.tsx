"use client";

import { useState } from "react";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useNav, type ViewKey } from "@/store/nav";
import { LOGO_URL } from "@/data/content";

/* ---------- shared layout ---------- */
function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const { navigate } = useNav();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 px-4 py-12">
      <button
        onClick={() => navigate("home")}
        className="mb-6 flex items-center gap-2"
        aria-label="Yahya Hub home"
      >
        <img src={LOGO_URL} alt="" width={48} height={48} className="h-12 w-12" />
      </button>
      <Card className="w-full max-w-md p-8">
        <h1 className="text-2xl font-bold">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
        <div className="mt-6">{children}</div>
        {footer && <div className="mt-6 border-t pt-4 text-center text-sm text-muted-foreground">{footer}</div>}
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

function PasswordInput({
  id,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
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
        onClick={() => setShow((s) => !s)}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

function LinkButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className="font-medium text-primary hover:underline">
      {children}
    </button>
  );
}

/* ---------- Admin login ---------- */
export function AdminLoginPage() {
  const { navigate, setAuth } = useNav();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = () => {
    if (!email || !password) {
      toast.error("Login Failed", {
        description: "Please enter both email and password.",
      });
      return;
    }
    // Mock: any email/password works for the clone
    setAuth("admin", true);
    toast.success("Logged in", { description: "Welcome back, Admin." });
    navigate("admin-dashboard");
  };

  return (
    <AuthShell title="Sign in to your account">
      <div className="grid gap-4">
        <div>
          <Label htmlFor="a-email">Email Address</Label>
          <Input
            id="a-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@yahyahub.com"
          />
        </div>
        <div>
          <Label htmlFor="a-pw">Password</Label>
          <PasswordInput id="a-pw" value={password} onChange={setPassword} placeholder="Your password" />
        </div>
        <Button onClick={submit} className="w-full">Login</Button>
      </div>
    </AuthShell>
  );
}

/* ---------- Client login / register ---------- */
export function ClientLoginPage() {
  const { navigate, setAuth } = useNav();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = () => {
    if (!email || !password) {
      toast.error("Login Failed", {
        description: "Please enter both email and password.",
      });
      return;
    }
    setAuth("client", true);
    toast.success("Logged in", { description: "Welcome back." });
    navigate("client-dashboard");
  };

  return (
    <AuthShell
      title="Client Login"
      subtitle="Access your dashboard."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <LinkButton onClick={() => navigate("client-register")}>Sign up</LinkButton>
        </>
      }
    >
      <div className="grid gap-4">
        <div>
          <Label htmlFor="c-email">Email Address</Label>
          <Input
            id="c-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
          />
        </div>
        <div>
          <Label htmlFor="c-pw">Password</Label>
          <PasswordInput id="c-pw" value={password} onChange={setPassword} placeholder="Your password" />
        </div>
        <Button onClick={submit} className="w-full">Login</Button>
      </div>
    </AuthShell>
  );
}

export function ClientRegisterPage() {
  const { navigate, setAuth } = useNav();
  const [form, setForm] = useState({
    clientType: "Individual",
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
    address: "",
    agree: false,
  });

  const set = (k: string, v: string | boolean) =>
    setForm((p) => ({ ...p, [k]: v }));

  const submit = () => {
    if (form.password !== form.confirm) {
      toast.error("Passwords don't match");
      return;
    }
    if (!form.agree) {
      toast.error("Please accept the Terms and Conditions");
      return;
    }
    setAuth("client", true);
    toast.success("Account created", { description: "Welcome to YH Connect." });
    navigate("client-dashboard");
  };

  return (
    <AuthShell
      title="Create a Client Account"
      subtitle="Join to find and manage top talent for your projects."
      footer={
        <>
          Already have an account?{" "}
          <LinkButton onClick={() => navigate("client-login")}>Log in</LinkButton>
        </>
      }
    >
      <div className="grid gap-4">
        <div>
          <Label htmlFor="r-type">Client Type</Label>
          <Select value={form.clientType} onValueChange={(v) => set("clientType", v)}>
            <SelectTrigger id="r-type"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Individual">Individual</SelectItem>
              <SelectItem value="Company">Company</SelectItem>
              <SelectItem value="Government Agency">Government Agency</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="r-name">Full Name</Label>
          <Input id="r-name" value={form.fullName} onChange={(e) => set("fullName", e.target.value)} placeholder="e.g., Bola John Bello" />
        </div>
        <div>
          <Label htmlFor="r-email">Email Address</Label>
          <Input id="r-email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="Your email" />
        </div>
        <div>
          <Label htmlFor="r-phone">Phone Number</Label>
          <Input id="r-phone" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="e.g., 08012345678" />
        </div>
        <div>
          <Label htmlFor="r-pw">Password</Label>
          <PasswordInput id="r-pw" value={form.password} onChange={(v) => set("password", v)} placeholder="Your password" />
        </div>
        <div>
          <Label htmlFor="r-cpw">Confirm Password</Label>
          <PasswordInput id="r-cpw" value={form.confirm} onChange={(v) => set("confirm", v)} placeholder="Your password again" />
        </div>
        <div>
          <Label htmlFor="r-addr">Address</Label>
          <Input id="r-addr" value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="Your address" />
        </div>
        <div className="flex items-start gap-2">
          <Checkbox
            id="r-agree"
            checked={form.agree}
            onCheckedChange={(v) => set("agree", v === true)}
          />
          <label htmlFor="r-agree" className="text-xs text-muted-foreground">
            Agree to Terms and Conditions. By checking this box, you agree to our{" "}
            <button onClick={() => navigate("terms")} className="text-primary hover:underline">
              Terms of Service
            </button>
            .
          </label>
        </div>
        <Button
          onClick={submit}
          className="w-full"
          disabled={!form.fullName || !form.email || !form.password || !form.confirm}
        >
          Create Account
        </Button>
      </div>
    </AuthShell>
  );
}

/* ---------- Talent login / register ---------- */
export function TalentLoginPage() {
  const { navigate, setAuth } = useNav();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = () => {
    if (!email || !password) {
      toast.error("Login Failed", { description: "Please enter both email and password." });
      return;
    }
    setAuth("talent", true);
    toast.success("Logged in", { description: "Welcome back." });
    navigate("talent-dashboard");
  };

  return (
    <AuthShell
      title="Talent Login"
      subtitle="Access your talent dashboard."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <LinkButton onClick={() => navigate("talent-register")}>Sign up</LinkButton>
        </>
      }
    >
      <div className="grid gap-4">
        <div>
          <Label htmlFor="t-email">Email Address</Label>
          <Input id="t-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" />
        </div>
        <div>
          <Label htmlFor="t-pw">Password</Label>
          <PasswordInput id="t-pw" value={password} onChange={setPassword} placeholder="Your password" />
        </div>
        <Button onClick={submit} className="w-full">Login</Button>
      </div>
    </AuthShell>
  );
}

export function TalentRegisterPage() {
  const { navigate, setAuth } = useNav();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    // step 2 placeholders
    profession: "",
    skills: "",
    bio: "",
    hourlyRate: "",
    agree: false,
  });

  const set = (k: string, v: string | boolean) =>
    setForm((p) => ({ ...p, [k]: v }));

  const submit = () => {
    setAuth("talent", true);
    toast.success("Profile created", { description: "Welcome to the talent network." });
    navigate("talent-dashboard");
  };

  const progress = (step / 2) * 100;

  return (
    <AuthShell
      title="Join Our Professional Network"
      subtitle="Create your talent profile to get access to exclusive projects."
      footer={
        <>
          Already have an account?{" "}
          <LinkButton onClick={() => navigate("talent-login")}>Log in</LinkButton>
        </>
      }
    >
      <div className="mb-6">
        <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
          <span>Step {step} of 2</span>
          <span>{step === 1 ? "Account Information" : "Professional Profile"}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {step === 1 && (
        <div className="grid gap-4">
          <div>
            <Label htmlFor="t-r-name">Full Name</Label>
            <Input id="t-r-name" value={form.fullName} onChange={(e) => set("fullName", e.target.value)} placeholder="Your full name" />
          </div>
          <div>
            <Label htmlFor="t-r-phone">Phone Number</Label>
            <Input id="t-r-phone" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="Your phone number" />
          </div>
          <div>
            <Label htmlFor="t-r-email">Email Address</Label>
            <Input id="t-r-email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="Your email address" />
          </div>
          <div>
            <Label htmlFor="t-r-pw">Password</Label>
            <PasswordInput id="t-r-pw" value={form.password} onChange={(v) => set("password", v)} placeholder="Choose password" />
          </div>
          <Button
            onClick={() => setStep(2)}
            className="w-full"
            disabled={!form.fullName || !form.phone || !form.email || !form.password}
          >
            Next
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="grid gap-4">
          <div>
            <Label htmlFor="t-r-prof">Profession</Label>
            <Select value={form.profession} onValueChange={(v) => set("profession", v)}>
              <SelectTrigger id="t-r-prof"><SelectValue placeholder="Select your profession" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Architect">Architect</SelectItem>
                <SelectItem value="Civil Engineer">Civil Engineer</SelectItem>
                <SelectItem value="Structural Engineer">Structural Engineer</SelectItem>
                <SelectItem value="Mechanical Engineer">Mechanical Engineer</SelectItem>
                <SelectItem value="Electrical Engineer">Electrical Engineer</SelectItem>
                <SelectItem value="Quantity Surveyor">Quantity Surveyor</SelectItem>
                <SelectItem value="Artisan">Artisan</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="t-r-skills">Skills (comma-separated)</Label>
            <Input id="t-r-skills" value={form.skills} onChange={(e) => set("skills", e.target.value)} placeholder="e.g., AutoCAD, Revit, Site Supervision" />
          </div>
          <div>
            <Label htmlFor="t-r-bio">Short Bio</Label>
            <Input id="t-r-bio" value={form.bio} onChange={(e) => set("bio", e.target.value)} placeholder="Tell clients about yourself" />
          </div>
          <div>
            <Label htmlFor="t-r-rate">Hourly Rate (₦)</Label>
            <Input id="t-r-rate" type="number" value={form.hourlyRate} onChange={(e) => set("hourlyRate", e.target.value)} placeholder="e.g., 5000" />
          </div>
          <div className="flex items-start gap-2">
            <Checkbox
              id="t-r-agree"
              checked={form.agree}
              onCheckedChange={(v) => set("agree", v === true)}
            />
            <label htmlFor="t-r-agree" className="text-xs text-muted-foreground">
              Agree to Terms and Conditions. By checking this box, you agree to
              our{" "}
              <button onClick={() => navigate("terms")} className="text-primary hover:underline">
                Terms of Service
              </button>
              .
            </label>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="w-full" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button
              className="w-full"
              onClick={submit}
              disabled={!form.profession || !form.agree}
            >
              Create Profile
            </Button>
          </div>
        </div>
      )}
    </AuthShell>
  );
}

/* ---------- Mock dashboards ---------- */
function MockDashboard({
  role,
  logout,
  children,
}: {
  role: "Admin" | "Client" | "Talent";
  logout: () => void;
  children: React.ReactNode;
}) {
  const { navigate } = useNav();
  return (
    <div className="container mx-auto max-w-6xl px-4 py-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{role} Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back. This is a clone preview of the protected dashboard.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            logout();
            navigate("home");
          }}
        >
          Sign out
        </Button>
      </div>
      <div className="mt-8">{children}</div>
    </div>
  );
}

export function AdminDashboard() {
  const { setAuth } = useNav();
  return (
    <MockDashboard role="Admin" logout={() => setAuth("admin", false)}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Workspaces", value: "7" },
          { label: "Programs", value: "7" },
          { label: "Events", value: "9" },
          { label: "YH Connect Users", value: "—" },
        ].map((s) => (
          <Card key={s.label} className="p-6">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="mt-1 text-3xl font-bold">{s.value}</p>
          </Card>
        ))}
      </div>
      <Card className="mt-6 p-6">
        <h2 className="text-lg font-semibold">Recent Bookings</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Booking management would appear here in the full build.
        </p>
      </Card>
    </MockDashboard>
  );
}

export function ClientDashboard() {
  const { setAuth } = useNav();
  return (
    <MockDashboard role="Client" logout={() => setAuth("client", false)}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Active Projects</p>
          <p className="mt-1 text-3xl font-bold">0</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Open Bids</p>
          <p className="mt-1 text-3xl font-bold">0</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Messages</p>
          <p className="mt-1 text-3xl font-bold">0</p>
        </Card>
      </div>
      <Card className="mt-6 p-6">
        <h2 className="text-lg font-semibold">Post a Project</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Start a new project to receive bids from verified professionals.
        </p>
        <Button className="mt-4">+ New Project</Button>
      </Card>
    </MockDashboard>
  );
}

export function TalentDashboard() {
  const { setAuth } = useNav();
  return (
    <MockDashboard role="Talent" logout={() => setAuth("talent", false)}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Available Projects</p>
          <p className="mt-1 text-3xl font-bold">0</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Active Bids</p>
          <p className="mt-1 text-3xl font-bold">0</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Rating</p>
          <p className="mt-1 text-3xl font-bold">—</p>
        </Card>
      </div>
      <Card className="mt-6 p-6">
        <h2 className="text-lg font-semibold">Browse Opportunities</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Projects matching your skills would appear here.
        </p>
      </Card>
    </MockDashboard>
  );
}

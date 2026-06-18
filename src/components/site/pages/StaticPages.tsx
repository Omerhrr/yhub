"use client";

import {
  ChevronLeft,
  ChevronDown,
  Lightbulb,
  Telescope,
  Heart,
  Mail,
  Phone,
  Newspaper,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProgramCard } from "../ProgramCard";
import { StatusBadge } from "../StatusCard";
import { useNav } from "@/store/nav";
import {
  SITE,
  completedPrograms,
  pastEvents,
  yhConnectTestimonials,
  formatNaira,
} from "@/data/content";

/* ---------- About ---------- */
export function AboutPage() {
  const { navigate } = useNav();
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-4xl font-bold text-primary">About Yahya Hub</h1>
      <p className="mt-2 text-lg text-muted-foreground">
        Fostering Innovation, Collaboration, and Growth in the Heart of the
        Community.
      </p>

      <div className="mt-10 space-y-10">
        <section>
          <h2 className="flex items-center gap-3 text-2xl font-semibold">
            <Lightbulb className="h-6 w-6 text-secondary" />
            Our Mission
          </h2>
          <p className="mt-3 text-foreground leading-relaxed">
            Yahya Hub exists to lower the cost of turning ideas into reality.
            We bring together workspaces, skill-building programs, and a
            community of builders under one roof so that a young engineer, a
            solo founder, and a small architecture studio can all find the
            conditions they need to do their best work. Our mission is to be
            the connective tissue between talent, opportunity, and the
            infrastructure that lets both thrive.
          </p>
        </section>

        <section>
          <h2 className="flex items-center gap-3 text-2xl font-semibold">
            <Telescope className="h-6 w-6 text-secondary" />
            Our Vision
          </h2>
          <p className="mt-3 text-foreground leading-relaxed">
            We see a Northern Nigeria where ambition is not gated by access.
            Where a teenager can walk into a space and learn robotics, where a
            freelancer can rent an office of one and ship a product the same
            week, and where built-environment professionals can find clients
            without leaving their city. Yahya Hub is building toward that
            future one program, one event, one workspace at a time.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">What We Offer</h2>
          <ul className="mt-4 list-disc space-y-3 pl-6 text-foreground">
            <li>
              <strong>Flexible Workspaces:</strong> Modern, fully-equipped
              coworking spaces designed to inspire productivity and
              collaboration, from single desks to private offices.
            </li>
            <li>
              <strong>Expert-Led Programs:</strong> Cutting-edge tech bootcamps
              and workshops led by industry experts to help you acquire
              in-demand skills and accelerate your career.
            </li>
            <li>
              <strong>Inspiring Events:</strong> A vibrant calendar of
              networking events, conferences, and meetups that connect you
              with leaders, investors, and peers.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">Get In Touch</h2>
          <div className="mt-4 flex flex-wrap gap-6">
            <a
              href={`mailto:${SITE.email}`}
              className="flex items-center gap-2 text-foreground hover:text-primary"
            >
              <Mail className="h-5 w-5 text-secondary" />
              {SITE.email}
            </a>
            <a
              href={`tel:${SITE.phone}`}
              className="flex items-center gap-2 text-foreground hover:text-primary"
            >
              <Phone className="h-5 w-5 text-secondary" />
              {SITE.phone}
            </a>
          </div>
        </section>

        <section className="text-center">
          <Heart className="mx-auto h-10 w-10 text-destructive" />
          <h2 className="mt-3 text-2xl font-semibold text-primary">
            Join Our Community
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-foreground">
            Whether you&apos;re looking for a place to work, a skill to learn,
            or a network to grow with, you have a home at Yahya Hub. Become a
            part of our story today.
          </p>
          <Button className="mt-6" onClick={() => navigate("home", "workspaces")}>
            Explore Workspaces
          </Button>
        </section>
      </div>
    </div>
  );
}

/* ---------- Programs (Completed) ---------- */
export function ProgramsPage() {
  const { navigate } = useNav();
  return (
    <div className="container mx-auto max-w-6xl px-4 py-16">
      <button
        onClick={() => navigate("home")}
        className="mb-6 flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" /> Back
      </button>
      <h1 className="text-4xl font-bold">Completed Programs</h1>
      <p className="mt-2 text-lg text-muted-foreground">
        A look back at our previously offered programs and cohorts.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {completedPrograms.map((p) => (
          <ProgramCard key={p.id} program={p} />
        ))}
      </div>
    </div>
  );
}

/* ---------- Events (Past) ---------- */
export function EventsPage() {
  const { navigate, openModal } = useNav();
  return (
    <div className="container mx-auto max-w-6xl px-4 py-16">
      <button
        onClick={() => navigate("home")}
        className="mb-6 flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" /> Back to Home
      </button>
      <h1 className="text-4xl font-bold">Past Events</h1>
      <p className="mt-2 max-w-2xl text-lg text-muted-foreground">
        A look back at the gatherings, workshops, and conversations that have
        shaped Yahya Hub.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {pastEvents.map((e) => (
          <Card key={e.id} className="flex flex-col">
            <div className="flex flex-col space-y-3 p-6">
              <div className="flex items-start justify-between gap-2">
                <Badge className="bg-secondary/20 text-secondary-foreground border-secondary/30">
                  {e.category}
                </Badge>
                <div className="flex items-center gap-2">
                  {e.isMostRecent && (
                    <Badge className="bg-primary/10 text-primary border-primary/30">
                      MOST RECENT
                    </Badge>
                  )}
                  <StatusBadge label={e.mode} variant="green" />
                </div>
              </div>
              <button
                onClick={() =>
                  openModal({ kind: "event-details", eventId: e.id })
                }
                className="text-left text-lg font-semibold tracking-tight hover:underline"
              >
                {e.title}
              </button>
              <p className="line-clamp-3 text-sm text-muted-foreground">
                {e.description}
              </p>
              <div className="space-y-1.5 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span>Audience: {e.audience}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>{e.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>{e.location}</span>
                </div>
              </div>
            </div>
            <div className="px-6 pb-4">
              <div className="h-[1px] w-full bg-border" />
            </div>
            <div className="flex items-center justify-between p-6 pt-0 mt-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  openModal({ kind: "event-details", eventId: e.id })
                }
              >
                {e.isMostRecent ? "Read Full Write-up" : "Read More"}
              </Button>
              <a
                href={e.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-primary hover:underline"
              >
                Instagram
              </a>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ---------- Blog (Coming Soon) ---------- */
export function BlogPage() {
  const { navigate } = useNav();
  return (
    <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <Newspaper className="h-16 w-16 text-muted-foreground" />
      <h1 className="mt-6 text-4xl font-bold">Coming Soon!</h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        Our team is working hard to bring you insightful articles and updates.
        Please check back later.
      </p>
      <Button variant="outline" className="mt-6" onClick={() => navigate("home")}>
        Back to Home
      </Button>
    </div>
  );
}

/* ---------- Privacy ---------- */
function LegalContactBlock() {
  return (
    <div className="mt-6 rounded-lg border bg-muted/50 p-4 text-sm">
      <a
        href={`mailto:${SITE.email}`}
        className="flex items-center gap-3 text-muted-foreground hover:text-foreground"
      >
        <Mail className="h-4 w-4 shrink-0 text-secondary" />
        {SITE.email}
      </a>
      <a
        href={`tel:${SITE.phone}`}
        className="mt-2 flex items-center gap-3 text-muted-foreground hover:text-foreground"
      >
        <Phone className="h-4 w-4 shrink-0 text-secondary" />
        {SITE.phone}
      </a>
    </div>
  );
}

export function PrivacyPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-4xl font-bold">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Last updated: June 16, 2026
      </p>

      <div className="mt-10 space-y-8">
        <section>
          <h2 className="text-xl font-semibold">1. Introduction</h2>
          <p className="mt-2 leading-relaxed text-foreground">
            Yahya Hub (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;)
            respects your privacy and is committed to protecting it through
            this Privacy Policy. This Policy describes how we collect, use,
            share, and safeguard your information when you visit our website,
            book a workspace, enroll in a program, or use our YH Connect
            platform.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">2. Information We Collect</h2>
          <p className="mt-2 leading-relaxed text-foreground">
            We collect information you provide directly to us — such as your
            name, email address, phone number, and address when you create an
            account, book a workspace, enroll in a program, or register for an
            event. We also collect usage data (pages visited, time on site,
            device information) through cookies and similar technologies.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">
            3. How We Use Your Information
          </h2>
          <ul className="mt-2 list-disc space-y-2 pl-6">
            <li>To process your bookings, enrollments, and event registrations.</li>
            <li>To communicate with you about your account and our services.</li>
            <li>To improve our website, programs, and user experience.</li>
            <li>To detect, prevent, and address technical issues or fraud.</li>
            <li>To comply with applicable legal obligations.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">
            4. Disclosure of Your Information
          </h2>
          <p className="mt-2 leading-relaxed text-foreground">
            We do not sell your personal information. We may share your
            information with service providers who help us operate the
            platform (such as payment processors like Paystack), with
            professional talent on YH Connect when you initiate a project, and
            with authorities when required by law.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">5. Contact Us</h2>
          <p className="mt-2 leading-relaxed text-foreground">
            If you have questions about this Privacy Policy, please reach out:
          </p>
          <LegalContactBlock />
        </section>
      </div>
    </div>
  );
}

export function TermsPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-4xl font-bold">Terms of Service</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Last updated: June 16, 2026
      </p>

      <div className="mt-10 space-y-8">
        <section>
          <h2 className="text-xl font-semibold">1. Acceptance of Terms</h2>
          <p className="mt-2 leading-relaxed text-foreground">
            By accessing or using Yahya Hub, you agree to be bound by these
            Terms of Service and all applicable laws and regulations. If you
            do not agree with any part of these Terms, please do not use our
            services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">2. Service Provision</h2>
          <p className="mt-2 leading-relaxed text-foreground">
            Yahya Hub provides coworking spaces, skill-building programs,
            events, and a built-environment professional marketplace (YH
            Connect). We reserve the right to modify, suspend, or
            discontinue any part of the service at any time, with or without
            notice.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">3. User Conduct</h2>
          <p className="mt-2 leading-relaxed text-foreground">
            You agree to use Yahya Hub only for lawful purposes. You must not
            misuse the platform, harass other users, post false or misleading
            information, or attempt to disrupt the service. Bookings and
            enrollments must be paid for in full before they are confirmed.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">4. Limitation of Liability</h2>
          <p className="mt-2 leading-relaxed text-foreground">
            Yahya Hub is provided &quot;as is&quot; without warranties of any
            kind. To the fullest extent permitted by law, we are not liable
            for any indirect, incidental, or consequential damages arising
            from your use of the platform or any bookings, programs, or
            projects arranged through it.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">5. Contact Us</h2>
          <p className="mt-2 leading-relaxed text-foreground">
            Questions about these Terms? Reach out:
          </p>
          <LegalContactBlock />
        </section>
      </div>
    </div>
  );
}

/* ---------- Products index ---------- */
export function ProductsPage() {
  const { navigate } = useNav();
  return (
    <div className="container mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-4xl font-bold">Products</h1>
      <p className="mt-2 text-lg text-muted-foreground">
        Discover the innovative products built at Yahya Hub.
      </p>

      <div className="mt-10">
        <Card className="p-8">
          <h2 className="text-2xl font-semibold">YH Connect</h2>
          <p className="mt-2 text-muted-foreground">
            A premier platform for connecting clients with verified
            professionals in the built environment.
          </p>
          <Button
            variant="link"
            className="mt-4 h-auto p-0 text-primary"
            onClick={() => navigate("yh-connect")}
          >
            Learn More →
          </Button>
        </Card>
      </div>
    </div>
  );
}

/* ---------- YH Connect ---------- */
export function YhConnectPage() {
  const { navigate } = useNav();
  return (
    <div>
      {/* Secondary nav */}
      <div className="border-b bg-background">
        <div className="container mx-auto flex h-14 items-center justify-end gap-2 px-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("products")}>
            Home
          </Button>

          <YhDropdown
            label="Login"
            items={[
              { label: "As a Client", onClick: () => navigate("client-login") },
              { label: "As a Talent", onClick: () => navigate("talent-login") },
            ]}
          />
          <YhDropdown
            label="Sign Up"
            items={[
              { label: "As a Client", onClick: () => navigate("client-register") },
              { label: "As a Talent", onClick: () => navigate("talent-register") },
            ]}
          />
        </div>
      </div>

      {/* Hero */}
      <section className="bg-primary py-20 text-white">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Build with Confidence.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90">
            YH Connect is the premier platform for connecting clients with
            verified professionals in the built environment. Find the right
            talent, manage your project, and achieve outstanding results, all
            in one place.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate("client-register")}
            >
              Post a Project
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-primary"
              onClick={() => navigate("talent-register")}
            >
              Join as Talent
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold">How It Works</h2>
            <p className="mt-2 text-muted-foreground">
              A simple, transparent process for everyone.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                title: "1. Find or Post",
                desc: "Clients can post project details for bids or browse our directory of verified professionals. Talents can find opportunities that match their skills.",
              },
              {
                title: "2. Connect & Collaborate",
                desc: "Use our secure platform to communicate, agree on terms, and manage your project from kickoff to completion.",
              },
              {
                title: "3. Get It Done",
                desc: "Complete your project with confidence. Secure payments and a mutual rating system ensure accountability and quality.",
              },
            ].map((s) => (
              <Card key={s.title} className="p-6">
                <h3 className="text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose */}
      <section className="bg-muted py-16">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold">Why Choose YH Connect?</h2>
            <p className="mt-2 text-muted-foreground">
              Everything you need for a successful project.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Verified Professionals",
                desc: "Every talent on our platform is carefully vetted for skill, experience, and professionalism, giving you peace of mind.",
              },
              {
                title: "Secure Payments",
                desc: "Our integrated payment system with escrow options ensures that funds are only released when milestones are met.",
              },
              {
                title: "Flexible Project Management",
                desc: "Choose to manage your project directly or hand over the reins to our experienced in-house project managers.",
              },
              {
                title: "Direct Communication",
                desc: "Use our built-in messaging to communicate seamlessly with your hired talent from start to finish.",
              },
            ].map((f) => (
              <Card key={f.title} className="p-6">
                <h3 className="text-base font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* For Clients / For Talents */}
      <section className="py-16">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <Card className="p-8">
              <h3 className="text-2xl font-semibold">For Clients</h3>
              <p className="mt-3 text-muted-foreground">
                Tired of unreliable contractors and project delays? Get access
                to a curated network of professionals. Post your project,
                receive competitive bids, and hire with confidence.
              </p>
              <ul className="mt-4 space-y-2">
                {[
                  "Access to vetted architects, engineers, & artisans.",
                  "Option for full project management by Yahya Hub.",
                  "Transparent process with secure escrow payments.",
                ].map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <Button className="mt-6" onClick={() => navigate("client-register")}>
                Get Started & Post Your Project
              </Button>
            </Card>

            <Card className="p-8">
              <h3 className="text-2xl font-semibold">For Talents</h3>
              <p className="mt-3 text-muted-foreground">
                Stop searching for your next gig. Join a community where your
                skills are valued. Get verified, access exclusive projects,
                and build your professional reputation.
              </p>
              <ul className="mt-4 space-y-2">
                {[
                  "Steady stream of project opportunities.",
                  "Build your portfolio and professional brand.",
                  "Fair compensation with secure and timely payments.",
                ].map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <Button className="mt-6" onClick={() => navigate("talent-register")}>
                Apply to Join Our Network
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-muted py-16">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold">Trusted by the Best</h2>
            <p className="mt-2 text-muted-foreground">
              See what our users are saying about YH Connect.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {yhConnectTestimonials.map((t) => (
              <Card key={t.id} className="p-6">
                <div className="flex gap-1 text-yellow-500">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <blockquote className="mt-3 text-sm leading-relaxed text-foreground">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <div className="mt-4 flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${t.avatarColor} text-sm font-semibold text-white`}
                  >
                    {t.name
                      .split(" ")
                      .map((w) => w[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// small dropdown helper for the secondary nav

function YhDropdown({
  label,
  items,
}: {
  label: string;
  items: { label: string; onClick: () => void }[];
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-muted">
          {label}
          <ChevronDown className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {items.map((it) => (
          <DropdownMenuItem key={it.label} onClick={it.onClick}>
            {it.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

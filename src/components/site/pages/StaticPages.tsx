"use client";

import { Mail, Phone, Newspaper, ExternalLink, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNav } from "@/store/nav";
import { SITE } from "@/data/content";
import { cn } from "@/lib/utils";

/* ══════════════════════════════════════════
   BLOG (Coming Soon)
══════════════════════════════════════════ */
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

/* ══════════════════════════════════════════
   LEGAL HELPERS
══════════════════════════════════════════ */
function LegalContactBlock() {
  return (
    <div className="mt-6 rounded-lg border bg-muted/50 p-4 text-sm">
      <a href={`mailto:${SITE.email}`} className="flex items-center gap-3 text-muted-foreground hover:text-foreground">
        <Mail className="h-4 w-4 shrink-0 text-secondary" />
        {SITE.email}
      </a>
      <a href={`tel:${SITE.phone}`} className="mt-2 flex items-center gap-3 text-muted-foreground hover:text-foreground">
        <Phone className="h-4 w-4 shrink-0 text-secondary" />
        {SITE.phone}
      </a>
    </div>
  );
}

/* ══════════════════════════════════════════
   PRIVACY POLICY
══════════════════════════════════════════ */
export function PrivacyPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-4xl font-bold">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: June 16, 2026</p>
      <div className="mt-10 space-y-8">
        <section>
          <h2 className="text-xl font-semibold">1. Introduction</h2>
          <p className="mt-2 leading-relaxed text-foreground">
            Yahya Hub (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) respects your privacy and is committed to protecting it through this Privacy Policy. This Policy describes how we collect, use, share, and safeguard your information when you visit our website, book a workspace, enroll in a program, or use our services.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold">2. Information We Collect</h2>
          <p className="mt-2 leading-relaxed text-foreground">
            We collect information you provide directly to us — such as your name, email address, phone number, and address when you book a workspace, enroll in a program, or register for an event. We also collect usage data through cookies and similar technologies.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold">3. How We Use Your Information</h2>
          <ul className="mt-2 list-disc space-y-2 pl-6">
            <li>To process your bookings, enrollments, and event registrations.</li>
            <li>To communicate with you about your account and our services.</li>
            <li>To improve our website, programs, and user experience.</li>
            <li>To detect, prevent, and address technical issues or fraud.</li>
            <li>To comply with applicable legal obligations.</li>
          </ul>
        </section>
        <section>
          <h2 className="text-xl font-semibold">4. Disclosure of Your Information</h2>
          <p className="mt-2 leading-relaxed text-foreground">
            We do not sell your personal information. We may share your information with service providers who help us operate the platform (such as payment processors like Paystack) and with authorities when required by law.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold">5. Contact Us</h2>
          <p className="mt-2 leading-relaxed text-foreground">If you have questions about this Privacy Policy, please reach out:</p>
          <LegalContactBlock />
        </section>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   TERMS OF SERVICE
══════════════════════════════════════════ */
export function TermsPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-4xl font-bold">Terms of Service</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: June 16, 2026</p>
      <div className="mt-10 space-y-8">
        <section>
          <h2 className="text-xl font-semibold">1. Acceptance of Terms</h2>
          <p className="mt-2 leading-relaxed text-foreground">
            By accessing or using Yahya Hub, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any part of these Terms, please do not use our services.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold">2. Service Provision</h2>
          <p className="mt-2 leading-relaxed text-foreground">
            Yahya Hub provides coworking spaces, skill-building programs, events, and a built-environment professional marketplace (YH Connect). We reserve the right to modify, suspend, or discontinue any part of the service at any time.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold">3. User Conduct</h2>
          <p className="mt-2 leading-relaxed text-foreground">
            You agree to use Yahya Hub only for lawful purposes. You must not misuse the platform, harass other users, post false or misleading information, or attempt to disrupt the service.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold">4. Limitation of Liability</h2>
          <p className="mt-2 leading-relaxed text-foreground">
            Yahya Hub is provided &quot;as is&quot; without warranties of any kind. To the fullest extent permitted by law, we are not liable for any indirect, incidental, or consequential damages.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold">5. Contact Us</h2>
          <p className="mt-2 leading-relaxed text-foreground">Questions about these Terms? Reach out:</p>
          <LegalContactBlock />
        </section>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   YH CONNECT — COMING SOON
══════════════════════════════════════════ */
export function YhConnectPage() {
  const { navigate } = useNav();
  return (
    <div className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden bg-primary px-4 py-24 text-center text-white">
      {/* Background circles */}
      <div className="pointer-events-none absolute -top-20 -right-20 h-96 w-96 rounded-full bg-white/5" />
      <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-white/5" />

      <div className="relative z-10 max-w-2xl">
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
          <Rocket className="h-10 w-10 text-secondary" />
        </div>

        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white/90">
          <span className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
          Launching Soon
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl">
          YH Connect
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-white/80 leading-relaxed">
          The premier platform for connecting clients with verified professionals
          in the built environment — architects, engineers, and artisans, all in one place.
        </p>
        <p className="mt-4 text-sm text-white/60">
          We're putting the finishing touches on something exciting. YH Connect
          is launching as its own dedicated platform very soon.
        </p>

        {/* Features teaser */}
        <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            { label: "Verified Professionals", desc: "Vetted architects, engineers & artisans" },
            { label: "Secure Payments", desc: "Escrow-backed project payments" },
            { label: "Project Management", desc: "Full lifecycle collaboration tools" },
          ].map((f) => (
            <div key={f.label} className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <p className="text-sm font-semibold text-white">{f.label}</p>
              <p className="mt-1 text-xs text-white/60">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button
            size="lg"
            className="bg-white text-primary hover:bg-white/90 font-semibold rounded-full px-8"
            onClick={() => navigate("home")}
          >
            Back to Yahya Hub
          </Button>
          <a
            href={`mailto:${SITE.email}?subject=YH Connect Early Access`}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border border-white/40 px-8 py-2.5",
              "text-sm font-semibold text-white hover:bg-white/10 transition-colors"
            )}
          >
            Get Notified
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}

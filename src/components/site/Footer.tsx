"use client";

import React from "react";
import { Mail, Phone, Facebook, Twitter, Linkedin } from "lucide-react";
import { useNav, type ViewKey } from "@/store/nav";
import { useContent } from "@/store/content";
import { LOGO_URL, SITE } from "@/data/content";

function FooterLink({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className="block text-sm text-white/60 transition-colors duration-150 hover:text-white text-left">
      {children}
    </button>
  );
}

export function Footer() {
  const { navigate } = useNav();
  const { footer } = useContent();

  const email = footer?.email ?? SITE.email;
  const phone = footer?.phone ?? SITE.phone;
  const facebook = footer?.facebook ?? SITE.social.facebook;
  const twitter = footer?.twitter ?? SITE.social.twitter;
  const linkedin = footer?.linkedin ?? SITE.social.linkedin;

  const go = (v: ViewKey) => navigate(v);

  return (
    <footer className="mt-auto bg-primary text-white">
      <div className="container mx-auto px-4 pt-12 pb-6">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <button onClick={() => go("home")} className="flex items-center gap-2.5" aria-label="Home">
              <img src={LOGO_URL} alt="Yahya Hub Logo" className="h-9 w-9" />
              <span className="text-lg font-bold tracking-tight">Yahya Hub</span>
            </button>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
              Kaduna&apos;s creative &amp; tech hub &mdash; coworking spaces, skill-building courses, and inspiring events all under one roof.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <a href={facebook} target="_blank" rel="noreferrer" className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-white/60 transition-colors hover:border-white/50 hover:text-white" aria-label="Facebook">
                <Facebook className="h-4 w-4" />
              </a>
              <a href={twitter} target="_blank" rel="noreferrer" className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-white/60 transition-colors hover:border-white/50 hover:text-white" aria-label="Twitter">
                <Twitter className="h-4 w-4" />
              </a>
              <a href={linkedin} target="_blank" rel="noreferrer" className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-white/60 transition-colors hover:border-white/50 hover:text-white" aria-label="LinkedIn">
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white/40">Explore</h4>
            <ul className="mt-4 space-y-2.5">
              <li><FooterLink onClick={() => go("workspaces")}>Workspaces</FooterLink></li>
              <li><FooterLink onClick={() => go("courses")}>Courses</FooterLink></li>
              <li><FooterLink onClick={() => go("events")}>Events</FooterLink></li>
              <li><FooterLink onClick={() => go("blog")}>Blog</FooterLink></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white/40">Company</h4>
            <ul className="mt-4 space-y-2.5">
              <li><FooterLink onClick={() => go("about")}>About Us</FooterLink></li>
              <li><FooterLink onClick={() => go("yh-connect")}>YH Connect</FooterLink></li>
              <li><FooterLink onClick={() => go("privacy")}>Privacy</FooterLink></li>
              <li><FooterLink onClick={() => go("terms")}>Terms</FooterLink></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white/40">Contact</h4>
            <ul className="mt-4 space-y-3">
              <li>
                <a href={`mailto:${email}`} className="flex items-start gap-2.5 text-sm text-white/60 transition-colors hover:text-white">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                  {email}
                </a>
              </li>
              <li>
                <a href={`tel:${phone}`} className="flex items-center gap-2.5 text-sm text-white/60 transition-colors hover:text-white">
                  <Phone className="h-4 w-4 shrink-0 text-secondary" />
                  {phone}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-xs text-white/40">&copy; 2026 Yahya Hub. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <button onClick={() => go("track-ticket")} className="text-xs text-white/20 hover:text-white/40 transition-colors" aria-label="Track ticket">
              &middot;
     
            </button>
            <button onClick={() => go("admin-login")} className="text-xs text-white/20 hover:text-white/40 transition-colors" aria-label="Admin">
              &middot;
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

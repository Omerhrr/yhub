"use client";

import { Mail, Phone } from "lucide-react";
import { useNav, type ViewKey } from "@/store/nav";
import { SITE } from "@/data/content";

export function Footer() {
  const { navigate } = useNav();

  const go = (v: ViewKey, anchor?: string) => navigate(v, anchor);

  return (
    <footer className="mt-auto border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Contact */}
          <div>
            <h3 className="font-bold">Contact</h3>
            <div className="mt-4 space-y-3 rounded-lg border bg-muted/50 p-4 text-sm">
              <a
                href={`mailto:${SITE.email}`}
                className="flex items-center gap-3 text-muted-foreground transition-colors hover:text-foreground"
              >
                <Mail className="h-4 w-4 shrink-0 text-secondary" />
                {SITE.email}
              </a>
              <a
                href={`tel:${SITE.phone}`}
                className="flex items-center gap-3 text-muted-foreground transition-colors hover:text-foreground"
              >
                <Phone className="h-4 w-4 shrink-0 text-secondary" />
                {SITE.phone}
              </a>
            </div>
          </div>

          {/* Community */}
          <div>
            <h3 className="font-bold">Community</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <button
                  onClick={() => go("home", "programs")}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Programs
                </button>
              </li>
              <li>
                <button
                  onClick={() => go("home", "events")}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Events
                </button>
              </li>
              <li>
                <button
                  onClick={() => go("blog")}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Blog
                </button>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-bold">Social</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a
                  href={SITE.social.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href={SITE.social.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href={SITE.social.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <button
                  onClick={() => go("privacy")}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Privacy
                </button>
              </li>
              <li>
                <button
                  onClick={() => go("terms")}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Terms
                </button>
              </li>
              <li>
                <button
                  onClick={() => go("admin-login")}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                  aria-label="Admin login"
                >
                  .
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-muted-foreground">
          <p>© 2026 Yahya Hub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

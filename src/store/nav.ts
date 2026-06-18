"use client";

import { create } from "zustand";

export type ViewKey =
  | "home"
  | "about"
  | "programs"
  | "events"
  | "blog"
  | "privacy"
  | "terms"
  | "products"
  | "yh-connect"
  | "admin-login"
  | "admin-dashboard"
  | "client-login"
  | "client-register"
  | "client-dashboard"
  | "talent-login"
  | "talent-register"
  | "talent-dashboard"
  | "not-found";

type ModalState =
  | { kind: "none" }
  | { kind: "booking"; workspaceId: string }
  | { kind: "view-space"; workspaceId: string }
  | { kind: "amenities"; workspaceId: string }
  | { kind: "enroll"; programId: string }
  | { kind: "event-book"; eventId: string }
  | { kind: "event-details"; eventId: string };

type NavState = {
  view: ViewKey;
  // hash anchor on home page (#workspaces / #programs / #events)
  homeAnchor?: string;
  // simple auth (mock — no backend)
  adminAuthed: boolean;
  clientAuthed: boolean;
  talentAuthed: boolean;
  modal: ModalState;

  navigate: (view: ViewKey, anchor?: string) => void;
  openModal: (m: ModalState) => void;
  closeModal: () => void;
  setAuth: (role: "admin" | "client" | "talent", value: boolean) => void;
};

export const useNav = create<NavState>((set) => ({
  view: "home",
  homeAnchor: undefined,
  adminAuthed: false,
  clientAuthed: false,
  talentAuthed: false,
  modal: { kind: "none" },

  navigate: (view, anchor) => {
    set({ view, homeAnchor: anchor });
    // scroll to top on view change (or to anchor after render)
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  },
  openModal: (m) => set({ modal: m }),
  closeModal: () => set({ modal: { kind: "none" } }),
  setAuth: (role, value) =>
    set(
      role === "admin"
        ? { adminAuthed: value }
        : role === "client"
        ? { clientAuthed: value }
        : { talentAuthed: value }
    ),
}));

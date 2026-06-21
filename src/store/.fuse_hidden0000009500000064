"use client";

import { create } from "zustand";

export type ViewKey =
  | "home"
  | "about"
  | "workspaces"
  | "workspace-detail"
  | "courses"
  | "course-detail"
  | "events"
  | "event-detail"
  | "programs"        // legacy alias → redirects to courses
  | "blog"
  | "privacy"
  | "terms"
  | "yh-connect"
  | "admin-login"
  | "admin-dashboard"
  | "track-ticket"
  | "not-found";

type ModalState =
  | { kind: "none" }
  | { kind: "booking"; workspaceId: string }
  | { kind: "check-availability"; workspaceId: string }
  | { kind: "view-space"; workspaceId: string }
  | { kind: "amenities"; workspaceId: string }
  | { kind: "enroll"; programId: string }
  | { kind: "event-book"; eventId: string }
  | { kind: "event-details"; eventId: string };

type NavState = {
  view: ViewKey;
  homeAnchor?: string;
  selectedId?: string;
  adminAuthed: boolean;
  modal: ModalState;

  navigate: (view: ViewKey, anchor?: string) => void;
  navigateToDetail: (view: ViewKey, id: string) => void;
  openModal: (m: ModalState) => void;
  closeModal: () => void;
  setAuth: (role: "admin", value: boolean) => void;
};

export const useNav = create<NavState>((set) => ({
  view: "home",
  homeAnchor: undefined,
  selectedId: undefined,
  adminAuthed: false,
  modal: { kind: "none" },

  navigate: (view, anchor) => {
    const resolved: ViewKey = view === "programs" ? "courses" : view;
    set({ view: resolved, homeAnchor: anchor, selectedId: undefined });
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  },
  navigateToDetail: (view, id) => {
    set({ view, selectedId: id, homeAnchor: undefined });
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  },
  openModal: (m) => set({ modal: m }),
  closeModal: () => set({ modal: { kind: "none" } }),
  setAuth: (_role, value) => set({ adminAuthed: value }),
}));

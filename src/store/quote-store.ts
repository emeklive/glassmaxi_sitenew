"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { emptyCustomer, type QuoteCustomer, type QuotePiece } from "@/lib/quote";

interface QuoteState {
  pieces: QuotePiece[];
  customer: QuoteCustomer;
  add: (p: Omit<QuotePiece, "id">) => string;
  update: (id: string, p: Omit<QuotePiece, "id">) => void;
  remove: (id: string) => void;
  duplicate: (id: string) => void;
  clear: () => void;
  setCustomer: (c: Partial<QuoteCustomer>) => void;
}

const uid = () => Math.random().toString(36).slice(2, 9);

/** Lista de peças do orçamento. Fica só no navegador do visitante (localStorage). */
export const useQuote = create<QuoteState>()(
  persist(
    (set) => ({
      pieces: [],
      customer: emptyCustomer,
      add: (p) => {
        const id = uid();
        set((s) => ({ pieces: [...s.pieces, { ...p, id }] }));
        return id;
      },
      update: (id, p) => set((s) => ({ pieces: s.pieces.map((x) => (x.id === id ? { ...p, id } : x)) })),
      remove: (id) => set((s) => ({ pieces: s.pieces.filter((x) => x.id !== id) })),
      duplicate: (id) =>
        set((s) => {
          const i = s.pieces.findIndex((x) => x.id === id);
          if (i < 0) return s;
          const copy = { ...s.pieces[i], id: uid() };
          return { pieces: [...s.pieces.slice(0, i + 1), copy, ...s.pieces.slice(i + 1)] };
        }),
      clear: () => set({ pieces: [] }),
      setCustomer: (c) => set((s) => ({ customer: { ...s.customer, ...c } })),
    }),
    { name: "glassmaxi-orcamento", version: 1 },
  ),
);

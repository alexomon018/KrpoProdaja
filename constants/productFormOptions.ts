/**
 * Product Form Options
 * Constants for form dropdowns and selections
 */

import type { SizeType } from "@/lib/types";

export const AVAILABLE_SIZES: SizeType[] = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

export const CONDITION_OPTIONS = [
  { id: "new", name: "Novo sa etiketom" },
  { id: "very-good", name: "Vrlo dobro" },
  { id: "good", name: "Dobro" },
  { id: "satisfactory", name: "Zadovoljavajuće" },
] as const;

export const COLOR_OPTIONS = [
  { id: "crna", name: "Crna" },
  { id: "siva", name: "Siva" },
  { id: "bela", name: "Bela" },
  { id: "braon", name: "Braon" },
  { id: "bež", name: "Bež" },
  { id: "krem", name: "Krem" },
  { id: "žuta", name: "Žuta" },
  { id: "crvena", name: "Crvena" },
  { id: "narandžasta", name: "Narandžasta" },
  { id: "roze", name: "Roze" },
  { id: "ljubičasta", name: "Ljubičasta" },
  { id: "plava", name: "Plava" },
  { id: "tirkizna", name: "Tirkizna" },
  { id: "zelena", name: "Zelena" },
  { id: "maslinasta", name: "Maslinasta" },
  { id: "bordo", name: "Bordo" },
  { id: "zlatna", name: "Zlatna" },
  { id: "srebrna", name: "Srebrna" },
  { id: "šarena", name: "Šarena" },
] as const;

export const AGE_OPTIONS = [
  { id: "moderno", name: "Moderno" },
  { id: "00s", name: "00-te" },
  { id: "90s", name: "90-te" },
  { id: "80s", name: "80-te" },
  { id: "70s", name: "70-te" },
  { id: "60s", name: "60-te" },
  { id: "50s", name: "50-te" },
  { id: "antikno", name: "Antikno" },
] as const;

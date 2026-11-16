import type { Family, FamilyId } from "../types";
import { temperados } from "./temperados";
import { laminados } from "./laminados";
import { insulados } from "./insulados";
import { multilaminados } from "./multilaminados";
import { espelhos } from "./espelhos";
import { jumbos } from "./jumbos";
import { modelados } from "./modelados";

export const families: Family[] = [temperados, laminados, insulados, multilaminados, espelhos, jumbos, modelados];
export const familyById = Object.fromEntries(families.map((f) => [f.id, f])) as Record<FamilyId, Family>;
export const familyIds = families.map((f) => f.id);
export const isFamilyId = (v: string | null | undefined): v is FamilyId => !!v && v in familyById;

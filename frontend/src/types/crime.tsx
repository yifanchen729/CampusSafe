export const categories = [
  "sexualCrime",
  "violence",
  "theft",
  "property",
  "alcoholDrugs",
  "publicOrder",
  "other"
] as const;

export type Crime = {
  id: string;
  dateReported: string;
  crimeType: string;
  location: string;
  occurredStart: string;
  occurredEnd: string | null;
  disposition: string;
  category: string;
  latitude: number | null;
  longitude: number | null;
};

export type Category =
  | "sexualCrime"
  | "violence"
  | "theft"
  | "property"
  | "alcoholDrugs"
  | "publicOrder"
  | "other";

export type Filters = Record<Category, boolean>;
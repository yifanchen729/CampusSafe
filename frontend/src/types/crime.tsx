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
  disposition: string;
  category: string;
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
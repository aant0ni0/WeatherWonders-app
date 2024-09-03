import { z } from "zod";

export const geoNamesItem = z.object({
  geonameId: z.number(),
  name: z.string(),
  countryName: z.string(),
  countryCode: z.string(),
});

export const dataSchema = z.object({
  geonames: z.array(geoNamesItem),
});

export type GeoNamesData = z.infer<typeof dataSchema>;
export type GeoNamesItem = z.infer<typeof geoNamesItem>;

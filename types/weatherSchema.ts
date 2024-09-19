import { z } from "zod";

const MainSchema = z.object({
  temp: z.number(),
  feels_like: z.number(),
  temp_min: z.number(),
  temp_max: z.number(),
  pressure: z.number(),
  humidity: z.number(),
});

const WindSchema = z.object({
  speed: z.number(),
  deg: z.number(),
  gust: z.number().optional(),
});

const WeatherDescriptionSchema = z.object({
  id: z.number(),
  main: z.string(),
  description: z.string(),
  icon: z.string(),
});

const SysSchema = z.object({
  country: z.string(),
  sunrise: z.number(),
  sunset: z.number(),
});
const coordSchema = z.object({
  lon: z.number(),
  lat: z.number(),
});
export const WeatherSchema = z.object({
  visibility: z.number(),
  wind: WindSchema,
  main: MainSchema,
  weather: z.array(WeatherDescriptionSchema),
  sys: SysSchema,
  timezone: z.number(),
});

const CloudsSchema = z.object({
  all: z.number(),
});

const RainSchema = z.object({
  "3h": z.number().optional(),
});

const ForecastSysSchema = z.object({
  pod: z.string(),
});

const ForecastItemSchema = z.object({
  dt: z.number(),
  main: MainSchema,
  weather: z.array(WeatherDescriptionSchema),
  clouds: CloudsSchema,
  wind: WindSchema,
  visibility: z.number(),
  pop: z.number(),
  rain: RainSchema.optional(),
  sys: ForecastSysSchema,
  dt_txt: z.string(),
});

export const ForecastDataSchema = z.object({
  cod: z.string(),
  message: z.number(),
  cnt: z.number(),
  list: z.array(ForecastItemSchema),
  city: z.object({
    id: z.number(),
    name: z.string(),
    coord: z.object({
      lat: z.number(),
      lon: z.number(),
    }),
    country: z.string(),
    population: z.number().optional(),
    timezone: z.number(),
    sunrise: z.number(),
    sunset: z.number(),
  }),
});

export type WeatherData = z.infer<typeof WeatherSchema>;
export type ForecastData = z.infer<typeof ForecastDataSchema>;
export type ForecastItem = z.infer<typeof ForecastItemSchema>;

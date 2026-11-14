import { z } from "zod";

export const muralSchema = z.object({
  name: z.string().trim().min(1, "Add an artist or title.").max(120, "The title is too long."),
  description: z
    .string()
    .trim()
    .min(1, "Add a location or note.")
    .max(2000, "The description is too long."),
  imageSrc: z
    .string()
    .trim()
    .url("Upload a valid mural image.")
    .max(2048, "The image URL is too long.")
    .refine(
      (value) => value.startsWith("https://res.cloudinary.com/www-qepweb-es/image/upload/"),
      "Upload the image using the image uploader.",
    ),
  visitUrl: z.union([
    z.literal(""),
    z
      .string()
      .trim()
      .url("Enter a valid website or Instagram URL.")
      .max(2048, "The website or Instagram URL is too long.")
      .refine((value) => value.startsWith("https://"), "The link must use HTTPS."),
  ]).optional(),
});

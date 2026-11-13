import { z } from "zod";

export const todoFormSchema = z.object({
  title: z
    .string()
    .min(5, {
      message: "Title must be at least 5 characters.",
    })
    .max(30, {
      message: "Title must not be longer than 30 characters.",
    }),
  body: z
    .string()
    .max(80, {
      message: "Short description must not be longer than 80 characters.",
    })
    .optional(),
  completed: z.boolean(),
});

export type TodoFormInputValues = z.input<typeof todoFormSchema>;
export type TodoFormValues = z.output<typeof todoFormSchema>;


export const contactFormSchema = z.object({
  postername: z
    .string()
    .min(3, {
      message: "Title must be at least 5 characters.",
    })
    .max(30, {
      message: "Title must not be longer than 30 characters.",
    }),
 
 email: z
    .string()
    .max(30, {
      message: "Title must not be longer than 30 characters.",
    }),
  topic: z
    .string()
    .min(3, {
      message: "Title must be at least 5 characters.",
    })
    .max(30, {
      message: "Title must not be longer than 30 characters.",
    }),
  message: z
    .string()
    .max(80, {
      message: "Short description must not be longer than 80 characters.",
    })
 
 
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
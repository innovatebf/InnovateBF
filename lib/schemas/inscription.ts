import { z } from "zod";

export const inscriptionSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "Le nom doit contenir au moins 2 caracteres")
      .max(100, "Le nom ne peut pas depasser 100 caracteres"),
    email: z.string().email("Adresse email invalide"),
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caracteres"),
    confirmPassword: z.string(),
    role: z.enum(["UTILISATEUR", "PARRAIN", "INNOVATEUR"], {
      message: "Veuillez selectionner un type de compte",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export type InscriptionFormData = z.infer<typeof inscriptionSchema>;

export const connexionSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  password: z.string().min(1, "Le mot de passe est requis"),
});

export type ConnexionFormData = z.infer<typeof connexionSchema>;

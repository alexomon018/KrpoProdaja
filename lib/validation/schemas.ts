/**
 * Yup validation schemas with Serbian error messages
 * For use with react-hook-form via @hookform/resolvers
 */

import * as yup from "yup";

// Configure Yup default messages in Serbian
yup.setLocale({
  mixed: {
    required: "Ovo polje je obavezno",
    notType: "Neispravan format",
  },
  string: {
    email: "Unesite ispravnu email adresu",
    min: ({ min }) => `Mora imati najmanje ${min} karaktera`,
    max: ({ max }) => `Može imati maksimalno ${max} karaktera`,
  },
});

/**
 * Email validation schema
 */
export const emailSchema = yup
  .string()
  .required("Email adresa je obavezna")
  .email("Unesite ispravnu email adresu")
  .matches(
    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    "Email adresa mora biti u formatu: ime@domen.com"
  );

/**
 * Password validation schema
 * Requires: min 8 chars, 1 uppercase, 1 number
 */
export const passwordSchema = yup
  .string()
  .required("Lozinka je obavezna")
  .min(8, "Lozinka mora imati najmanje 8 karaktera")
  .matches(
    /[A-Z]/,
    "Lozinka mora sadržati najmanje jedno veliko slovo"
  )
  .matches(
    /[0-9]/,
    "Lozinka mora sadržati najmanje jedan broj"
  );

/**
 * Strong password validation schema
 * Requires: min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
 */
export const strongPasswordSchema = yup
  .string()
  .required("Lozinka je obavezna")
  .min(8, "Lozinka mora imati najmanje 8 karaktera")
  .matches(
    /[A-Z]/,
    "Lozinka mora sadržati najmanje jedno veliko slovo"
  )
  .matches(
    /[a-z]/,
    "Lozinka mora sadržati najmanje jedno malo slovo"
  )
  .matches(
    /[0-9]/,
    "Lozinka mora sadržati najmanje jedan broj"
  )
  .matches(
    /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
    "Lozinka mora sadržati najmanje jedan specijalni karakter (!@#$%...)"
  );

/**
 * Name validation schema (first and last name)
 */
export const nameSchema = yup
  .string()
  .required("Ime i prezime je obavezno")
  .min(2, "Ime mora imati najmanje 2 karaktera")
  .matches(
    /^[a-zA-ZčćžšđČĆŽŠĐ\s-]+$/,
    "Ime može sadržati samo slova, razmake i crtice"
  )
  .test(
    "has-full-name",
    "Unesite i ime i prezime",
    (value) => {
      if (!value) return false;
      const parts = value.trim().split(/\s+/);
      return parts.length >= 2;
    }
  );

/**
 * Phone validation schema (optional, Serbian format)
 */
export const phoneSchema = yup
  .string()
  .matches(
    /^(\+381|0)?[6-7][0-9]\s?\d{3}\s?\d{3,4}$/,
    "Unesite ispravan broj telefona (npr. +381 60 123 4567 ili 060 123 4567)"
  )
  .nullable()
  .optional();

/**
 * Username validation schema
 */
export const usernameSchema = yup
  .string()
  .required("Korisničko ime je obavezno")
  .min(3, "Korisničko ime mora imati najmanje 3 karaktera")
  .max(20, "Korisničko ime može imati maksimalno 20 karaktera")
  .matches(
    /^[a-zA-Z0-9._]+$/,
    "Korisničko ime može sadržati samo slova, brojeve, tačku i donju crtu"
  );

/**
 * Terms acceptance validation schema
 */
export const termsSchema = yup
  .boolean()
  .oneOf([true], "Morate prihvatiti uslove korišćenja i politiku privatnosti")
  .required("Morate prihvatiti uslove korišćenja i politiku privatnosti");

// ============================================================================
// FORM SCHEMAS
// ============================================================================

/**
 * Login form validation schema
 */
export const loginFormSchema = yup.object({
  email: emailSchema,
  password: yup.string().required("Lozinka je obavezna"),
  rememberMe: yup.boolean().notRequired().default(false),
});

export type LoginFormData = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

/**
 * Register form validation schema
 * Email is the single source of truth - no name or phone required
 */
export const registerFormSchema = yup.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: yup
    .string()
    .required("Potvrdite lozinku")
    .oneOf([yup.ref("password")], "Lozinke se ne podudaraju"),
  agreeToTerms: termsSchema,
});

export type RegisterFormData = {
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
};

/**
 * Password reset request form validation schema
 */
export const passwordResetRequestSchema = yup.object({
  email: emailSchema,
});

export type PasswordResetRequestData = {
  email: string;
};

/**
 * Password reset confirm form validation schema
 */
export const passwordResetConfirmSchema = yup.object({
  password: passwordSchema,
  confirmPassword: yup
    .string()
    .required("Potvrdite lozinku")
    .oneOf([yup.ref("password")], "Lozinke se ne podudaraju"),
});

export type PasswordResetConfirmData = {
  password: string;
  confirmPassword: string;
};

/**
 * Password change form validation schema
 */
export const passwordChangeSchema = yup.object({
  currentPassword: yup.string().required("Trenutna lozinka je obavezna"),
  newPassword: passwordSchema,
  confirmPassword: yup
    .string()
    .required("Potvrdite novu lozinku")
    .oneOf([yup.ref("newPassword")], "Lozinke se ne podudaraju"),
});

export type PasswordChangeData = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

/**
 * Profile edit form validation schema
 */
export const profileEditSchema = yup.object({
  name: nameSchema,
  email: emailSchema,
  phone: yup.string().matches(
    /^(\+381|0)?[6-7][0-9]\s?\d{3}\s?\d{3,4}$/,
    "Unesite ispravan broj telefona (npr. +381 60 123 4567 ili 060 123 4567)"
  ).notRequired(),
  bio: yup.string().max(500, "Biografija može imati maksimalno 500 karaktera").notRequired(),
  location: yup.string().max(100, "Lokacija može imati maksimalno 100 karaktera").notRequired(),
});

export type ProfileEditData = {
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  location?: string;
};

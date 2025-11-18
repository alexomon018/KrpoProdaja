/**
 * Error message translations from English (backend) to Serbian (frontend)
 *
 * This file maps common backend error messages to user-friendly Serbian translations.
 */

/**
 * Map of backend error messages to Serbian translations
 */
const errorTranslations: Record<string, string> = {
  // Authentication errors
  "Invalid credentials": "Netačna email adresa ili lozinka",
  "Invalid email or password": "Netačna email adresa ili lozinka",
  "User not found": "Korisnik nije pronađen",
  "Incorrect password": "Netačna lozinka",
  "Login failed": "Prijavljivanje nije uspelo. Molimo pokušajte ponovo.",

  // Account status errors
  "Account is locked": "Nalog je zaključan zbog previše neuspelih pokušaja prijavljivanja",
  "Account locked": "Nalog je zaključan. Molimo pokušajte ponovo kasnije.",
  "User account is locked": "Korisnički nalog je zaključan",
  "This account can only be accessed through Google": "Ovaj nalog može biti pristupljen samo kroz Google",
  "This account can only be accessed through Facebook": "Ovaj nalog može biti pristupljen samo kroz Facebook",
  "Please use Google to sign in": "Molimo koristite Google za prijavljivanje",
  "Please use Facebook to sign in": "Molimo koristite Facebook za prijavljivanje",

  // Registration errors
  "Email already in use": "Ova email adresa je već u upotrebi",
  "User already exists": "Korisnik sa ovom email adresom već postoji",
  "Email is already registered": "Email adresa je već registrovana",
  "Username already taken": "Korisničko ime je već zauzeto",
  "Registration failed": "Registracija nije uspela. Molimo pokušajte ponovo.",

  // Password validation errors (from backend)
  "Password must be at least 8 characters": "Lozinka mora imati najmanje 8 karaktera",
  "Password is too weak": "Lozinka je previše slaba",
  "Password must contain at least one uppercase letter": "Lozinka mora sadržati najmanje jedno veliko slovo",
  "Password must contain at least one number": "Lozinka mora sadržati najmanje jedan broj",

  // Password reset errors
  "Invalid or expired token": "Nevažeći ili istekao link za resetovanje",
  "Invalid token": "Nevažeći link za resetovanje",
  "Token has expired": "Link za resetovanje je istekao",
  "Reset token has already been used": "Link za resetovanje je već iskorišćen",
  "Token already used": "Link je već iskorišćen",
  "Failed to request password reset": "Zahtev za resetovanje lozinke nije uspeo",
  "Failed to reset password": "Resetovanje lozinke nije uspelo",
  "Password reset token is invalid or has expired": "Link za resetovanje je nevažeći ili je istekao",

  // Email validation errors
  "Invalid email format": "Neispravan format email adrese",
  "Email is required": "Email adresa je obavezna",
  "Please provide a valid email": "Molimo unesite ispravnu email adresu",

  // OAuth errors
  "Google authentication failed": "Google prijavljivanje nije uspelo",
  "Facebook authentication failed": "Facebook prijavljivanje nije uspelo",
  "OAuth authentication failed": "Prijavljivanje preko društvene mreže nije uspelo",
  "Invalid OAuth token": "Nevažeći token za prijavljivanje",
  "Failed to verify Google token": "Verifikacija Google tokena nije uspela",
  "Failed to verify Facebook token": "Verifikacija Facebook tokena nije uspela",

  // Network and server errors
  "Network error": "Greška u mreži. Proverite internet konekciju.",
  "Failed to fetch": "Greška u konekciji. Molimo pokušajte ponovo.",
  "Server error": "Greška na serveru. Molimo pokušajte kasnije.",
  "Internal server error": "Interna greška servera. Molimo pokušajte kasnije.",
  "Service unavailable": "Servis trenutno nije dostupan. Molimo pokušajte kasnije.",
  "Unknown error occurred": "Došlo je do nepoznate greške. Molimo pokušajte ponovo.",

  // Token errors
  "Token is invalid": "Nevažeći token",
  "Token has expired": "Token je istekao",
  "No token provided": "Token nije prosleđen",
  "Invalid access token": "Nevažeći pristupni token",
  "Unauthorized": "Neautorizovan pristup",

  // Validation errors
  "Missing required fields": "Nedostaju obavezna polja",
  "Invalid request": "Neispravan zahtev",
  "Validation failed": "Validacija nije uspela",

  // Logout errors
  "Logout failed": "Odjava nije uspela",
  "Failed to revoke tokens": "Opozivanje tokena nije uspelo",
};

/**
 * Translate backend error message to Serbian
 *
 * @param errorMessage - The error message from the backend (in English)
 * @param fallback - Optional fallback message if translation not found
 * @returns Translated error message in Serbian
 *
 * @example
 * ```ts
 * const message = translateError("Invalid credentials");
 * // Returns: "Netačna email adresa ili lozinka"
 * ```
 */
export function translateError(
  errorMessage: string | undefined,
  fallback?: string
): string {
  if (!errorMessage) {
    return fallback || "Došlo je do greške. Molimo pokušajte ponovo.";
  }

  // Direct match
  if (errorTranslations[errorMessage]) {
    return errorTranslations[errorMessage];
  }

  // Case-insensitive search
  const lowerMessage = errorMessage.toLowerCase();
  for (const [key, value] of Object.entries(errorTranslations)) {
    if (key.toLowerCase() === lowerMessage) {
      return value;
    }
  }

  // Partial match for common patterns
  if (lowerMessage.includes("locked")) {
    if (lowerMessage.includes("minutes")) {
      // Extract minutes if present (e.g., "Account locked for 30 minutes")
      const match = errorMessage.match(/(\d+)\s*minut/i);
      if (match) {
        return `Nalog je zaključan. Pokušajte ponovo za ${match[1]} minuta.`;
      }
      return "Nalog je zaključan. Molimo pokušajte ponovo kasnije.";
    }
    return errorTranslations["Account locked"];
  }

  if (lowerMessage.includes("invalid credentials") || lowerMessage.includes("incorrect")) {
    return errorTranslations["Invalid credentials"];
  }

  if (lowerMessage.includes("already exists") || lowerMessage.includes("already in use")) {
    if (lowerMessage.includes("email")) {
      return errorTranslations["Email already in use"];
    }
    if (lowerMessage.includes("username")) {
      return errorTranslations["Username already taken"];
    }
    return "Podaci su već u upotrebi";
  }

  if (lowerMessage.includes("expired") || lowerMessage.includes("invalid token")) {
    return errorTranslations["Invalid or expired token"];
  }

  if (lowerMessage.includes("network") || lowerMessage.includes("fetch")) {
    return errorTranslations["Network error"];
  }

  if (lowerMessage.includes("unauthorized")) {
    return errorTranslations["Unauthorized"];
  }

  // If no translation found, return the fallback or original message
  return fallback || errorMessage;
}

/**
 * Translate multiple error messages
 * Useful when backend returns an array of errors
 *
 * @param errors - Array of error messages
 * @returns Array of translated error messages
 */
export function translateErrors(errors: string[]): string[] {
  return errors.map((error) => translateError(error));
}

/**
 * Extract and translate error from API response
 *
 * @param response - Fetch Response object
 * @returns Translated error message
 */
export async function extractAndTranslateError(
  response: Response
): Promise<string> {
  try {
    const errorData = await response.json();

    // Check common error field names
    const errorMessage =
      errorData.error ||
      errorData.message ||
      errorData.msg ||
      errorData.detail ||
      (errorData.errors && errorData.errors[0]) ||
      response.statusText;

    return translateError(errorMessage);
  } catch {
    // If JSON parsing fails, use status text
    return translateError(response.statusText, "Došlo je do greške na serveru");
  }
}

/**
 * Common fallback error messages in Serbian
 */
export const defaultErrorMessages = {
  login: "Prijavljivanje nije uspelo. Molimo pokušajte ponovo.",
  register: "Registracija nije uspela. Molimo pokušajte ponovo.",
  passwordReset: "Resetovanje lozinke nije uspelo. Molimo pokušajte ponovo.",
  unknown: "Došlo je do nepoznate greške. Molimo pokušajte ponovo.",
  network: "Greška u konekciji. Proverite internet konekciju i pokušajte ponovo.",
} as const;

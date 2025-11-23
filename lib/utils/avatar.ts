/**
 * Utility functions for user avatar display
 */

export interface AvatarData {
  type: 'image' | 'initials';
  value: string;
  backgroundColor?: string;
  textColor?: string;
}

/**
 * Generate a consistent color based on a string (email or name)
 * Returns a pleasant background color from a predefined palette
 */
function getColorFromString(str: string): { bg: string; text: string } {
  const colors = [
    { bg: '#E57373', text: '#FFFFFF' }, // red
    { bg: '#F06292', text: '#FFFFFF' }, // pink
    { bg: '#BA68C8', text: '#FFFFFF' }, // purple
    { bg: '#9575CD', text: '#FFFFFF' }, // deep purple
    { bg: '#7986CB', text: '#FFFFFF' }, // indigo
    { bg: '#64B5F6', text: '#FFFFFF' }, // blue
    { bg: '#4FC3F7', text: '#FFFFFF' }, // light blue
    { bg: '#4DD0E1', text: '#FFFFFF' }, // cyan
    { bg: '#4DB6AC', text: '#FFFFFF' }, // teal
    { bg: '#81C784', text: '#FFFFFF' }, // green
    { bg: '#AED581', text: '#212121' }, // light green
    { bg: '#FFD54F', text: '#212121' }, // amber
    { bg: '#FFB74D', text: '#212121' }, // orange
    { bg: '#A1887F', text: '#FFFFFF' }, // brown
    { bg: '#90A4AE', text: '#FFFFFF' }, // blue grey
  ];

  // Generate a consistent index based on the string
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash; // Convert to 32-bit integer
  }
  const index = Math.abs(hash) % colors.length;

  return colors[index];
}

/**
 * Extract initials from email address
 * Examples:
 *   - "john.doe@example.com" -> "JD"
 *   - "alice@example.com" -> "A"
 *   - "bob-smith@test.com" -> "BS"
 */
function getInitialsFromEmail(email: string): string {
  const username = email.split('@')[0];

  // Try to split by common separators (., -, _)
  const parts = username.split(/[.\-_]/);

  if (parts.length >= 2) {
    // Take first letter of first two parts
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  // If no separator, just take the first letter
  return username[0].toUpperCase();
}

/**
 * Extract initials from first and last name
 * Examples:
 *   - "John", "Doe" -> "JD"
 *   - "Alice", undefined -> "A"
 *   - undefined, "Smith" -> "S"
 */
function getInitialsFromName(firstName?: string, lastName?: string): string | null {
  const firstInitial = firstName?.trim()?.[0]?.toUpperCase() || '';
  const lastInitial = lastName?.trim()?.[0]?.toUpperCase() || '';

  if (firstInitial && lastInitial) {
    return firstInitial + lastInitial;
  }

  if (firstInitial) {
    return firstInitial;
  }

  if (lastInitial) {
    return lastInitial;
  }

  return null;
}

/**
 * Get avatar data for a user
 * Priority:
 *   1. Avatar image URL (if provided)
 *   2. Initials from first name + last name (if both provided)
 *   3. Initials from email address
 *
 * @param user - User object with optional avatar, firstName, lastName, and email
 * @returns AvatarData object containing type and display information
 */
export function getUserAvatarData(user: {
  avatar?: string;
  firstName?: string;
  lastName?: string;
  email: string;
}): AvatarData {
  // Priority 1: Use avatar image if available
  if (user.avatar?.trim()) {
    return {
      type: 'image',
      value: user.avatar,
    };
  }

  // Priority 2: Use initials from first name and last name if available
  const nameInitials = getInitialsFromName(user.firstName, user.lastName);
  if (nameInitials) {
    const seed = `${user.firstName || ''}${user.lastName || ''}`;
    const colors = getColorFromString(seed);
    return {
      type: 'initials',
      value: nameInitials,
      backgroundColor: colors.bg,
      textColor: colors.text,
    };
  }

  // Priority 3: Use initials from email
  const emailInitials = getInitialsFromEmail(user.email);
  const colors = getColorFromString(user.email);
  return {
    type: 'initials',
    value: emailInitials,
    backgroundColor: colors.bg,
    textColor: colors.text,
  };
}

/**
 * Get display name for a user
 * Priority:
 *   1. First name + Last name (if both provided)
 *   2. First name only (if only first name provided)
 *   3. Last name only (if only last name provided)
 *   4. Email address
 */
export function getUserDisplayName(user: {
  firstName?: string;
  lastName?: string;
  email: string;
}): string {
  const firstName = user.firstName?.trim();
  const lastName = user.lastName?.trim();

  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  }

  if (firstName) {
    return firstName;
  }

  if (lastName) {
    return lastName;
  }

  return user.email;
}

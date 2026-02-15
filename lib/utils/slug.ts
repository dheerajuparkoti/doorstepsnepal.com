

/**
 * Creates a URL-friendly slug from a professional's name and ID
 * Format: "alex-uparkoti-16"
 */
export const createProfessionalSlug = (fullName: string, id: number): string => {
  // Convert name to lowercase and replace spaces with hyphens
  const namePart = fullName
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, '')      // Remove any special characters
    .replace(/-+/g, '-')             // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, '');          // Remove leading/trailing hyphens
  
  // Return name-id format
  return `${namePart}-${id}`;
};

/**
 * Extracts the professional ID from a slug
 */
export const extractIdFromSlug = (slug: string): number | null => {
  // Split by hyphen and get the last part
  const parts = slug.split('-');
  const lastPart = parts[parts.length - 1];
  
  // Try to parse the last part as a number
  const id = parseInt(lastPart, 10);
  
  // Return ID if valid, otherwise null
  return isNaN(id) ? null : id;
};

/**
 * Validates if a string is a valid professional slug
 */
export const isValidProfessionalSlug = (slug: string): boolean => {
  // Check format: name-with-hyphens-123
  const pattern = /^[a-z0-9]+(?:-[a-z0-9]+)*-\d+$/;
  return pattern.test(slug);
};
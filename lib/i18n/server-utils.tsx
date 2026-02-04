// lib/i18n/server-utils.ts
import { cookies, headers } from 'next/headers';

export async function getServerLanguage(): Promise<'en' | 'ne'> {
  try {
    // 1. Check cookies (user preference)
    const cookieStore = await cookies();
    const cookieLang = cookieStore.get('language')?.value;
    
    if (cookieLang === 'en' || cookieLang === 'ne') {
      return cookieLang;
    }

    // 2. Check browser language
    const headersList = await headers();
    const acceptLanguage = headersList.get('accept-language');
    
    // Check for Nepali language codes
    if (acceptLanguage?.includes('ne') || acceptLanguage?.includes('np')) {
      return 'ne';
    }

    // 3. Default to English
    return 'en';
  } catch (error) {
    console.error('Error getting server language:', error);
    return 'en';
  }
}
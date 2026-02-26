
import * as z from 'zod';

export const getEmergencySchema = (getLocalizedText: (en: string, ne: string) => string) =>
  z.object({
    ec_name: z
      .string()
      .min(1, { message: getLocalizedText('Name is required', 'नाम आवश्यक छ') })
      .max(50, { message: getLocalizedText('Name cannot exceed 50 characters', 'नाम ५० अक्षर भन्दा बढी हुन सक्दैन') })
      .regex(/^[a-zA-Z\s]+$/, { 
        message: getLocalizedText(
          'Name can only contain English letters and spaces', 
          'नाममा केवल अंग्रेजी अक्षर र स्पेस हुन सक्छ'
        ) 
      }),

    ec_relationship: z
      .string()
      .min(1, { message: getLocalizedText('Relationship is required', 'सम्बन्ध आवश्यक छ') })
      .max(30, { message: getLocalizedText('Relationship cannot exceed 30 characters', 'सम्बन्ध ३० अक्षर भन्दा बढी हुन सक्दैन') })
      .regex(/^[a-zA-Z\s]+$/, { 
        message: getLocalizedText(
          'Relationship can only contain English letters and spaces', 
          'सम्बन्धमा केवल अंग्रेजी अक्षर र स्पेस हुन सक्छ'
        ) 
      }),

    ec_phone: z
      .string()
      .min(1, { message: getLocalizedText('Phone number is required', 'फोन नम्बर आवश्यक छ') })
      .length(10, { message: getLocalizedText('Phone number must be 10 digits', 'फोन नम्बर १० अंकको हुनुपर्छ') })
      .regex(/^[0-9]+$/, { 
        message: getLocalizedText('Phone number must contain only numbers', 'फोन नम्बरमा केवल अंक हुनुपर्छ') 
      })
      .regex(/^(98|97|96)/, { 
        message: getLocalizedText(
          'Phone number must start with 98, 97 or 96', 
          'फोन नम्बर ९८, ९७ वा ९६ बाट सुरु हुनुपर्छ'
        ) 
      }),

    referred_by: z
      .string()
      .min(1, { message: getLocalizedText('Please select an option', 'कृपया एउटा विकल्प छान्नुहोस्') }),

    referrer_name: z
      .string()
      .optional()
      .nullable(),
  })
  .superRefine((data, ctx) => {
    // Conditional validation for referrer_name when referred_by is 'Friend'
    if (data.referred_by === 'Friend') {
      if (!data.referrer_name || data.referrer_name.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['referrer_name'],
          message: getLocalizedText(
            "Friend's name is required", 
            'साथीको नाम आवश्यक छ'
          ),
        });
      } else if (data.referrer_name.length > 50) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['referrer_name'],
          message: getLocalizedText(
            "Friend's name cannot exceed 50 characters", 
            'साथीको नाम ५० अक्षर भन्दा बढी हुन सक्दैन'
          ),
        });
      } else if (!/^[a-zA-Z\s]+$/.test(data.referrer_name)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['referrer_name'],
          message: getLocalizedText(
            "Friend's name can only contain English letters and spaces", 
            'साथीको नाममा केवल अंग्रेजी अक्षर र स्पेस हुन सक्छ'
          ),
        });
      }
    }
  });

export type EmergencyFormValues = z.infer<ReturnType<typeof getEmergencySchema>>;

import * as z from 'zod';
import { BANKS_NEPAL } from '../constants/banks/nepal';

export const getBankDetailsSchema = (getLocalizedText: (en: string, ne: string) => string) =>
  z.object({
    bank_account_number: z
      .string()
      .min(1, { message: getLocalizedText('Account number is required', 'खाता नम्बर आवश्यक छ') })
      .regex(/^[0-9\s]+$/, { 
        message: getLocalizedText(
          'Account number can only contain numbers and spaces', 
          'खाता नम्बरमा केवल अंक र स्पेस हुन सक्छ'
        ) 
      })
      .min(8, { message: getLocalizedText('Account number must be at least 8 digits', 'खाता नम्बर कम्तिमा ८ अंकको हुनुपर्छ') })
      .max(20, { message: getLocalizedText('Account number cannot exceed 20 digits', 'खाता नम्बर २० अंक भन्दा बढी हुन सक्दैन') }),

    bank_account_holder_name: z
      .string()
      .min(1, { message: getLocalizedText('Account holder name is required', 'खाता धनीको नाम आवश्यक छ') })
      .max(50, { message: getLocalizedText('Name cannot exceed 50 characters', 'नाम ५० अक्षर भन्दा बढी हुन सक्दैन') })
      .regex(/^[a-zA-Z\s]+$/, { 
        message: getLocalizedText(
          'Name can only contain English letters and spaces', 
          'नाममा केवल अंग्रेजी अक्षर र स्पेस हुन सक्छ'
        ) 
      }),

    bank_name: z
      .string()
      .min(1, { message: getLocalizedText('Bank name is required', 'बैंकको नाम आवश्यक छ') })
      .refine((val) => BANKS_NEPAL.includes(val), {
        message: getLocalizedText('Please select a valid bank from the list', 'कृपया सूचीबाट मान्य बैंक छान्नुहोस्'),
      }),

    bank_branch_name: z
      .string()
      .min(1, { message: getLocalizedText('Branch name is required', 'शाखाको नाम आवश्यक छ') })
      .max(50, { message: getLocalizedText('Branch name cannot exceed 50 characters', 'शाखाको नाम ५० अक्षर भन्दा बढी हुन सक्दैन') })
      .regex(/^[a-zA-Z\s]+$/, { 
        message: getLocalizedText(
          'Branch name can only contain English letters and spaces', 
          'शाखाको नाममा केवल अंग्रेजी अक्षर र स्पेस हुन सक्छ'
        ) 
      }),
  });

export type BankDetailsFormValues = z.infer<ReturnType<typeof getBankDetailsSchema>>;
export { BANKS_NEPAL };


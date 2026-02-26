import * as z from 'zod';

export const getPaymentSchema = (getLocalizedText: (en: string, ne: string) => string) =>
  z.object({
    payment_method: z.enum(['cash', 'esewa', 'khalti', 'imepay', 'bank_transfer']),
    phone_number: z.string().optional(),
    bank_account_number: z.string().optional(),
    bank_branch_name: z.string().optional(),
    bank_name: z.string().optional(),
    bank_account_holder_name: z.string().optional(),

    ec_name: z
      .string()
      .min(2, { message: getLocalizedText('Name must be at least 2 characters', 'नाम कम्तिमा २ अक्षर हुनुपर्छ') })
      .max(30, { message: getLocalizedText('Name cannot exceed 30 characters', 'नाम ३० अक्षर भन्दा बढी हुन सक्दैन') })
      .regex(/^[a-zA-Z\s]+$/, { message: getLocalizedText('Name can only contain English letters and spaces', 'नाममा केवल अंग्रेजी अक्षर र स्पेस हुन सक्छ') }),

    ec_relationship: z
      .string()
      .min(2)
      .max(20)
      .regex(/^[a-zA-Z\s]+$/, { message: getLocalizedText('Relationship can only contain English letters and spaces', 'सम्बन्धमा केवल अंग्रेजी अक्षर र स्पेस हुन सक्छ') }),

    ec_phone: z
      .string()
      .min(10)
      .max(10)
      .regex(/^[0-9]+$/, { message: getLocalizedText('Phone number must contain only numbers', 'फोन नम्बरमा केवल अंक हुनुपर्छ') })
      .regex(/^(98|97|96)/, { message: getLocalizedText('Phone number must start with 98, 97 or 96', 'फोन नम्बर ९८, ९७ वा ९६ बाट सुरु हुनुपर्छ') }),
  })
  .superRefine((data, ctx) => {
    // Digital payment validation
    if (['esewa', 'khalti', 'imepay'].includes(data.payment_method)) {
      if (!data.phone_number || data.phone_number.length !== 10 || !/^[0-9]+$/.test(data.phone_number)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['phone_number'],
        });
      }
    }

    // Bank transfer validation
    if (data.payment_method === 'bank_transfer') {
      const validateLetters = (value: string | undefined, path: (string | number)[]) => {
        if (!value || !/^[a-zA-Z\s]+$/.test(value)) ctx.addIssue({ code: z.ZodIssueCode.custom, path });
      };
      const validateNumbers = (value: string | undefined, path: (string | number)[]) => {
        if (!value || !/^[0-9\s]+$/.test(value)) ctx.addIssue({ code: z.ZodIssueCode.custom, path });
      };

      validateLetters(data.bank_account_holder_name, ['bank_account_holder_name']);
      validateLetters(data.bank_name, ['bank_name']);
      if (data.bank_branch_name) validateLetters(data.bank_branch_name, ['bank_branch_name']);
      validateNumbers(data.bank_account_number, ['bank_account_number']);
    }
  });

export type PaymentFormValues = z.infer<ReturnType<typeof getPaymentSchema>>;
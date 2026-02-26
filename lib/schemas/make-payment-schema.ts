import { z } from 'zod';
import { PaymentMethod } from '@/lib/data/professional';
import { PAYMENT_CONSTANTS } from '@/lib/data/professional/constants';

export const getPaymentSchema = (
  getLocalizedText: (en: string, ne: string) => string
) =>
  z.object({
    amount: z
      .number()
      .min(
        PAYMENT_CONSTANTS.MINIMUM_AMOUNT,
        getLocalizedText(
          `Minimum payment is Rs. ${PAYMENT_CONSTANTS.MINIMUM_AMOUNT}`,
          `न्यूनतम भुक्तानी Rs. ${PAYMENT_CONSTANTS.MINIMUM_AMOUNT} हुनुपर्छ`
        )
      )
      .max(
        1000000,
        getLocalizedText('Maximum payment is Rs. 10,00,000', 'अधिकतम भुक्तानी Rs. १०,००,००० हुन सक्छ')
      ),
    payment_method: z.nativeEnum(PaymentMethod, {
      errorMap: () => ({
        message: getLocalizedText('Please select a valid payment method', 'कृपया मान्य भुक्तानी विधि चयन गर्नुहोस्')
      })
    }),
       transaction_id: z
      .string()
      .regex(/^[A-Za-z0-9]*$/, {
        message: getLocalizedText(
          'Transaction ID can only contain letters and numbers',
          'लेनदेन आईडीमा केवल अक्षर र नम्बर हुन सक्छ'
        )
      })
      .max(20, {
        message: getLocalizedText(
          'Transaction ID cannot exceed 20 characters',
          'लेनदेन आईडी २० अक्षर भन्दा बढी हुन सक्दैन'
        )
      })
      .optional(),
    notes: z
      .string()
      .regex(/^[A-Za-z0-9 .,;:!?'"()\-@#&%$/\\\n\r]*$/, {
        message: getLocalizedText(
          'Notes can only contain letters, numbers, and basic symbols',
          'नोटहरूमा केवल अक्षर, नम्बर, र सामान्य प्रतीकहरू मात्र हुन सक्छ'
        )
      })
      .max(100, {
        message: getLocalizedText(
          'Notes cannot exceed 100 characters',
          'नोटहरू १०० अक्षर भन्दा बढी हुन सक्दैन'
        )
      })
      .optional(),
  });

export type PaymentFormData = z.infer<ReturnType<typeof getPaymentSchema>>;
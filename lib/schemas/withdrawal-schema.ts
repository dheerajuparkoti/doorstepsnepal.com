import { z } from 'zod';
import { WITHDRAWAL_CONSTANTS } from '@/lib/data/professional/constants';
import { CurrencyFormatter } from '../utils/formatters';

export const getWithdrawalSchema = (getLocalizedText: (en: string, ne: string) => string, availableBalance?: number) => {
  return z.object({
    amount: z.number()
      .min(
        WITHDRAWAL_CONSTANTS.MINIMUM_WITHDRAWAL, 
        getLocalizedText(
          `Minimum withdrawal is Rs. ${WITHDRAWAL_CONSTANTS.MINIMUM_WITHDRAWAL}`,
          `न्यूनतम निकासी रु. ${WITHDRAWAL_CONSTANTS.MINIMUM_WITHDRAWAL} हो`
        )
      )
      .max(
        1000000, 
        getLocalizedText(
          'Maximum withdrawal is Rs. 10,00,000',
          'अधिकतम निकासी रु. १०,००,००० हो'
        )
      )
      .refine(
        (val) => availableBalance ? val <= availableBalance : true,
        {
          message: getLocalizedText(
            `Amount cannot exceed available balance of ${CurrencyFormatter.format(availableBalance || 0)}`,
            `रकम उपलब्ध ब्यालेन्स ${CurrencyFormatter.format(availableBalance || 0)} भन्दा बढी हुन सक्दैन`
          )
        }
      ),
    notes: z.string()
      .max(
        100, 
        getLocalizedText(
          'Notes cannot exceed 100 characters',
          'नोट १०० अक्षर भन्दा बढी हुन सक्दैन'
        )
      )
      .optional()
  });
};

export type WithdrawalFormData = z.infer<ReturnType<typeof getWithdrawalSchema>>;
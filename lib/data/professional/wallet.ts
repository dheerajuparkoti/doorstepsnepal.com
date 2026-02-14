
export interface ProfessionalWallet {
  json(): unknown;
  professional_id: number;
  total_earned: number;
  total_commission: number;
  total_withdrawn: number;
  current_balance: number;
}

export interface ProfessionalWalletStats extends ProfessionalWallet {
  netEarnings: number;
  withdrawalEligibility: {
    isEligible: boolean;
    minimumRequired: number;
    remainingAmount: number;
    eligibilityPercent: number;
  };
}
import { PartnerBenefitProgramSection } from "../partner-benefit-program-section";
import { fetchCommissionSlabs } from "@/lib/api/commission-slabs";

export async function PartnerBenefitProgramSSR() {
  try {
    const commissionSlabs = await fetchCommissionSlabs();
    
    return <PartnerBenefitProgramSection commissionSlabs={commissionSlabs} />;
  } catch (error) {
    console.error("Error loading partner benefit program:", error);
    
    // Return empty section or fallback UI
    return null;
  }
}
import { Suspense} from "react";
import { PartnerBenefitProgramSkeleton } from "@/components/home/skeleton/partner-benefit-program-skeleton";
import { PartnerBenefitProgramSSR } from "@/components/home/ssr/partner-benefit-program-ssr";


export const metadata = {
  title: "Partner Benefit Program | Professional Dashboard",
  description: "View our partner benefit program and commission structure",
};

export default function PartnerBenefitProgramPage() {
  return (
    <div className="container mx-auto py-8">
      <Suspense fallback={<PartnerBenefitProgramSkeleton />}>
        <PartnerBenefitProgramSSR />
      </Suspense>
    </div>
  );
}
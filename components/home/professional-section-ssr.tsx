import { ProfessionalsSection } from './professionals-section';
import { fetchProfessionalServices } from '@/lib/api/professional-services';
import type { ProfessionalService } from '@/lib/data/professional-services';

export async function ProfessionalsSections() {
  // Fetch first page (large enough to get at least 8 unique professionals)
  const data = await fetchProfessionalServices(1, 10000);

  const professionalServices: ProfessionalService[] = data.professional_services || [];

  // Deduplicate by professional ID
  const uniqueProfessionalsMap = new Map<number, ProfessionalService>();
  professionalServices.forEach((ps) => {
    const id = ps.professional.id;
    if (!uniqueProfessionalsMap.has(id)) {
      uniqueProfessionalsMap.set(id, ps);
    }
  });

  const uniqueProfessionalServices = Array.from(uniqueProfessionalsMap.values());

  // Pass only first 8 for display
  const topProfessionals = uniqueProfessionalServices.slice(0, 8);

  const totalProfessionals = uniqueProfessionalServices.length;
  return (
    <ProfessionalsSection
      professionalServices={topProfessionals}
      total={totalProfessionals} // total from API ensures footer shows
    />
  );
}


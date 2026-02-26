

import { ProfessionalsSection } from '../professionals-section';
import { fetchRandomProfessionals } from '@/lib/api/home-section/random-professionals';

export async function ProfessionalsSections() {
  try {
   
    const { professionals, total } = await fetchRandomProfessionals({
      limit: 8,
      maxPerPage: 50
    });



    if (professionals.length === 0) {
  
      return (
        <ProfessionalsSection
          professionalServices={[]}
          total={0}
        />
      );
    }

    return (
      <ProfessionalsSection
        professionalServices={professionals}
        total={total}
      />
    );
    
  } catch (error) {

    return (
      <ProfessionalsSection
        professionalServices={[]}
        total={0}
      />
    );
  }
}
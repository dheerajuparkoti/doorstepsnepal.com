// import { ProfessionalsSection } from '../professionals-section';
// import { fetchProfessionalServices } from '@/lib/api/professional-services';
// import type { ProfessionalService } from '@/lib/data/professional-services';

// export async function ProfessionalsSections() {
//   // Fetch first page (large enough to get at least 8 unique professionals)
//   const data = await fetchProfessionalServices(1, 50);

//   const professionalServices: ProfessionalService[] = data.professional_services || [];

//   // Deduplicate by professional ID
//   const uniqueProfessionalsMap = new Map<number, ProfessionalService>();
//   professionalServices.forEach((ps) => {
//     const id = ps.professional.id;
//     if (!uniqueProfessionalsMap.has(id)) {
//       uniqueProfessionalsMap.set(id, ps);
//     }
//   });

//   const uniqueProfessionalServices = Array.from(uniqueProfessionalsMap.values());

//   // Pass only first 8 for display
//   const topProfessionals = uniqueProfessionalServices.slice(0, 8);

//   const totalProfessionals = uniqueProfessionalServices.length;
//   return (
//     <ProfessionalsSection
//       professionalServices={topProfessionals}
//       total={totalProfessionals} // total from API ensures footer shows
//     />
//   );
// }


// import { ProfessionalsSection } from '../professionals-section';
// import { fetchTopProfessionals } from '@/lib/api/home-section/top-professionals';

// export async function ProfessionalsSections() {
//   try {
//     // Fetch top 8 unique professionals (will fetch multiple pages if needed)
//     const { professionals, total } = await fetchTopProfessionals({
//       limit: 8,
//       maxPerPage: 50
//     });

//     console.log(`👥 Found ${professionals.length} unique professionals out of ${total} total`);

//     if (professionals.length === 0) {
//       console.log('🚫 No professionals found');
//       return (
//         <ProfessionalsSection
//           professionalServices={[]}
//           total={0}
//         />
//       );
//     }

//     return (
//       <ProfessionalsSection
//         professionalServices={professionals}
//         total={total} // Total from API (may be larger than displayed)
//       />
//     );
    
//   } catch (error) {
//     console.error("❌ Error in ProfessionalsSections:", error);
//     return (
//       <ProfessionalsSection
//         professionalServices={[]}
//         total={0}
//       />
//     );
//   }
// }

import { ProfessionalsSection } from '../professionals-section';
import { fetchRandomProfessionals } from '@/lib/api/home-section/random-professionals';

export async function ProfessionalsSections() {
  try {
    // Fetch 8 random professionals with valid profile images and skills
    const { professionals, total } = await fetchRandomProfessionals({
      limit: 8,
      maxPerPage: 50
    });

    console.log(`🎲 Random professionals section: Found ${professionals.length} professionals`);

    if (professionals.length === 0) {
      console.log('🚫 No valid professionals found with profile images');
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
    console.error("❌ Error in RandomProfessionalsSectionSSR:", error);
    return (
      <ProfessionalsSection
        professionalServices={[]}
        total={0}
      />
    );
  }
}
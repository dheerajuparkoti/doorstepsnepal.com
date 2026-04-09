

// import { ProfessionalsSection } from '../professionals-section';
// import { fetchRandomProfessionals } from '@/lib/api/home-section/random-professionals';

// export async function ProfessionalsSections() {
//   try {
   
//     const { professionals, total } = await fetchRandomProfessionals({
//       limit: 8,
//       maxPerPage: 50
//     });



//     if (professionals.length === 0) {
  
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
//         total={total}
//       />
//     );
    
//   } catch (error) {

//     return (
//       <ProfessionalsSection
//         professionalServices={[]}
//         total={0}
//       />
//     );
//   }
// }


import { ProfessionalsSection } from '../professionals-section';
import { fetchTopProfessionals } from '../../../lib/api/home-section/top-professionals';

export async function ProfessionalsSections() {
  const { professionals, total } = await fetchTopProfessionals(8);

  return (
    <ProfessionalsSection
      professionals={professionals}
      total={total}
    />
  );
}
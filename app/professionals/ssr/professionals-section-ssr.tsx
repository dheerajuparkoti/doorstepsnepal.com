
// import { fetchProfessionalServices } from '@/lib/api/professional-services';
// import { fetchProfessionalProfile, fetchProfessionalServiceAreas } from '@/lib/api/professional-profiles';
// import { ProfessionalsClientWrapper } from '../professionals-client-wrapper';

// interface ProfessionalsSectionProps {
//   professionalId?: number;
// }

// export async function ProfessionalsSection({
//   professionalId,
// }: ProfessionalsSectionProps) {
//   // Next.js automatically caches fetch results with `force-cache`
//   // Data is cached for 1 hour (3600 seconds) by default
//   const professionalServicesData = await fetchProfessionalServices();
  
//   // Filter if professionalId is provided
//   let filteredServices = professionalServicesData.professional_services;
//   if (professionalId) {
//     filteredServices = filteredServices.filter(
//       ps => ps.professional_id === professionalId
//     );
//   }
  
//   // Group services by professional
//   const professionalsMap = new Map<number, any>();
  
//   for (const ps of filteredServices) {
//     if (!ps.professional) continue;
    
//     const profId = ps.professional_id;
    
//     if (!professionalsMap.has(profId)) {
//       // Fetch profile and service areas with caching
//       const [profile, serviceAreas] = await Promise.all([
//         fetchProfessionalProfile(profId),
//         fetchProfessionalServiceAreas(profId),
//       ]);
      
//       const serviceAreasDisplay = serviceAreas.length > 0
//         ? serviceAreas
//             .slice(0, 3)
//             .map((area: any) => area.name)
//             .join(', ') + (serviceAreas.length > 3 ? '...' : '')
//         : 'No service areas listed';
      
//       professionalsMap.set(profId, {
//         id: profId,
//         user_id: ps.professional.user_id,
//         full_name: ps.professional.user.full_name,
//         profile_image_url: ps.professional.user.profile_image || '',
//         all_skills: ps.professional.skill || 'N/A',
//         service_areas_display: serviceAreasDisplay,
//         service_areas_full: serviceAreas,
//         services: [],
//         all_prices: [],
//         service_names: [],
//       });
//     }
    
//     const professional = professionalsMap.get(profId)!;
//     professional.services.push(ps);
//     professional.all_prices.push(...(ps.prices || []));
//     if (ps.service?.name_en) {
//       professional.service_names.push(ps.service.name_en);
//     }
//   }
  
//   // Convert map to array
//   const professionalsData = Array.from(professionalsMap.values()).map(prof => ({
//     ...prof,
//     service_name: prof.service_names.join(', '),
//     is_minimum_price: prof.all_prices.some((p: any) => p.is_minimum_price),
//   }));
  
//   return (
//     <ProfessionalsClientWrapper 
//       professionalsData={professionalsData}
//       isSingleProfessionalView={!!professionalId}
//       professionalName={professionalId ? professionalsData[0]?.full_name : undefined}
//     />
//   );
// }




import { fetchProfessionalServices } from '@/lib/api/professional-services';
import { fetchProfessionalProfile, fetchProfessionalServiceAreas } from '@/lib/api/professional-profiles';
import { ProfessionalsClientWrapper } from '../professionals-client-wrapper';

interface ProfessionalsSectionProps {
  professionalId?: number;
}

export async function ProfessionalsSection({
  professionalId,
}: ProfessionalsSectionProps) {
  const professionalServicesData = await fetchProfessionalServices();
  
  // Filter if professionalId is provided
  let filteredServices = professionalServicesData.professional_services;
  if (professionalId) {
    filteredServices = filteredServices.filter(
      ps => ps.professional_id === professionalId
    );
  }
  
  // Group services by professional
  const professionalsMap = new Map<number, any>();
  
  for (const ps of filteredServices) {
    if (!ps.professional) continue;
    
    const profId = ps.professional_id;
    
    if (!professionalsMap.has(profId)) {
      // Fetch profile and service areas with caching
      const [profile, serviceAreas] = await Promise.all([
        fetchProfessionalProfile(profId),
        fetchProfessionalServiceAreas(profId),
      ]);
      
      const serviceAreasDisplay = serviceAreas.length > 0
        ? serviceAreas
            .slice(0, 3)
            .map((area: any) => area.name)
            .join(', ') + (serviceAreas.length > 3 ? '...' : '')
        : 'No service areas listed';
      
      professionalsMap.set(profId, {
        id: profId,
        user_id: ps.professional.user_id,
        full_name: ps.professional.user.full_name,
        profile_image_url: ps.professional.user.profile_image || '',
        all_skills: ps.professional.skill || 'N/A',
        service_areas_display: serviceAreasDisplay,
        service_areas_full: serviceAreas,
        services: [],
        all_prices: [],
        service_names: [],
      });
    }
    
    const professional = professionalsMap.get(profId)!;
    professional.services.push(ps);
    professional.all_prices.push(...(ps.prices || []));
    if (ps.service?.name_en) {
      professional.service_names.push(ps.service.name_en);
    }
  }
  
  // Convert map to array
  const professionalsData = Array.from(professionalsMap.values()).map(prof => ({
    ...prof,
    service_name: prof.service_names.join(', '),
    is_minimum_price: prof.all_prices.some((p: any) => p.is_minimum_price),
  }));
  
  
  return (
    <ProfessionalsClientWrapper 
      professionalsData={professionalsData}
      isSingleProfessionalView={!!professionalId}
      professionalName={professionalId ? professionalsData[0]?.full_name : undefined}
      specificProfessionalId={professionalId} // Add this line
    />
  );
}
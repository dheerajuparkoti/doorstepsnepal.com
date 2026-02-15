// import { fetchProfessionalServices } from '@/lib/api/professional-services';
// import { fetchProfessionalProfile, fetchProfessionalServiceAreas } from '@/lib/api/professional-profiles';
// import { ServiceProfessionalsClient } from '../service-professionals-client';

// interface ServiceProfessionalsSectionProps {
//   serviceId: number;
//   serviceName: string;
//   searchParams?: { [key: string]: string | string[] | undefined };
// }

// export async function ServiceProfessionalsSection({
//   serviceId,
//   serviceName,
//   searchParams = {},
// }: ServiceProfessionalsSectionProps) {
//   try {
  
//     const professionalServicesData = await fetchProfessionalServices();
//     let filteredServices = professionalServicesData.professional_services;
    
   
//     const isSearchByServiceName = serviceId === 0;
    

//     if (isSearchByServiceName) {

//       const serviceQuery = searchParams?.service as string || 
//                           searchParams?.search as string;
      
//       if (serviceQuery) {
//         // Filter by service name (case-insensitive)
//         filteredServices = filteredServices.filter(ps => {
//           const serviceName = ps.service?.name_en?.toLowerCase() || '';
//           const query = serviceQuery.toLowerCase();
//           return serviceName.includes(query);
//         });
//       }

//     } else {

//       filteredServices = filteredServices.filter(
//         ps => ps.service_id === serviceId
//       );
//     }
    
//     // Handle location filtering from query params
//     const locationParams = {
//       province: searchParams?.province as string,
//       district: searchParams?.district as string,
//       municipality: searchParams?.municipality as string,
//       ward: searchParams?.ward as string,
//       street: searchParams?.street as string,
//       address: searchParams?.address as string,
//       filterType: searchParams?.filterType as string,
//     };
    

//     const enhancedData = await Promise.all(
//       filteredServices.map(async (ps) => {
//         try {
//           const [profile, serviceAreas] = await Promise.all([
//             fetchProfessionalProfile(ps.professional_id),
//             fetchProfessionalServiceAreas(ps.professional_id),
//           ]);
          
//           const serviceAreasDisplay = serviceAreas.length > 0
//             ? serviceAreas
//                 .map((area: any) => area.name)
//                 .slice(0, 3)
//                 .join(', ') + (serviceAreas.length > 3 ? '...' : '')
//             : 'No service areas listed';
          
//           return {
//             id: ps.id,
//             user_id: ps.professional.user_id,
//             professional_id: ps.professional_id,
//             service_id: ps.service_id,
//             service_name: ps.service?.name_en || 'Unknown Service',
//             service_description: ps.service?.description_en || '',
//             full_name: ps.professional.user.full_name,
//             profile_image_url: ps.professional.user.profile_image || '',
//             service_areas_display: serviceAreasDisplay,
//             all_prices: ps.prices || [],
//             is_minimum_price: ps.prices?.some((p: any) => p.is_minimum_price) || false,
//             all_skills: ps.professional.skill || 'N/A',
//             image: ps.service?.image || '',
//             service: ps.service,
//             service_areas_full: serviceAreas,
//             // Add the raw service areas for filtering
//             _service_areas: serviceAreas.map((area: any) => area.name),
//           };
//         } catch (error) {
//           console.error(`Error fetching data for professional ${ps.professional_id}:`, error);
//           return null;
//         }
//       })
//     );
    
//     let validData = enhancedData.filter(item => item !== null);
    
//     // Apply location filtering if location params exist
//     if (locationParams.filterType === 'address' && 
//         (locationParams.province || locationParams.district || 
//          locationParams.municipality || locationParams.address)) {
      
//       validData = validData.filter((professional) => {

//         const serviceAreas = professional._service_areas || [];
//         const allAreaNames = serviceAreas.map((area: string) => area.toLowerCase());
        

//         let matches = true;
        
//         if (locationParams.province) {
//           matches = matches && allAreaNames.some(area => 
//             area.includes(locationParams.province.toLowerCase())
//           );
//         }
        
//         if (locationParams.district) {
//           matches = matches && allAreaNames.some(area => 
//             area.includes(locationParams.district.toLowerCase())
//           );
//         }
        
//         if (locationParams.municipality) {
//           matches = matches && allAreaNames.some(area => 
//             area.includes(locationParams.municipality.toLowerCase())
//           );
//         }
        

//         if (locationParams.address) {
//           matches = matches && allAreaNames.some(area => 
//             area.includes(locationParams.address.toLowerCase())
//           );
//         }
        
//         return matches;
//       });
//     }
    
   
//     const uniqueProfessionals = Array.from(
//       new Map(validData.map(item => [item.professional_id, item])).values()
//     );
    

    
//     return (
//       <ServiceProfessionalsClient 
//         professionalsData={uniqueProfessionals}
//         serviceName={serviceName}
//       />
//     );
//   } catch (error) {
//     console.error('Error in ServiceProfessionalsSection:', error);
    
//     return (
//       <ServiceProfessionalsClient 
//         professionalsData={[]}
//         serviceName={serviceName}
//       />
//     );
//   }
// }


// app/services/[serviceId]/professionals/ssr/service-professionals-ssr.tsx
import { fetchProfessionalServices } from '@/lib/api/professional-services';
import { ServiceProfessionalsClient } from '../service-professionals-client';

interface ServiceProfessionalsSectionProps {
  serviceId: number;
  serviceName: string;
  searchParams?: { [key: string]: string | string[] | undefined };
}

export async function ServiceProfessionalsSection({
  serviceId,
  serviceName,
  searchParams = {},
}: ServiceProfessionalsSectionProps) {
  try {
    // SINGLE API CALL - Get all professional services at once
    console.log("Fetching professional services...");
    const professionalServicesData = await fetchProfessionalServices(1, 10000);
    
    if (!professionalServicesData?.professional_services) {
      return <ServiceProfessionalsClient professionalsData={[]} serviceName={serviceName} />;
    }

    let filteredServices = professionalServicesData.professional_services;
    console.log(`Total services fetched: ${filteredServices.length}`);

    const isSearchByServiceName = serviceId === 0;

    // Filter by service ID or search query
    if (isSearchByServiceName) {
      const serviceQuery = searchParams?.service as string || searchParams?.search as string;
      if (serviceQuery) {
        filteredServices = filteredServices.filter(ps => {
          const serviceName = ps.service?.name_en?.toLowerCase() || '';
          const query = serviceQuery.toLowerCase();
          return serviceName.includes(query);
        });
      }
    } else {
      filteredServices = filteredServices.filter(ps => ps.service_id === serviceId);
    }

    console.log(`Filtered services: ${filteredServices.length}`);

    // Handle location filtering from query params
    const locationParams = {
      province: searchParams?.province as string,
      district: searchParams?.district as string,
      municipality: searchParams?.municipality as string,
      ward: searchParams?.ward as string,
      street: searchParams?.street as string,
      address: searchParams?.address as string,
      filterType: searchParams?.filterType as string,
    };

    // Transform the data WITHOUT additional API calls
    // All data is already in the professionalServices response!
    const professionalsMap = new Map();

    filteredServices.forEach((ps: any) => {
      const profId = ps.professional_id;
      
      if (!professionalsMap.has(profId)) {
        // Create service areas display string from available data
        // Note: If service areas aren't in the response, you'll need to handle that
        const serviceAreas = ps.professional?.service_areas || [];
        const serviceAreasDisplay = serviceAreas.length > 0
          ? serviceAreas
              .map((area: any) => area.name)
              .slice(0, 3)
              .join(', ') + (serviceAreas.length > 3 ? '...' : '')
          : 'No service areas listed';

        professionalsMap.set(profId, {
          id: ps.id,
          user_id: ps.professional.user_id,
          professional_id: profId,
          service_id: ps.service_id,
          service_name: ps.service?.name_en || 'Unknown Service',
          service_description: ps.service?.description_en || '',
          full_name: ps.professional.user.full_name,
          profile_image_url: ps.professional.user.profile_image || '',
          service_areas_display: serviceAreasDisplay,
          all_prices: ps.prices || [],
          is_minimum_price: ps.prices?.some((p: any) => p.is_minimum_price) || false,
          all_skills: ps.professional.skill || 'N/A',
          image: ps.service?.image || '',
          service: ps.service,
          service_areas_full: serviceAreas,
          // For location filtering
          _service_areas: serviceAreas.map((area: any) => area.name),
          // Add all services this professional offers
          all_services: [ps.service],
        });
      } else {
        // If professional already exists, add this service to their list
        const existing = professionalsMap.get(profId);
        existing.all_services.push(ps.service);
        // Add prices if needed
        if (ps.prices) {
          existing.all_prices = [...existing.all_prices, ...ps.prices];
        }
      }
    });

    let validData = Array.from(professionalsMap.values());
    console.log(`Unique professionals: ${validData.length}`);

    // Apply location filtering if needed
    if (locationParams.filterType === 'address' && 
        (locationParams.province || locationParams.district || 
         locationParams.municipality || locationParams.address)) {
      
      validData = validData.filter((professional) => {
        const serviceAreas = professional._service_areas || [];
        const allAreaNames = serviceAreas.map((area: string) => area.toLowerCase());
        
        let matches = true;
        
        if (locationParams.province) {
          matches = matches && allAreaNames.some((area: string | string[]) => 
            area.includes(locationParams.province.toLowerCase())
          );
        }
        
        if (locationParams.district) {
          matches = matches && allAreaNames.some((area: string | string[]) => 
            area.includes(locationParams.district.toLowerCase())
          );
        }
        
        if (locationParams.municipality) {
          matches = matches && allAreaNames.some((area: string | string[]) => 
            area.includes(locationParams.municipality.toLowerCase())
          );
        }
        
        if (locationParams.address) {
          matches = matches && allAreaNames.some((area: string | string[]) => 
            area.includes(locationParams.address.toLowerCase())
          );
        }
        
        return matches;
      });
    }

    console.log(`Final professionals count: ${validData.length}`);

    return (
      <ServiceProfessionalsClient 
        professionalsData={validData}
        serviceName={serviceName}
      />
    );
  } catch (error) {
    console.error('Error in ServiceProfessionalsSection:', error);
    return (
      <ServiceProfessionalsClient 
        professionalsData={[]}
        serviceName={serviceName}
      />
    );
  }
}

import { fetchServices } from '@/lib/api/services';
import { ServicesClient } from '../services-section';

export async function ServicesSection() {
  //  SSR: Fetches data on SERVER
  const data = await fetchServices(1, 8);
  
  //  Pass the data to client component
  return <ServicesClient servicesData={data} />;
}


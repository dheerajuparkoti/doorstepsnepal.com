import { professionalApi } from '@/lib/api/professional';

export async function fetchTopProfessionals(limit: number = 8) {
  try {
    const res = await professionalApi.getTopProfessionals(limit);

    return {
      professionals: res.professionals,
      total: res.total_professionals,
    };
  } catch (error) {
    return {
      professionals: [],
      total: 0,
    };
  }
}
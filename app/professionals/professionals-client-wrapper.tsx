'use client';

import { ProfessionalsClient } from './professionals-client';

interface ProfessionalsClientWrapperProps {
  professionalsData: any[];
  isSingleProfessionalView?: boolean;
  professionalName?: string;
  specificProfessionalId?: number; // Add this prop
}

export function ProfessionalsClientWrapper({
  professionalsData,
  isSingleProfessionalView = false,
  professionalName,
  specificProfessionalId, // Add this prop
}: ProfessionalsClientWrapperProps) {
  return (
    <ProfessionalsClient 
      professionalsData={professionalsData}
      isSingleProfessionalView={isSingleProfessionalView}
      professionalName={professionalName}
      specificProfessionalId={specificProfessionalId} // Pass it through
    />
  );
}
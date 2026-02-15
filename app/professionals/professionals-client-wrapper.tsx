'use client';

import { ProfessionalsClient } from './professionals-client';

interface ProfessionalsClientWrapperProps {
  professionalsData: any[];
  isSingleProfessionalView?: boolean;
  professionalName?: string;
  specificProfessionalId?: number;
}

export function ProfessionalsClientWrapper({
  professionalsData,
  isSingleProfessionalView = false,
  professionalName,
  specificProfessionalId,
}: ProfessionalsClientWrapperProps) {
  return (
    <ProfessionalsClient 
      professionalsData={professionalsData}
      isSingleProfessionalView={isSingleProfessionalView}
      professionalName={professionalName}
      specificProfessionalId={specificProfessionalId} 
    />
  );
}
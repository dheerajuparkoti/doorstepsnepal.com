
'use client';

import { ProfessionalsClient } from './professionals-client';

interface ProfessionalsClientWrapperProps {
  professionalsData: any[];
  totalPages?: number;
  currentPage?: number;
  totalResults?: number;
  isSingleProfessionalView?: boolean;
  professionalName?: string;
  specificProfessionalId?: number;
}

export function ProfessionalsClientWrapper({
  professionalsData,
  totalPages,
  currentPage,
  totalResults,
  isSingleProfessionalView = false,
  professionalName,
  specificProfessionalId,
}: ProfessionalsClientWrapperProps) {
  return (
    <ProfessionalsClient 
      professionalsData={professionalsData}
      totalPages={totalPages}
      currentPage={currentPage}
      totalResults={totalResults}
      isSingleProfessionalView={isSingleProfessionalView}
      professionalName={professionalName}
      specificProfessionalId={specificProfessionalId} 
    />
  );
}
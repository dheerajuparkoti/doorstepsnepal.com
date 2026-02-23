// 'use client';

// import { ProfessionalsClient } from './professionals-client';

// interface ProfessionalsClientWrapperProps {
//   professionalsData: any[];
//   isSingleProfessionalView?: boolean;
//   professionalName?: string;
//   specificProfessionalId?: number;
// }

// export function ProfessionalsClientWrapper({
//   professionalsData,
//   isSingleProfessionalView = false,
//   professionalName,
//   specificProfessionalId,
// }: ProfessionalsClientWrapperProps) {
//   return (
//     <ProfessionalsClient 
//       professionalsData={professionalsData}
//       isSingleProfessionalView={isSingleProfessionalView}
//       professionalName={professionalName}
//       specificProfessionalId={specificProfessionalId} 
//     />
//   );
// }


// app/professionals/professionals-client-wrapper.tsx
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
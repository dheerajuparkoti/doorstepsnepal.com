// components/professional/sections/professional-about-tab.tsx
'use client';

import { useI18n } from '@/lib/i18n/context';
import type { ServiceArea } from '@/lib/data/service-areas';

interface ProfessionalAboutTabProps {
  fullName: string;
  profession: string;
  experience: string;
  serviceAreas: ServiceArea[];
}

export function ProfessionalAboutTab({
  fullName,
  profession,
  experience,
  serviceAreas,
}: ProfessionalAboutTabProps) {
  const { language } = useI18n();

  const professionSkills = profession.split('/').map(s => s.trim());
  const serviceAreaNames = serviceAreas.map(area => area.name);

  const aboutText = language === 'ne'
    ? `${fullName} लाई यस क्षेत्रमा ${experience} को अनुभव छ। उनीहरूले आफ्नो पेशागत यात्रामा धेरै ग्राहकहरूलाई सेवा प्रदान गरिसकेका छन्।`
    : `${fullName} has ${experience} of experience in this field. They have served many customers throughout their professional journey.`;

  return (
    <div className="p-4 space-y-6">
      {/* About */}
      <div>
        <h3 className="text-lg font-semibold mb-2">
          {language === 'ne' ? 'परिचय' : 'About'} {fullName.split(' ')[0]}
        </h3>
        <p className="text-muted-foreground leading-relaxed text-justify">
          {aboutText}
        </p>
      </div>

      {/* Skills */}
      {professionSkills.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">
            {language === 'ne' ? 'सीपहरू' : 'Skills'}
          </h3>
          <div className="flex flex-wrap gap-2">
            {professionSkills.map((skill, index) => (
              <span
                key={index}
                className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Service Areas */}
      {serviceAreaNames.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">
            {language === 'ne' ? 'सेवा क्षेत्रहरू' : 'Service Areas'}
          </h3>
          <div className="flex flex-wrap gap-2">
            {serviceAreaNames.map((area, index) => (
              <span
                key={index}
                className="px-4 py-1.5 bg-secondary/10 text-secondary rounded-full text-sm"
              >
                {area}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
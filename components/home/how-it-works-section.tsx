"use client";

import { useI18n } from "@/lib/i18n/context";
import { Search, UserCheck, CreditCard } from "lucide-react";

const steps = [
  {
    icon: Search,
    step: 1,
  },
  {
    icon: UserCheck,
    step: 2,
  },
  {
    icon: CreditCard,
    step: 3,
  },
];

export function HowItWorksSection() {
  const { t } = useI18n();

  const stepData = [
    {
      title: t.howItWorks.step1Title,
      description: t.howItWorks.step1Desc,
    },
    {
      title: t.howItWorks.step2Title,
      description: t.howItWorks.step2Desc,
    },
    {
      title: t.howItWorks.step3Title,
      description: t.howItWorks.step3Desc,
    },
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            {t.howItWorks.title}
          </h2>
        </div>

        {/* Steps */}
        <div className="relative mx-auto max-w-5xl">
          {/* Connecting Line - Desktop */}
          <div className="absolute left-0 right-0 top-16 hidden h-0.5 bg-border md:block" />

          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const data = stepData[index];
              return (
                <div key={step.step} className="relative text-center">
                  {/* Step Number Circle */}
                  <div className="relative mx-auto mb-6">
                    <div className="relative z-10 mx-auto flex h-32 w-32 items-center justify-center rounded-full border-4 border-primary/20 bg-background">
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Icon className="h-10 w-10" />
                      </div>
                    </div>
                    {/* Step Number Badge */}
                    <div className="absolute -right-2 -top-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground shadow-lg">
                      {step.step}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="mb-3 text-xl font-semibold text-foreground">
                    {data.title}
                  </h3>
                  <p className="text-muted-foreground">{data.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

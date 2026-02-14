'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  id: number;
  title: string;
  icon: React.ElementType;
  color: string;
}

interface ProgressStepperProps {
  steps: Step[];
  currentStep: number;
  completedSteps: boolean[];
  onStepClick: (step: number) => void;
}

export function ProgressStepper({ steps, currentStep, completedSteps, onStepClick }: ProgressStepperProps) {
  return (
    <div className="hidden md:block relative">
      {/* Background line */}
      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-800 -translate-y-1/2" />
      
      {/* Steps */}
      <div className="relative flex justify-between">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = completedSteps[index];
          const isCurrent = currentStep === index;
          const isClickable = index <= currentStep || completedSteps[index - 1];

          return (
            <motion.button
              key={step.id}
              whileHover={isClickable ? { scale: 1.05 } : {}}
              whileTap={isClickable ? { scale: 0.95 } : {}}
              onClick={() => isClickable && onStepClick(index)}
              className={cn(
                "relative flex flex-col items-center group",
                !isClickable && "opacity-50 cursor-not-allowed"
              )}
              disabled={!isClickable}
            >
              {/* Step circle */}
              <div className={cn(
                "relative z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300",
                isCompleted && "bg-green-500 text-white",
                isCurrent && !isCompleted && `bg-gradient-to-r ${step.color} text-white shadow-lg scale-110`,
                !isCompleted && !isCurrent && "bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700 text-gray-500",
                isClickable && !isCompleted && !isCurrent && "hover:border-primary hover:text-primary"
              )}>
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>

              {/* Step label */}
              <span className={cn(
                "mt-2 text-sm font-medium transition-colors",
                isCompleted && "text-green-500",
                isCurrent && "text-primary",
                !isCompleted && !isCurrent && "text-gray-500"
              )}>
                {step.title.charAt(0).toUpperCase() + step.title.slice(1).replace('_', ' ')}
              </span>

              {/* Hover effect */}
              {isClickable && !isCompleted && !isCurrent && (
                <div className="absolute inset-0 rounded-full bg-primary/5 scale-0 group-hover:scale-100 transition-transform" />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
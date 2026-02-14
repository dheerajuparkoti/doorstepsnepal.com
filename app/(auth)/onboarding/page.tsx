'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '@/lib/i18n/context';
import { useProfessionalStore } from '@/stores/professional-store';
import { useAddressStore } from '@/stores/address-store';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { 
  ArrowLeft,
  MapPin,
  Phone,
  CreditCard,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

// Components
import { ProgressStepper } from '@/components/professional/onboarding/first/progress-stepper';
import { StepLayout } from '@/components/professional/onboarding/first/step-layout';
import { AddressStep } from '@/components/professional/onboarding/first/address-step';
import { EmergencyStep } from '@/components/professional/onboarding/first/emergency-step';
import { SkillsPaymentStep } from '@/components/professional/onboarding/first/skills-payment-step';
import { BankDetailsDrawer } from '@/components/professional/onboarding/first/bank-details-drawer';
import ProfessionalVerificationPageOnboarding from '@/app/(auth)/onboarding/second/page'; 
import ProfessionalServiceAreasOnboarding from './complete/page';


// Hooks
import { useOnboardingForm } from '@/hooks/use-onboarding-form';
import { PaymentMethod } from '@/lib/data/professional';
import { ProtectedRoute } from '@/components/auth/protected-route';

const STEPS = [
  { 
    id: 0, 
    title: 'address', 
    icon: MapPin, 
    description: 'Add your permanent and temporary addresses',
    color: 'from-blue-500 to-blue-600'
  },
  { 
    id: 1, 
    title: 'emergency', 
    icon: Phone, 
    description: 'Emergency contact and referral information',
    color: 'from-amber-500 to-orange-600'
  },
  { 
    id: 2, 
    title: 'skills_payment', 
    icon: CreditCard, 
    description: 'Your skills and payment preferences',
    color: 'from-purple-500 to-pink-600'
  },
];

export default function ProfessionalOnboardingPage() {
  const { locale } = useI18n();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<boolean[]>([false, false, false]);
  const [showBankDrawer, setShowBankDrawer] = useState(false);
  const [professionalId, setProfessionalId] = useState<number | null>(null);
  const [showDocumentVerification, setShowDocumentVerification] = useState(false); 
  const [showServiceAreas, setShowServiceAreas] = useState(false);

  
  // Stores
  const { registerProfessional, patchProfile,isRegistering, error, clearError } = useProfessionalStore();
  const { addresses } = useAddressStore();

  // Form hook
  const {
    formData,
    updateFormData,
    validateStep,
    getStepData,
    isStepValid,
  } = useOnboardingForm();

  const userId = 178; // TODO: Get from auth

  useEffect(() => {
    if (error) {
      toast.error(
        locale === 'ne' ? 'दर्ता गर्न असफल' : 'Registration failed',
        { description: error }
      );
      clearError();
    }
  }, [error, locale, clearError]);

  // Check if bank details are needed when moving to next step
  const handleNext = async () => {
    const isValid = validateStep(currentStep, getStepData(currentStep));
    
    if (!isValid) {
      toast.warning(
        locale === 'ne' ? 'कृपया सबै आवश्यक जानकारी भर्नुहोस्' : 'Please fill all required fields'
      );
      return;
    }

    // If on step 0 (address step), register partial data
    if (currentStep === 0) {
      try {
        const partialData = {
          user_id: userId,
          addresses: addresses.map(addr => ({
            type: addr.type,
            province: addr.province,
            district: addr.district,
            municipality: addr.municipality,
            ward_no: addr.ward_no,
            street_address: addr.street_address || '',
          })),
        };

        // Register partial data and get professional ID
        const professional = await registerProfessional(partialData);
        
        if (professional?.id) {
          setProfessionalId(professional.id);
          toast.success(
            locale === 'ne' 
              ? 'प्रारम्भिक जानकारी सफलतापूर्वक दर्ता भयो' 
              : 'Initial information registered successfully'
          );
        }
      } catch (error) {
        console.error('Partial registration failed:', error);
        toast.error(
          locale === 'ne' 
            ? 'प्रारम्भिक जानकारी दर्ता गर्न असफल' 
            : 'Failed to register initial information'
        );
        return; // Don't proceed if partial registration fails
      }
    }

    // If on step 2 (skills & payment) and payment method is bank_transfer
    if (currentStep === 2 && formData.skillsPayment.payment_method === 'bank_transfer') {
      setShowBankDrawer(true);
      return;
    }

    proceedToNextStep();
  };

  const proceedToNextStep = () => {
    const newCompletedSteps = [...completedSteps];
    newCompletedSteps[currentStep] = true;
    setCompletedSteps(newCompletedSteps);

    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBankDetailsComplete = (bankData: any) => {
    updateFormData('skillsPayment', bankData);
    setShowBankDrawer(false);
    proceedToNextStep();
  };

  const handleSubmit = async () => {
    try {
      // Use the professionalId from partial registration if available
      const professionalData = {
        ...(professionalId && { id: professionalId }), // Include ID if we have it from partial registration
        user_id: userId,
        experience: 1,
        skill: formData.skillsPayment.skills.join(', '),
        refered_by: formData.emergency.referred_by === 'Friend' 
          ? formData.emergency.referrer_name 
          : formData.emergency.referred_by,
        payment_method: formData.skillsPayment.payment_method as PaymentMethod,
        ...(formData.skillsPayment.payment_method === 'bank_transfer' && {
          bank_account_number: formData.skillsPayment.bank_account_number,
          bank_branch_name: formData.skillsPayment.bank_branch_name,
          bank_name: formData.skillsPayment.bank_name,
          bank_account_holder_name: formData.skillsPayment.bank_account_holder_name,
        }),
        ...(['esewa', 'khalti', 'imepay'].includes(formData.skillsPayment.payment_method) && {
          phone_number: formData.skillsPayment.phone_number,
        }),
        ec_name: formData.emergency.ec_name,
        ec_relationship: formData.emergency.ec_relationship,
        ec_phone: formData.emergency.ec_phone,
        addresses: addresses.map(addr => ({
          type: addr.type,
          province: addr.province,
          district: addr.district,
          municipality: addr.municipality,
          ward_no: addr.ward_no,
          street_address: addr.street_address || '',
        })),
      };

      let professional;
      
 
      if (professionalId) {
        professional = await patchProfile(professionalId,professionalData);


        
      } else {
        
        professional = await registerProfessional(professionalData);
      }

      if (professional) {
        toast.success(
          locale === 'ne' 
            ? 'प्रोफेशनल खाता सफलतापूर्वक दर्ता भयो' 
            : 'Professional account registered successfully'
        );
        
        // Instead of redirecting to KYC, show document verification
        setShowDocumentVerification(true);
      }
    } catch (error) {
      console.error('Registration failed:', error);
      toast.error(
        locale === 'ne' 
          ? 'दर्ता गर्न असफल भयो' 
          : 'Registration failed'
      );
    }
  };

  // const handleDocumentNext = () => {
  //   // After documents are uploaded, redirect to KYC or next step
  //   router.push(`/professional/onboarding/kyc?professionalId=${professionalId}`);
  // };


  const handleDocumentNext = () => {
  // After documents are uploaded, show service areas page
  setShowDocumentVerification(false);
  setShowServiceAreas(true); // Add this new state
};

const handleDocumentSkip = () => {
  // If user skips documents, still go to service areas
  setShowDocumentVerification(false);
  setShowServiceAreas(true); // Add this new state
};

const handleServiceAreasComplete = () => {
  // After service areas and terms are completed, go to dashboard or success page
  toast.success(
    locale === 'ne' 
      ? 'प्रोफेशनल खाता सफलतापूर्वक पूरा भयो' 
      : 'Professional account completed successfully'
  );
  
  // Redirect to dashboard or success page
  setTimeout(() => {
    router.push('/dashboard');
  }, 1500);
};

  // const handleDocumentSkip = () => {
  //   // If user skips documents, still go to KYC
  //   router.push(`/professional/onboarding/kyc?professionalId=${professionalId}`);
  // };

  // If showing document verification, render that page
  if (showDocumentVerification && professionalId) {
    return (
      <ProfessionalVerificationPageOnboarding
    
        professionalId={professionalId}
        onNext={handleDocumentNext}
        onSkip={handleDocumentSkip}
      />
    );
  }

   if (showServiceAreas && professionalId) {
    return (
      <ProfessionalServiceAreasOnboarding
        professionalId={professionalId}
        onComplete={handleServiceAreasComplete}
      />
    );
  }


  const currentStepData = STEPS[currentStep];

  return (
  <ProtectedRoute requireProfessionalOnboarding={false}>
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:radial-gradient(ellipse_at_center,white,transparent)] dark:bg-grid-slate-800/20" />
      
      <div className="relative container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="rounded-full hover:bg-white/50 backdrop-blur-sm"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                {locale === 'ne' ? 'प्रोफेशनल खाता' : 'Professional Account'}
              </h1>
              <p className="text-muted-foreground">
                {locale === 'ne' 
                  ? 'आफ्नो व्यवसायिक यात्रा सुरु गर्नुहोस्' 
                  : 'Start your professional journey'}
              </p>
            </div>
          </div>

          {/* Progress indicator */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-1">
              {completedSteps.map((completed, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-all ${
                    completed 
                      ? 'bg-green-500' 
                      : idx === currentStep 
                        ? 'bg-primary w-4' 
                        : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {STEPS.length}
            </span>
          </div>
        </motion.div>

        {/* Progress Stepper */}
        <ProgressStepper
          steps={STEPS}
          currentStep={currentStep}
          completedSteps={completedSteps}
          onStepClick={setCurrentStep}
        />

        {/* Main Content */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Step Info Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-8 space-y-4">
              <div className={`p-6 rounded-2xl bg-gradient-to-br ${currentStepData.color} text-white shadow-xl`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <currentStepData.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm opacity-90">
                      {locale === 'ne' ? 'चरण' : 'Step'} {currentStep + 1}
                    </p>
                    <h2 className="text-xl font-bold">
                      {locale === 'ne' 
                        ? currentStepData.title === 'address' ? 'ठेगाना' :
                          currentStepData.title === 'emergency' ? 'आपतकालिन सम्पर्क' :
                          'कौशल र भुक्तानी'
                        : currentStepData.title === 'address' ? 'Address' :
                          currentStepData.title === 'emergency' ? 'Emergency Contact' :
                          'Skills & Payment'
                      }
                    </h2>
                  </div>
                </div>
                <p className="text-sm opacity-90">
                  {currentStepData.description}
                </p>
              </div>

              {/* Tips Card */}
              <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 shadow-lg border">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-amber-500 mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-2">
                      {locale === 'ne' ? 'सुझाव' : 'Pro Tip'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {currentStep === 0 && (locale === 'ne' 
                        ? 'सही ठेगाना जानकारीले सेवा छिटो पुग्न मद्दत गर्छ।'
                        : 'Accurate address helps services reach you faster.')}
                      {currentStep === 1 && (locale === 'ne'
                        ? 'आपतकालिन सम्पर्क जानकारी सुरक्षित राखिनेछ।'
                        : 'Emergency contact information is kept secure.')}
                      {currentStep === 2 && (locale === 'ne'
                        ? 'धेरै कौशलहरू थप्दा ग्राहक पाउने सम्भावना बढ्छ।'
                        : 'Adding more skills increases your chances of getting customers.')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Step Content */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <StepLayout
              title={
                locale === 'ne' 
                  ? currentStepData.title === 'address' ? 'आफ्नो ठेगाना जानकारी थप्नुहोस्' :
                     currentStepData.title === 'emergency' ? 'आपतकालिन सम्पर्क जानकारी' :
                     'आफ्नो कौशल र भुक्तानी विधि चयन गर्नुहोस्'
                  : currentStepData.title === 'address' ? 'Add your address information' :
                     currentStepData.title === 'emergency' ? 'Emergency contact details' :
                     'Select your skills and payment method'
              }
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {currentStep === 0 && (
                    <AddressStep 
                      initialData={formData.address}
                      onUpdate={(data) => updateFormData('address', data)}
                    />
                  )}
                  {currentStep === 1 && (
                    <EmergencyStep 
                      initialData={formData.emergency}
                      onUpdate={(data) => updateFormData('emergency', data)}
                    />
                  )}
                  {currentStep === 2 && (
                    <SkillsPaymentStep 
                      initialData={formData.skillsPayment}
                      onUpdate={(data) => updateFormData('skillsPayment', data)}
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === 0}
                  className="rounded-full px-8"
                >
                  {locale === 'ne' ? 'पछाडि' : 'Back'}
                </Button>
                
                <Button
                  onClick={handleNext}
                  disabled={isRegistering || !isStepValid(currentStep)}
                  className="rounded-full px-8 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                >
                  {isRegistering ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{locale === 'ne' ? 'पेश गर्दै...' : 'Submitting...'}</span>
                    </div>
                  ) : currentStep === STEPS.length - 1 ? (
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{locale === 'ne' ? 'पेश गर्नुहोस्' : 'Submit'}</span>
                    </div>
                  ) : (
                    <span>{locale === 'ne' ? 'अर्को' : 'Next'}</span>
                  )}
                </Button>
              </div>
            </StepLayout>
          </motion.div>
        </div>
      </div>

      {/* Bank Details Drawer */}
      <BankDetailsDrawer
        open={showBankDrawer}
        onClose={() => setShowBankDrawer(false)}
        onComplete={handleBankDetailsComplete}
        initialData={formData.skillsPayment}
      />
    </div>
     </ProtectedRoute>
  );
}
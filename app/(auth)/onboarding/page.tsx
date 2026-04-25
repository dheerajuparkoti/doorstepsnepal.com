'use client';

import { useState, useEffect, useRef } from 'react';
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
import { useAuth } from '@/lib/context/auth-context';
import { BankDetailsFormValues } from '@/lib/schemas/bank-details-schema';

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
  const { user, setMode } = useAuth(); 

  // Stores
  const { registerProfessional, patchProfile, isRegistering, error, clearError } = useProfessionalStore();
  const { addresses } = useAddressStore();

  // Form hook
  const {
    formData,
    updateFormData,
    validateStep,
    getStepData,
    isStepValid,
  } = useOnboardingForm();
  const formDataRef = useRef(formData);
  // Get userId from auth user
  const userId = user?.id;

  // Handle back button press
  useEffect(() => {
    const handlePopState = () => {
      setMode('customer');
      toast.info(
        locale === 'ne' 
          ? 'प्रोफेशनल दर्ता रद्द गरियो' 
          : 'Professional registration cancelled'
      );
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [setMode, locale]);

  useEffect(() => {
    if (error) {
      toast.error(
        locale === 'ne' ? 'दर्ता गर्न असफल' : 'Registration failed',
        { description: error }
      );
      clearError();
    }
  }, [error, locale, clearError]);

  // Check if user is authenticated
  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
  }, [user, router]);

  // Log form data for debugging
useEffect(() => {
  formDataRef.current = formData;
}, [formData]);


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
      if (!userId) {
        toast.error(
          locale === 'ne' 
            ? 'प्रयोगकर्ता प्रमाणित गर्न सकिएन' 
            : 'User not authenticated'
        );
        return;
      }
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
        return;
      }
    }

    // If on step 2 (skills & payment) and payment method is bank_transfer
    if (currentStep === 2) {
      const skillsPaymentData = formData.skillsPayment;
      
      // Check if bank details are missing when payment method is bank_transfer
      if (skillsPaymentData.payment_method === 'bank_transfer') {
        const hasBankDetails = skillsPaymentData.bank_account_number && 
                               skillsPaymentData.bank_account_holder_name && 
                               skillsPaymentData.bank_name && 
                               skillsPaymentData.bank_branch_name;
        
        if (!hasBankDetails) {
          setShowBankDrawer(true);
          return;
        }
      }
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

  const handleCustomBack = () => {
    setMode('customer');
    toast.info(
      locale === 'ne' 
        ? 'प्रोफेशनल दर्ता रद्द गरियो' 
        : 'Professional registration cancelled'
    );
    router.back();
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

// Update handleBankDetailsComplete to use the ref
const handleBankDetailsComplete = (bankData: BankDetailsFormValues) => {

  // Update form data with bank details
  const updatedSkillsPayment = {
    ...formDataRef.current.skillsPayment,
    bank_account_number: bankData.bank_account_number,
    bank_account_holder_name: bankData.bank_account_holder_name,
    bank_name: bankData.bank_name,
    bank_branch_name: bankData.bank_branch_name,
  };
  

  
  // Update the form data
  updateFormData('skillsPayment', updatedSkillsPayment);
  
  setShowBankDrawer(false);
  
  // Use the updated data directly instead of relying on state
  setTimeout(() => {
    // Now when we proceed, we'll use the data we just updated
    proceedToNextStep();
  }, 100);
};

// Update handleSubmit to use the ref
const handleSubmit = async () => {
  if (!userId) {
    toast.error(
      locale === 'ne' 
        ? 'प्रयोगकर्ता आईडी फेला परेन' 
        : 'User ID not found'
    );
    return;
  }
  
  try {
    // Use the ref to get the latest data
    const currentFormData = formDataRef.current;
    const skillsPaymentData = currentFormData.skillsPayment;
    
   

    const professionalData = {
      ...(professionalId && { id: professionalId }),
      user_id: userId,
      experience: 1,
      skill: skillsPaymentData.skills?.join(', ') || '',
      refered_by: currentFormData.emergency.referred_by === 'Friend' 
        ? currentFormData.emergency.referrer_name 
        : currentFormData.emergency.referred_by,
      payment_method: skillsPaymentData.payment_method as PaymentMethod,
      // Bank transfer details
      ...(skillsPaymentData.payment_method === 'bank_transfer' && {
        bank_account_number: skillsPaymentData.bank_account_number,
        bank_branch_name: skillsPaymentData.bank_branch_name,
        bank_name: skillsPaymentData.bank_name,
        bank_account_holder_name: skillsPaymentData.bank_account_holder_name,
      }),
      // Digital payment phone number
      ...(['esewa', 'khalti', 'imepay'].includes(skillsPaymentData.payment_method) && {
        phone_number: skillsPaymentData.phone_number,
      }),
      ec_name: currentFormData.emergency.ec_name,
      ec_relationship: currentFormData.emergency.ec_relationship,
      ec_phone: currentFormData.emergency.ec_phone,
      addresses: addresses.map(addr => ({
        type: addr.type,
        province: addr.province,
        district: addr.district,
        municipality: addr.municipality,
        ward_no: addr.ward_no,
        street_address: addr.street_address || '',
      })),
    };

    //console.log("FINAL professionalData being sent:", professionalData);

    let professional;
    
    if (professionalId) {
      professional = await patchProfile(professionalId, professionalData);
    } else {
      professional = await registerProfessional(professionalData);
    }

    if (professional) {
      toast.success(
        locale === 'ne' 
          ? 'प्रोफेशनल खाता सफलतापूर्वक दर्ता भयो' 
          : 'Professional account registered successfully'
      );
      
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

  const handleDocumentNext = () => {
    setShowDocumentVerification(false);
    setShowServiceAreas(true); 
  };

  const handleDocumentSkip = () => {
    setShowDocumentVerification(false);
    setShowServiceAreas(true); 
  };

  const handleServiceAreasComplete = () => {
    toast.success(
      locale === 'ne' 
        ? 'प्रोफेशनल खाता सफलतापूर्वक पूरा भयो' 
        : 'Professional account completed successfully'
    );
    
    setTimeout(() => {
      router.push('/dashboard');
    }, 1500);
  };

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
                onClick={handleCustomBack}
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
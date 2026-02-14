'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n/context';
import { useProfessionalStore } from '@/stores/professional-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import {
  Plus,
  X,
  RefreshCw,
  MapPin,
  Trash2,
  Loader2,
  Search,
  Check,
  AlertTriangle,
  Map,
  Building,
  Navigation,
  Globe,
  Save,
  Clock,
  Users,
  AlertCircle,
  ArrowRight,
  FileText,
  Shield,
  CheckCircle2,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

interface ProfessionalServiceAreasOnboardingProps {
  professionalId: number;
  onComplete: () => void;
}

// Maximum number of service areas allowed
const MAX_SERVICE_AREAS = 7;

// District data
const DISTRICT_DATA = {
  allDistricts: [
    'Bhaktapur',
    'Kathmandu',
    'Lalitpur',
  ],
  
  localLevelList: {
    'Kathmandu': [
      'Kirtipur Mun.',
      'Shankharapur Mun.',
      'Nagarjun Mun.',
      'Kageshwori Manahora Mun.',
      'Dakshinkali Mun.',
      'Budhanilakantha Mun.',
      'Tarakeshwor Mun.',
      'Kathmandu Met.',
      'Tokha Mun.',
      'Chandragiri Mun.',
      'Gokarneshwor Mun.'
    ],
    'Bhaktapur': [
      'Changunarayan Mun.',
      'Suryabinayak Mun.',
      'Bhaktapur Mun.',
      'Madhyapur Thimi Mun.'
    ],
    'Lalitpur': [
      'Bagmati Ru. Mun.',
      'Mahankal Ru. Mun.',
      'Konjyosom Ru. Mun.',
      'Lalitpur Met.',
      'Mahalaxmi Mun.',
      'Godawari Mun.'
    ],
  },
  
  // Ward numbers 1-32
  wards: Array.from({ length: 32 }, (_, i) => i + 1)
};

// Form validation schema for adding service area
const serviceAreaFormSchema = z.object({
  district: z.string().min(1, 'District is required'),
  municipality: z.string().min(1, 'Municipality is required'),
  ward: z.number().min(1).max(32).optional(),
});

type ServiceAreaFormValues = z.infer<typeof serviceAreaFormSchema>;

// Helper function to parse service area name
const parseServiceAreaName = (name: string) => {
  // Format: district-municipality-ward or district-municipality
  const parts = name.split('-');
  const district = parts[0];
  const municipality = parts[1]?.replace(/_/g, ' ') || '';
  const ward = parts.length > 2 ? parseInt(parts[2]) : null;
  
  return { district, municipality, ward };
};

// Helper function to format service area name
const formatServiceAreaName = (district: string, municipality: string, ward?: number) => {
  const formattedMunicipality = municipality.replace(/\s+/g, '_').replace(/[^\w.]/g, '');
  return ward 
    ? `${district}-${formattedMunicipality}-${ward}`
    : `${district}-${formattedMunicipality}`;
};

export default function ProfessionalServiceAreasOnboarding({ 
  professionalId, 
  onComplete 
}: ProfessionalServiceAreasOnboardingProps) {
  const { locale } = useI18n();
  const router = useRouter();
  
  const {
    serviceAreas,
    isLoading: isLoadingServiceAreas,
    isUpdatingServiceAreas,
    error,
    fetchServiceAreas,
    addServiceArea,
    removeServiceArea,
    clearError,
  } = useProfessionalStore();
  
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [districtSearch, setDistrictSearch] = useState('');
  const [municipalitySearch, setMunicipalitySearch] = useState('');
  const [selectedWards, setSelectedWards] = useState<number[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize form
  const form = useForm<ServiceAreaFormValues>({
    resolver: zodResolver(serviceAreaFormSchema),
    defaultValues: {
      district: '',
      municipality: '',
      ward: undefined,
    },
  });

  // Watch district to update municipalities
  const selectedDistrict = form.watch('district');

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchServiceAreas(professionalId);
      } catch (err) {
        // Error handled by store
      } finally {
        setIsInitialLoad(false);
      }
    };
    
    loadData();
  }, [professionalId]);

  useEffect(() => {
    if (error) {
      toast.error(
        locale === 'ne' ? 'त्रुटि' : 'Error',
        { description: error }
      );
      clearError();
    }
  }, [error]);

  // Filter districts based on search
  const filteredDistricts = useMemo(() => {
    if (!districtSearch.trim()) return DISTRICT_DATA.allDistricts;
    return DISTRICT_DATA.allDistricts.filter(district =>
      district.toLowerCase().includes(districtSearch.toLowerCase())
    );
  }, [districtSearch]);

  // Filter municipalities based on search
  const filteredMunicipalities = useMemo(() => {
    if (!selectedDistrict) return [];
    const municipalities = DISTRICT_DATA.localLevelList[selectedDistrict as keyof typeof DISTRICT_DATA.localLevelList] || [];
    
    if (!municipalitySearch.trim()) return municipalities;
    return municipalities.filter(municipality =>
      municipality.toLowerCase().includes(municipalitySearch.toLowerCase())
    );
  }, [selectedDistrict, municipalitySearch]);

  const handleAddServiceArea = async (data: ServiceAreaFormValues) => {
    try {
      if (serviceAreas.length >= MAX_SERVICE_AREAS) {
        toast.warning(
          locale === 'ne' ? 'सीमा पुग्यो' : 'Limit Reached',
          { 
            description: locale === 'ne'
              ? `तपाईं केवल ${MAX_SERVICE_AREAS} वटा सेवा क्षेत्रहरू मात्र थप्न सक्नुहुन्छ`
              : `You can only add up to ${MAX_SERVICE_AREAS} service areas`
          }
        );
        return;
      }

      // Check if already exists
      const newAreaName = formatServiceAreaName(data.district, data.municipality, data.ward);
      if (serviceAreas.some(area => area.name === newAreaName)) {
        toast.warning(
          locale === 'ne' ? 'चेतावनी' : 'Warning',
          { 
            description: locale === 'ne'
              ? 'यो सेवा क्षेत्र पहिले नै थपिएको छ'
              : 'This service area already exists'
          }
        );
        return;
      }

      await addServiceArea(
        professionalId,
        data.district,
        data.municipality,
        data.ward
      );

      toast.success(
        locale === 'ne' ? 'सफलता' : 'Success',
        { 
          description: locale === 'ne'
            ? 'सेवा क्षेत्र सफलतापूर्वक थपियो'
            : 'Service area added successfully'
        }
      );

      form.reset();
      setDistrictSearch('');
      setMunicipalitySearch('');
      setSelectedWards([]);
      setShowAddDialog(false);
    } catch (err) {
      // Error handled by store
    }
  };

  const handleRemoveServiceArea = async (serviceAreaId: number) => {
    try {
      await removeServiceArea(professionalId, serviceAreaId);
      
      toast.success(
        locale === 'ne' ? 'सफलता' : 'Success',
        { 
          description: locale === 'ne'
            ? 'सेवा क्षेत्र हटाइयो'
            : 'Service area removed successfully'
        }
      );
    } catch (err) {
      // Error handled by store
    }
  };

  const toggleWardSelection = (ward: number) => {
    if (selectedWards.includes(ward)) {
      setSelectedWards(selectedWards.filter(w => w !== ward));
    } else {
      setSelectedWards([...selectedWards, ward]);
    }
  };

  const handleComplete = async () => {
    if (serviceAreas.length === 0) {
      toast.warning(
        locale === 'ne' ? 'चेतावनी' : 'Warning',
        { 
          description: locale === 'ne'
            ? 'कृपया कम्तीमा एउटा सेवा क्षेत्र थप्नुहोस्'
            : 'Please add at least one service area'
        }
      );
      return;
    }

    if (!termsAccepted || !privacyAccepted) {
      toast.warning(
        locale === 'ne' ? 'चेतावनी' : 'Warning',
        { 
          description: locale === 'ne'
            ? 'कृपया नियम र सर्तहरू स्वीकार गर्नुहोस्'
            : 'Please accept the terms and conditions'
        }
      );
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call to update professional status
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success(
      locale === 'ne' ? 'सफलता' : 'Success',
      { 
        description: locale === 'ne'
          ? 'प्रोफेशनल खाता सफलतापूर्वक पूरा भयो'
          : 'Professional account completed successfully'
      }
    );
    
    setIsSubmitting(false);
    onComplete();
  };

  const getAreaStats = () => {
    const districts = new Set<string>();
    const municipalities = new Set<string>();
    let totalWards = 0;

    serviceAreas.forEach(area => {
      const parsed = parseServiceAreaName(area.name);
      districts.add(parsed.district);
      municipalities.add(parsed.municipality);
      if (parsed.ward) totalWards++;
    });

    return {
      totalDistricts: districts.size,
      totalMunicipalities: municipalities.size,
      totalWards,
    };
  };

  const areaStats = getAreaStats();

  if (isInitialLoad && isLoadingServiceAreas) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          <Skeleton className="h-10 w-64" />
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const hasServiceAreas = serviceAreas.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 py-8">
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:radial-gradient(ellipse_at_center,white,transparent)] dark:bg-grid-slate-800/20" />
      
      <div className="relative container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-2">
            {locale === 'ne' ? 'सेवा क्षेत्रहरू' : 'Service Areas'}
          </h1>
          <p className="text-muted-foreground">
            {locale === 'ne'
              ? 'तपाईंले सेवा प्रदान गर्ने क्षेत्रहरू चयन गर्नुहोस्'
              : 'Select areas where you will provide services'}
          </p>
        </motion.div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-500"
                style={{ width: hasServiceAreas ? '100%' : '50%' }}
              />
            </div>
            <span className="text-sm text-muted-foreground">
              {locale === 'ne' ? 'चरण ३/३' : 'Step 3/3'}
            </span>
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span className={hasServiceAreas ? 'text-primary font-medium' : ''}>
              {locale === 'ne' ? '✓ सेवा क्षेत्रहरू' : '✓ Service Areas'}
            </span>
            <span className={termsAccepted && privacyAccepted ? 'text-primary font-medium' : ''}>
              {locale === 'ne' ? 'नियम र सर्तहरू' : 'Terms & Conditions'}
            </span>
          </div>
        </div>

        <div className="space-y-6">
          {/* Current Service Areas Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle>
                      {locale === 'ne' ? 'तपाईंका सेवा क्षेत्रहरू' : 'Your Service Areas'}
                    </CardTitle>
                    <CardDescription>
                      {locale === 'ne'
                        ? `तपाईंले सेवा प्रदान गर्ने क्षेत्रहरू (${serviceAreas.length}/${MAX_SERVICE_AREAS})`
                        : `Areas where you provide services (${serviceAreas.length}/${MAX_SERVICE_AREAS})`}
                    </CardDescription>
                  </div>
                </div>
                <Badge variant={serviceAreas.length > 0 ? "default" : "outline"}>
                  {serviceAreas.length} {locale === 'ne' ? 'क्षेत्रहरू' : 'areas'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {/* Instructions */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">
                      {locale === 'ne' ? 'निर्देशन' : 'Instructions'}
                    </p>
                    <p className="text-sm text-blue-700 mt-1">
                      {locale === 'ne'
                        ? 'तपाईंले सेवा प्रदान गर्न चाहनुभएको जिल्ला, नगरपालिका र वडा छान्नुहोस्। तपाईं अधिकतम ७ वटा क्षेत्रहरू मात्र थप्न सक्नुहुन्छ।'
                        : 'Select the district, municipality, and ward where you want to provide services. You can add up to 7 areas maximum.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">
                    {locale === 'ne' ? 'सेवा क्षेत्र सीमा' : 'Service Area Limit'}
                  </span>
                  <span className="text-sm">
                    {serviceAreas.length}/{MAX_SERVICE_AREAS}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      serviceAreas.length >= MAX_SERVICE_AREAS
                        ? 'bg-red-600'
                        : serviceAreas.length >= MAX_SERVICE_AREAS * 0.8
                        ? 'bg-yellow-600'
                        : 'bg-green-600'
                    }`}
                    style={{ width: `${(serviceAreas.length / MAX_SERVICE_AREAS) * 100}%` }}
                  />
                </div>
              </div>

              {/* Service Areas List */}
              {serviceAreas.length === 0 ? (
                <div className="text-center py-8">
                  <Map className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    {locale === 'ne' ? 'कुनै सेवा क्षेत्र फेला परेन' : 'No Service Areas Found'}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {locale === 'ne'
                      ? 'कृपया सेवा क्षेत्रहरू थप्नुहोस्'
                      : 'Please add service areas to continue'}
                  </p>
                  <Button
                    onClick={() => setShowAddDialog(true)}
                    className="gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    {locale === 'ne' ? 'पहिलो सेवा क्षेत्र थप्नुहोस्' : 'Add First Service Area'}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {serviceAreas.map((area) => {
                      const { district, municipality, ward } = parseServiceAreaName(area.name);
                      return (
                        <div
                          key={area.id}
                          className="group relative border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <MapPin className="w-4 h-4 text-blue-500" />
                                <h3 className="font-semibold">{municipality}</h3>
                              </div>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 text-sm">
                                  <Building className="w-3 h-3 text-gray-500" />
                                  <span className="text-gray-600">{district}</span>
                                </div>
                                {ward && (
                                  <div className="flex items-center gap-2 text-sm">
                                    <Navigation className="w-3 h-3 text-gray-500" />
                                    <span className="text-gray-600">Ward {ward}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveServiceArea(area.id)}
                              disabled={isUpdatingServiceAreas}
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              {isUpdatingServiceAreas ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4 text-red-500 hover:text-red-700" />
                              )}
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Add Service Area Button */}
          {serviceAreas.length < MAX_SERVICE_AREAS && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-50 rounded-full">
                    <Plus className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">
                      {locale === 'ne' ? 'नयाँ सेवा क्षेत्र थप्नुहोस्' : 'Add New Service Area'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {locale === 'ne'
                        ? 'तपाईंले सेवा प्रदान गर्न चाहनुभएको क्षेत्र थप्नुहोस्'
                        : 'Add areas where you want to provide services'}
                    </p>
                  </div>
                  <Button onClick={() => setShowAddDialog(true)} className="gap-2">
                    <Plus className="w-4 h-4" />
                    {locale === 'ne' ? 'थप्नुहोस्' : 'Add'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Terms and Conditions Card */}
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <CardTitle>
                    {locale === 'ne' ? 'नियम र सर्तहरू' : 'Terms and Conditions'}
                  </CardTitle>
                  <CardDescription>
                    {locale === 'ne'
                      ? 'कृपया सेवा सुरु गर्नु अघि नियम र सर्तहरू स्वीकार गर्नुहोस्'
                      : 'Please accept the terms and conditions before proceeding'}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Terms Preview */}
              <div className="p-4 bg-gray-50 rounded-lg text-sm space-y-3 max-h-48 overflow-y-auto">
                <p className="font-medium">
                  {locale === 'ne' 
                    ? 'सेवा प्रदायक नियम र सर्तहरू'
                    : 'Service Provider Terms and Conditions'}
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>
                      {locale === 'ne'
                        ? 'तपाईंले सेवा प्रदान गर्दा व्यावसायिक आचरण पालना गर्नुपर्नेछ'
                        : 'You must maintain professional conduct while providing services'}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>
                      {locale === 'ne'
                        ? 'ग्राहकको व्यक्तिगत जानकारी गोप्य राख्नुपर्नेछ'
                        : 'Customer information must be kept confidential'}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>
                      {locale === 'ne'
                        ? 'सेवा शुल्क प्लेटफर्मको नीति अनुसार हुनेछ'
                        : 'Service fees will be as per platform policy'}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>
                      {locale === 'ne'
                        ? 'तपाईंले आफ्नो प्रोफाइल जानकारी सधैं अद्यावधिक राख्नुपर्नेछ'
                        : 'You must keep your profile information updated'}
                    </span>
                  </li>
                </ul>
              </div>

              {/* Checkboxes */}
              <div className="space-y-3 pt-2">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="terms"
                    checked={termsAccepted}
                    onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm leading-relaxed cursor-pointer"
                  >
                    {locale === 'ne'
                      ? 'मैले सबै नियम र सर्तहरू पढेको छु र स्वीकार गर्दछु'
                      : 'I have read and accept all terms and conditions'}
                    <button
                      type="button"
                      className="text-primary hover:underline ml-1"
                      onClick={() => window.open('/terms', '_blank')}
                    >
                      {locale === 'ne' ? '(पूरा पढ्नुहोस्)' : '(Read full)'}
                    </button>
                  </label>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="privacy"
                    checked={privacyAccepted}
                    onCheckedChange={(checked) => setPrivacyAccepted(checked as boolean)}
                  />
                  <label
                    htmlFor="privacy"
                    className="text-sm leading-relaxed cursor-pointer"
                  >
                    {locale === 'ne'
                      ? 'मैले गोपनीयता नीति पढेको छु र स्वीकार गर्दछु'
                      : 'I have read and accept the privacy policy'}
                    <button
                      type="button"
                      className="text-primary hover:underline ml-1"
                      onClick={() => window.open('/privacy', '_blank')}
                    >
                      {locale === 'ne' ? '(पूरा पढ्नुहोस्)' : '(Read full)'}
                    </button>
                  </label>
                </div>
              </div>

              {/* Info Alert */}
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-blue-600 mt-0.5" />
                  <p className="text-xs text-blue-700">
                    {locale === 'ne'
                      ? 'तपाईंको जानकारी सुरक्षित छ। हामी तपाईंको डाटा कहिल्यै तेस्रो पक्षसँग साझा गर्दैनौं।'
                      : 'Your information is secure. We never share your data with third parties.'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Summary */}
          {serviceAreas.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {areaStats.totalDistricts}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {locale === 'ne' ? 'जिल्ला' : 'Districts'}
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {areaStats.totalMunicipalities}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {locale === 'ne' ? 'नगरपालिका' : 'Municipalities'}
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">
                      {areaStats.totalWards}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {locale === 'ne' ? 'वडा' : 'Wards'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Complete Button */}
          <div className="flex justify-end pt-6 border-t">
            <Button
              size="lg"
              onClick={handleComplete}
              disabled={
                isSubmitting || 
                serviceAreas.length === 0 || 
                !termsAccepted || 
                !privacyAccepted
              }
              className="min-w-[250px] bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {locale === 'ne' ? 'प्रक्रिया हुदैछ...' : 'Processing...'}
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  {locale === 'ne' ? 'प्रोफेशनल खाता सक्रिय गर्नुहोस्' : 'Activate Professional Account'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Add Service Area Dialog */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {locale === 'ne' ? 'सेवा क्षेत्र छान्नुहोस्' : 'Select Service Area'}
              </DialogTitle>
              <DialogDescription>
                {locale === 'ne'
                  ? 'जिल्ला, नगरपालिका र वडा छान्नुहोस्'
                  : 'Select district, municipality, and ward'}
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleAddServiceArea)} className="space-y-4">
                {/* District Selection */}
                <FormField
                  control={form.control}
                  name="district"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {locale === 'ne' ? 'जिल्ला' : 'District'} *
                      </FormLabel>
                      <div className="relative">
                        <FormControl>
                          <div>
                            <Input
                              placeholder={locale === 'ne' ? 'जिल्ला खोज्नुहोस्...' : 'Search district...'}
                              value={districtSearch}
                              onChange={(e) => setDistrictSearch(e.target.value)}
                              className="mb-2"
                            />
                            <Select
                              onValueChange={(value) => {
                                field.onChange(value);
                                setDistrictSearch('');
                                form.setValue('municipality', '');
                                setMunicipalitySearch('');
                                setSelectedWards([]);
                              }}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={locale === 'ne' ? 'जिल्ला छान्नुहोस्' : 'Select district'} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {filteredDistricts.map((district) => (
                                  <SelectItem key={district} value={district}>
                                    {district}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Municipality Selection */}
                <FormField
                  control={form.control}
                  name="municipality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {locale === 'ne' ? 'नगरपालिका' : 'Municipality'} *
                      </FormLabel>
                      <div className="relative">
                        <FormControl>
                          <div>
                            <Input
                              placeholder={locale === 'ne' ? 'नगरपालिका खोज्नुहोस्...' : 'Search municipality...'}
                              value={municipalitySearch}
                              onChange={(e) => setMunicipalitySearch(e.target.value)}
                              disabled={!selectedDistrict}
                              className="mb-2"
                            />
                            <Select
                              onValueChange={(value) => {
                                field.onChange(value);
                                setMunicipalitySearch('');
                                setSelectedWards([]);
                              }}
                              defaultValue={field.value}
                              disabled={!selectedDistrict}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={locale === 'ne' ? 'नगरपालिका छान्नुहोस्' : 'Select municipality'} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {filteredMunicipalities.map((municipality) => (
                                  <SelectItem key={municipality} value={municipality}>
                                    {municipality}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </FormControl>
                      </div>
                      <FormDescription>
                        {!selectedDistrict ? (
                          locale === 'ne'
                            ? 'जिल्ला छानेपछि मात्र नगरपालिका छान्न सकिन्छ'
                            : 'Municipality can only be selected after choosing district'
                        ) : (
                          locale === 'ne'
                            ? `${selectedDistrict} जिल्लाका नगरपालिकाहरू`
                            : `Municipalities in ${selectedDistrict} district`
                        )}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Ward Selection (Optional) */}
                <FormField
                  control={form.control}
                  name="ward"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {locale === 'ne' ? 'वडा (वैकल्पिक)' : 'Ward (Optional)'}
                      </FormLabel>
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium">
                            {locale === 'ne' ? 'वडा छान्नुहोस्' : 'Select Ward'}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedWards([]);
                              field.onChange(undefined);
                            }}
                          >
                            {locale === 'ne' ? 'सबै हटाउनुहोस्' : 'Clear all'}
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-6 gap-2">
                          {DISTRICT_DATA.wards.map((ward) => (
                            <Button
                              key={ward}
                              type="button"
                              variant={selectedWards.includes(ward) ? "default" : "outline"}
                              size="sm"
                              onClick={() => {
                                toggleWardSelection(ward);
                                field.onChange(ward);
                              }}
                              className="h-8"
                            >
                              {ward}
                              {selectedWards.includes(ward) && (
                                <Check className="w-3 h-3 ml-1" />
                              )}
                            </Button>
                          ))}
                        </div>
                        
                        <FormDescription className="mt-3">
                          {locale === 'ne'
                            ? 'तपाईं एक वा बढी वडाहरू छान्न सक्नुहुन्छ (वैकल्पिक)'
                            : 'You can select one or multiple wards (optional)'}
                        </FormDescription>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowAddDialog(false);
                      form.reset();
                      setDistrictSearch('');
                      setMunicipalitySearch('');
                      setSelectedWards([]);
                    }}
                    disabled={isUpdatingServiceAreas}
                  >
                    {locale === 'ne' ? 'रद्द गर्नुहोस्' : 'Cancel'}
                  </Button>
                  <Button
                    type="submit"
                    disabled={isUpdatingServiceAreas || serviceAreas.length >= MAX_SERVICE_AREAS}
                  >
                    {isUpdatingServiceAreas ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {locale === 'ne' ? 'थपिदै...' : 'Adding...'}
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        {locale === 'ne' ? 'सेवा क्षेत्र थप्नुहोस्' : 'Add Service Area'}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
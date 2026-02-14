'use client';

import { useState, useEffect, useMemo } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { useProfessionalStore } from '@/stores/professional-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';
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

// Mock professional ID - in real app, get from auth or params
const MOCK_PROFESSIONAL_ID = 24;

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

export default function ProfessionalServiceAreasPage() {
  const { locale } = useI18n();
  const {
    profile,
    serviceAreas,
    isLoading: isLoadingProfile,
    isLoadingServiceAreas,
    isUpdatingServiceAreas,
    error,
    fetchProfile,
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
        // Load profile and service areas
        await Promise.all([
          fetchProfile(MOCK_PROFESSIONAL_ID),
          fetchServiceAreas(MOCK_PROFESSIONAL_ID),
        ]);
      } catch (err) {
        // Error handled by store
      } finally {
        setIsInitialLoad(false);
      }
    };
    
    loadData();
  }, []);

  useEffect(() => {
    if (error) {
      toast({
        title: locale === 'ne' ? 'त्रुटि' : 'Error',
        description: error,
        variant: 'destructive',
      });
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
        toast({
          title: locale === 'ne' ? 'सीमा पुग्यो' : 'Limit Reached',
          description: locale === 'ne'
            ? `तपाईं केवल ${MAX_SERVICE_AREAS} वटा सेवा क्षेत्रहरू मात्र थप्न सक्नुहुन्छ`
            : `You can only add up to ${MAX_SERVICE_AREAS} service areas`,
          variant: 'destructive',
        });
        return;
      }

      // Check if already exists
      const newAreaName = formatServiceAreaName(data.district, data.municipality, data.ward);
      if (serviceAreas.some(area => area.name === newAreaName)) {
        toast({
          title: locale === 'ne' ? 'चेतावनी' : 'Warning',
          description: locale === 'ne'
            ? 'यो सेवा क्षेत्र पहिले नै थपिएको छ'
            : 'This service area already exists',
          variant: 'destructive',
        });
        return;
      }

      await addServiceArea(
        MOCK_PROFESSIONAL_ID,
        data.district,
        data.municipality,
        data.ward
      );

      toast({
        title: locale === 'ne' ? 'सफलता' : 'Success',
        description: locale === 'ne'
          ? 'सेवा क्षेत्र सफलतापूर्वक थपियो'
          : 'Service area added successfully',
      });

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
      await removeServiceArea(MOCK_PROFESSIONAL_ID, serviceAreaId);
      
      toast({
        title: locale === 'ne' ? 'सफलता' : 'Success',
        description: locale === 'ne'
          ? 'सेवा क्षेत्र हटाइयो'
          : 'Service area removed successfully',
      });
    } catch (err) {
      // Error handled by store
    }
  };

  const handleRefresh = async () => {
    try {
      await fetchServiceAreas(MOCK_PROFESSIONAL_ID);
      toast({
        title: locale === 'ne' ? 'ताजा पारियो' : 'Refreshed',
        description: locale === 'ne'
          ? 'सेवा क्षेत्रहरू ताजा पारियो'
          : 'Service areas refreshed successfully',
      });
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

  const isLoading = isLoadingProfile || isLoadingServiceAreas;
  
  if (isInitialLoad && isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <Skeleton className="h-10 w-64" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const areaStats = getAreaStats();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {locale === 'ne' ? 'सेवा क्षेत्रहरू' : 'Service Areas'}
            </h1>
            <p className="text-muted-foreground">
              {locale === 'ne'
                ? 'तपाईंले सेवा प्रदान गर्ने क्षेत्रहरू व्यवस्थापन गर्नुहोस्'
                : 'Manage areas where you provide services'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isLoadingServiceAreas}
              className="gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingServiceAreas ? 'animate-spin' : ''}`} />
              {locale === 'ne' ? 'ताजा पार्नुहोस्' : 'Refresh'}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Current Service Areas */}
        <div className="lg:col-span-2 space-y-6">
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
                      {locale === 'ne' ? 'वर्तमान सेवा क्षेत्रहरू' : 'Current Service Areas'}
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
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {locale === 'ne'
                    ? `तपाईं ${MAX_SERVICE_AREAS - serviceAreas.length} क्षेत्रहरू थप्न सक्नुहुन्छ`
                    : `You can add ${MAX_SERVICE_AREAS - serviceAreas.length} more areas`}
                </p>
              </div>

              <Separator className="my-4" />

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
                      : 'Please add service areas to get started'}
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

          {/* Add Service Area Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <Plus className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <CardTitle>
                    {locale === 'ne' ? 'नयाँ सेवा क्षेत्र थप्नुहोस्' : 'Add New Service Area'}
                  </CardTitle>
                  <CardDescription>
                    {locale === 'ne'
                      ? 'तपाईंले सेवा प्रदान गर्न चाहनुभएको क्षेत्र थप्नुहोस्'
                      : 'Add areas where you want to provide services'}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <div className="flex-1">
                  <div className="relative">
                    <Input
                      placeholder={
                        serviceAreas.length >= MAX_SERVICE_AREAS
                          ? locale === 'ne'
                            ? 'सेवा क्षेत्र सीमा पुग्यो'
                            : 'Service area limit reached'
                          : locale === 'ne'
                          ? 'सेवा क्षेत्र थप्न क्लिक गर्नुहोस्...'
                          : 'Click to add service area...'
                      }
                      readOnly
                      disabled={serviceAreas.length >= MAX_SERVICE_AREAS}
                      onClick={() => setShowAddDialog(true)}
                      className="cursor-pointer"
                    />
                    <Plus className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>

                <Button
                  onClick={() => setShowAddDialog(true)}
                  disabled={serviceAreas.length >= MAX_SERVICE_AREAS}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  {locale === 'ne' ? 'थप्नुहोस्' : 'Add'}
                </Button>
              </div>

              {/* Service Area Limit Warning */}
              {serviceAreas.length >= MAX_SERVICE_AREAS && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mt-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-800">
                        {locale === 'ne' ? 'सेवा क्षेत्र सीमा' : 'Service Area Limit Reached'}
                      </p>
                      <p className="text-sm text-yellow-700 mt-1">
                        {locale === 'ne'
                          ? 'तपाईंले अधिकतम ७ सेवा क्षेत्रहरू मात्र थप्न सक्नुहुन्छ। नयाँ क्षेत्र थप्न पहिला केही हटाउनुहोस्।'
                          : 'You can only add up to 7 service areas. Remove some areas to add new ones.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Stats & Actions */}
        <div className="space-y-6">
          {/* Stats Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 rounded-lg">
                  <Globe className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <CardTitle>
                    {locale === 'ne' ? 'सेवा क्षेत्र तथ्याङ्क' : 'Service Area Statistics'}
                  </CardTitle>
                  <CardDescription>
                    {locale === 'ne'
                      ? 'तपाईंका सेवा क्षेत्रहरूको विश्लेषण'
                      : 'Analysis of your service areas'}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-700">
                      {serviceAreas.length}
                    </div>
                    <div className="text-sm text-blue-600">
                      {locale === 'ne' ? 'क्षेत्रहरू' : 'Areas'}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-700">
                      {MAX_SERVICE_AREAS - serviceAreas.length}
                    </div>
                    <div className="text-sm text-green-600">
                      {locale === 'ne' ? 'थप्न सकिने' : 'Available'}
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Building className="w-4 h-4 text-gray-500" />
                    <h4 className="font-medium">
                      {locale === 'ne' ? 'जिल्ला अनुसार' : 'By District'}
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {Array.from(
                      new Set(serviceAreas.map(area => parseServiceAreaName(area.name).district))
                    ).map((district) => {
                      const count = serviceAreas.filter(
                        area => parseServiceAreaName(area.name).district === district
                      ).length;
                      return (
                        <div key={district} className="flex items-center justify-between">
                          <span className="text-sm">{district}</span>
                          <Badge variant="outline">{count}</Badge>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center">
                      <div className="text-lg font-bold">{areaStats.totalDistricts}</div>
                      <div className="text-xs text-muted-foreground">
                        {locale === 'ne' ? 'जिल्ला' : 'Districts'}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">{areaStats.totalMunicipalities}</div>
                      <div className="text-xs text-muted-foreground">
                        {locale === 'ne' ? 'नगरपालिका' : 'Municipalities'}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">{areaStats.totalWards}</div>
                      <div className="text-xs text-muted-foreground">
                        {locale === 'ne' ? 'वडा' : 'Wards'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-50 rounded-lg">
                  <MapPin className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <CardTitle>
                    {locale === 'ne' ? 'द्रुत कार्यहरू' : 'Quick Actions'}
                  </CardTitle>
                  <CardDescription>
                    {locale === 'ne'
                      ? 'सेवा क्षेत्रहरू व्यवस्थापन गर्ने विकल्पहरू'
                      : 'Options to manage your service areas'}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={() => setShowAddDialog(true)}
                disabled={serviceAreas.length >= MAX_SERVICE_AREAS}
              >
                <Plus className="w-4 h-4" />
                {locale === 'ne' ? 'नयाँ क्षेत्र थप्नुहोस्' : 'Add New Area'}
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={handleRefresh}
                disabled={isLoadingServiceAreas}
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingServiceAreas ? 'animate-spin' : ''}`} />
                {locale === 'ne' ? 'ताजा पार्नुहोस्' : 'Refresh List'}
              </Button>

              {serviceAreas.length > 0 && (
                <Button
                  variant="destructive"
                  className="w-full justify-start gap-2"
                  onClick={() => {
                    if (confirm(
                      locale === 'ne'
                        ? 'के तपाईं सबै सेवा क्षेत्रहरू हटाउन चाहनुहुन्छ?'
                        : 'Are you sure you want to remove all service areas?'
                    )) {
                      // Remove all service areas
                      Promise.all(
                        serviceAreas.map(area => 
                          removeServiceArea(MOCK_PROFESSIONAL_ID, area.id)
                        )
                      ).catch(err => {
                        // Error handled by store
                      });
                    }
                  }}
                  disabled={isUpdatingServiceAreas}
                >
                  <Trash2 className="w-4 h-4" />
                  {locale === 'ne' ? 'सबै क्षेत्र हटाउनुहोस्' : 'Remove All Areas'}
                </Button>
              )}

              {/* Tips */}
              <div className="p-4 bg-gray-50 rounded-lg mt-4">
                <h4 className="font-medium mb-2">
                  {locale === 'ne' ? 'सुझावहरू' : 'Tips'}
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li className="flex items-start gap-2">
                    <Check className="w-3 h-3 mt-0.5 text-green-600 flex-shrink-0" />
                    <span>
                      {locale === 'ne'
                        ? 'तपाईं सजिलै पुग्न सक्ने नजिकका क्षेत्रहरू छान्नुहोस्'
                        : 'Choose nearby areas you can easily reach'}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3 h-3 mt-0.5 text-green-600 flex-shrink-0" />
                    <span>
                      {locale === 'ne'
                        ? 'विशिष्ट वडा छान्नुहोस् भने ग्राहकहरूले तपाईंलाई फेला पार्न सजिलो हुन्छ'
                        : 'Specifying wards helps customers find you easily'}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3 h-3 mt-0.5 text-green-600 flex-shrink-0" />
                    <span>
                      {locale === 'ne'
                        ? 'तपाईंको सेवाका लागि बढी माग भएका क्षेत्रहरू छान्नुहोस्'
                        : 'Choose areas with high demand for your services'}
                    </span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Quick Add Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Clock className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">
                    {locale === 'ne' ? 'द्रुत थप्ने विकल्पहरू' : 'Quick Add Options'}
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start text-left"
                onClick={() => {
                  form.setValue('district', 'Kathmandu');
                  form.setValue('municipality', 'Kathmandu Met.');
                  setShowAddDialog(true);
                }}
                disabled={serviceAreas.length >= MAX_SERVICE_AREAS}
              >
                <div className="flex-1">
                  <div className="font-medium">Kathmandu Metropolitan</div>
                  <div className="text-xs text-muted-foreground">
                    {locale === 'ne' ? 'काठमाडौं महानगरपालिका' : 'Kathmandu Metropolitan'}
                  </div>
                </div>
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start text-left"
                onClick={() => {
                  form.setValue('district', 'Lalitpur');
                  form.setValue('municipality', 'Lalitpur Met.');
                  setShowAddDialog(true);
                }}
                disabled={serviceAreas.length >= MAX_SERVICE_AREAS}
              >
                <div className="flex-1">
                  <div className="font-medium">Lalitpur Metropolitan</div>
                  <div className="text-xs text-muted-foreground">
                    {locale === 'ne' ? 'ललितपुर महानगरपालिका' : 'Lalitpur Metropolitan'}
                  </div>
                </div>
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start text-left"
                onClick={() => {
                  form.setValue('district', 'Bhaktapur');
                  form.setValue('municipality', 'Bhaktapur Mun.');
                  setShowAddDialog(true);
                }}
                disabled={serviceAreas.length >= MAX_SERVICE_AREAS}
              >
                <div className="flex-1">
                  <div className="font-medium">Bhaktapur Municipality</div>
                  <div className="text-xs text-muted-foreground">
                    {locale === 'ne' ? 'भक्तपुर नगरपालिका' : 'Bhaktapur Municipality'}
                  </div>
                </div>
              </Button>
            </CardContent>
          </Card>
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
  );
}
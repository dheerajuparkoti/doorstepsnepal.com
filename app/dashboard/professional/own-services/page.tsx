
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  fetchServicesByProfessionalId,
  fetchPriceUnits,
  fetchQualityTypes,
  createPrice,
  updatePrice,
  deletePrice,
  createProfessionalService,
  fetchPrices
} from '@/lib/api/professional-services';
import { ProfessionalService, ProfessionalServicePrice } from '@/lib/data/professional-services';
import { PendingChange, getMyPendingChanges, formatPendingPrice } from '@/lib/api/pending-changes';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
  Loader2,
  Image as ImageIcon,
  ShieldCheck,
  Clock,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PriceUnit, QualityType } from '@/lib/data/professional-services';
import Image from 'next/image';
import { useAuth } from '@/lib/context/auth-context';
import { useI18n } from '@/lib/i18n/context';

export default function ProfessionalServicesChoosePage() {
  const { t, language } = useI18n();
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const {user} = useAuth();

  const professionalId = user?.professional_id ?? 0;
  const [services, setServices] = useState<ProfessionalService[]>([]);
  const [loading, setLoading] = useState(true);
  const [priceUnits, setPriceUnits] = useState<PriceUnit[]>([]);
  const [qualityTypes, setQualityTypes] = useState<QualityType[]>([]);
  const [pricePendingChanges, setPricePendingChanges] = useState<PendingChange[]>([]);

  // Modal states
  const [priceModalOpen, setPriceModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ProfessionalService | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<ProfessionalServicePrice | null>(null);

  // Form states
  const [price, setPrice] = useState('');
  const [discountName, setDiscountName] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState('');
  const [selectedPriceUnitId, setSelectedPriceUnitId] = useState<number | null>(null);
  const [selectedQualityTypeId, setSelectedQualityTypeId] = useState<number | null>(null);
  const [discountIsActive, setDiscountIsActive] = useState(false);
  const [isMinimumPrice, setIsMinimumPrice] = useState(false);
  const [hasWarranty, setHasWarranty] = useState(false);
  const [warrantyDuration, setWarrantyDuration] = useState('');
  const [warrantyUnit, setWarrantyUnit] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const getLocalizedText = (en: string, ne: string) => {
    return language === 'ne' ? ne : en;
  };

  useEffect(() => {
    if (professionalId) {
      loadData();
      loadDropdowns();
      loadPendingChanges();
    }
  }, [professionalId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const servicesData = await fetchServicesByProfessionalId(professionalId);
      setServices(servicesData);
    } catch (error) {
      toast({
        title: getLocalizedText('Error', 'त्रुटि'),
        description: getLocalizedText('Failed to load services', 'सेवाहरू लोड गर्न असफल'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadPendingChanges = async () => {
    try {
      const all = await getMyPendingChanges();
      setPricePendingChanges(
        all.filter(c => c.entity_type === 'service_price' && c.status === 'pending')
      );
    } catch {
      // silently ignore — pending badges are non-critical
    }
  };

 const loadDropdowns = async () => {
    try {
      const [units, types] = await Promise.all([
        fetchPriceUnits(),
        fetchQualityTypes()
      ]);
      setPriceUnits(units);
      setQualityTypes(types);
    } catch (error) {
      console.error('Error loading dropdowns:', error);
      toast({
        title: getLocalizedText('Error', 'त्रुटि'),
        description: getLocalizedText('Failed to load dropdown data', 'ड्रपडाउन डाटा लोड गर्न असफल'),
        variant: 'destructive',
      });
    }
  };

  // Returns a pending change for an existing price (update or delete)
  const getPendingForPrice = (priceId: number) =>
    pricePendingChanges.find(
      c => c.entity_id === priceId && (c.field_name === 'update' || c.field_name === 'delete')
    ) ?? null;

  // Returns a pending create change for a given professional service
  const getPendingCreateForService = (professionalServiceId: number) =>
    pricePendingChanges.find(
      c => c.entity_id === professionalServiceId && c.field_name === 'create'
    ) ?? null;

  const handleOpenPriceModal = (service: ProfessionalService, price?: ProfessionalServicePrice) => {
    setSelectedService(service);
    setSelectedPrice(price || null);

    if (price) {
      setPrice(price.price.toString());
      setDiscountName(price.discount_name || '');
      setDiscountPercentage(price.discount_percentage.toString());
      setSelectedPriceUnitId(price.price_unit_id);
      setSelectedQualityTypeId(price.quality_type_id);
      setDiscountIsActive(price.discount_is_active);
      setIsMinimumPrice(price.is_minimum_price);
      setHasWarranty(price.has_warranty || false);
      setWarrantyDuration(price.warranty_duration?.toString() || '');
      setWarrantyUnit(price.warranty_unit || null);
    } else {
      resetForm();
    }

    setPriceModalOpen(true);
  };

  const resetForm = () => {
    setPrice('');
    setDiscountName('');
    setDiscountPercentage('');
    setSelectedPriceUnitId(null);
    setSelectedQualityTypeId(null);
    setDiscountIsActive(false);
    setIsMinimumPrice(false);
    setHasWarranty(false);
    setWarrantyDuration('');
    setWarrantyUnit(null);
  };

  const handleSavePrice = async () => {
    if (!selectedService || !selectedPriceUnitId || !selectedQualityTypeId || !price) {
      toast({
        title: getLocalizedText('Validation Error', 'मान्यता त्रुटि'),
        description: getLocalizedText('Please fill all required fields', 'कृपया सबै आवश्यक फिल्डहरू भर्नुहोस्'),
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    try {
      const priceData = {
        professional_service_id: selectedService.id,
        price_unit_id: selectedPriceUnitId,
        quality_type_id: selectedQualityTypeId,
        price: Number(price),
        discount_percentage: Number(discountPercentage) || 0,
        discount_name: discountName,
        discount_is_active: discountIsActive,
        is_minimum_price: isMinimumPrice,
        has_warranty: hasWarranty,
        warranty_duration: hasWarranty && warrantyDuration ? Number(warrantyDuration) : null,
        warranty_unit: hasWarranty ? warrantyUnit : null,
      };

      if (selectedPrice) {
        await updatePrice(selectedPrice.id, priceData);
        toast({
          title: getLocalizedText('Submitted for Approval', 'अनुमोदनको लागि पेश गरियो'),
          description: getLocalizedText(
            'Price update submitted for admin approval',
            'मूल्य अद्यावधिक प्रशासक अनुमोदनको लागि पेश गरियो'
          ),
        });
      } else {
        await createPrice(priceData);
        toast({
          title: getLocalizedText('Submitted for Approval', 'अनुमोदनको लागि पेश गरियो'),
          description: getLocalizedText(
            'New price submitted for admin approval',
            'नयाँ मूल्य प्रशासक अनुमोदनको लागि पेश गरियो'
          ),
        });
      }

      setPriceModalOpen(false);
      resetForm();
      await loadPendingChanges();
    } catch (error: any) {
      const detail = error?.response?.data?.detail || error?.message;
      toast({
        title: getLocalizedText('Error', 'त्रुटि'),
        description: detail || getLocalizedText('Failed to submit price change', 'मूल्य परिवर्तन पेश गर्न असफल'),
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePrice = async (price: ProfessionalServicePrice) => {
    setSelectedPrice(price);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedPrice) return;

    try {
      await deletePrice(selectedPrice.id);
      toast({
        title: getLocalizedText('Submitted for Approval', 'अनुमोदनको लागि पेश गरियो'),
        description: getLocalizedText(
          'Price deletion submitted for admin approval',
          'मूल्य मेटाउने अनुरोध प्रशासक अनुमोदनको लागि पेश गरियो'
        ),
      });
      await loadPendingChanges();
    } catch (error: any) {
      const detail = error?.response?.data?.detail || error?.message;
      toast({
        title: getLocalizedText('Error', 'त्रुटि'),
        description: detail || getLocalizedText('Failed to submit deletion request', 'मेटाउने अनुरोध पेश गर्न असफल'),
        variant: 'destructive',
      });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedPrice(null);
    }
  };

  const calculateDiscountedPrice = (price: ProfessionalServicePrice) => {
    const originalPrice = price.price;
    if (price.discount_is_active && price.discount_percentage > 0) {
      return originalPrice - (originalPrice * price.discount_percentage / 100);
    }
    return originalPrice;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(language === 'ne' ? 'ne-NP' : 'en-NP', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {getLocalizedText('Your Services', 'तपाईंको सेवाहरू')}
            </h1>
            <p className="text-muted-foreground">
              {getLocalizedText(
                'Manage prices for your offered services',
                'तपाईंले प्रदान गर्नुभएको सेवाहरूको मूल्य व्यवस्थापन गर्नुहोस्'
              )}
            </p>
          </div>
        </div>
        <Button onClick={() => router.push(`/dashboard/professional/own-services/browseable?professionalId=${professionalId}`)}>
          <Plus className="mr-2 h-4 w-4" />
          {getLocalizedText('Add New Services', 'नयाँ सेवाहरू थप्नुहोस्')}
        </Button>
      </div>

      {services.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                <ImageIcon className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">
                {getLocalizedText('No services added yet', 'अहिलेसम्म कुनै सेवा थपिएको छैन')}
              </h3>
              <p className="text-muted-foreground mb-6">
                {getLocalizedText(
                  'Start by adding services you want to offer',
                  'तपाईंले प्रदान गर्न चाहनुभएको सेवाहरू थपेर सुरु गर्नुहोस्'
                )}
              </p>
              <Button onClick={() => router.push(`/dashboard/professional/own-services/browseable?professionalId=${professionalId}`)}>
                <Plus className="mr-2 h-4 w-4" />
                {getLocalizedText('Browse Services', 'सेवाहरू ब्राउज गर्नुहोस्')}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Accordion type="multiple" className="space-y-4">
          {services.map((service) => {
            const pendingCreate = getPendingCreateForService(service.id);

            return (
              <Card key={service.id}>
                <AccordionItem value={service.id.toString()} className="border-0">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <div className="flex items-start gap-4 text-left">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted">
                        {service.service.image ? (
                          <Image
                            src={service.service.image}
                            alt={service.service.name_en}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">
                          {language === 'ne' ? service.service.name_np : service.service.name_en}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">
                            {getLocalizedText('Service ID', 'सेवा आईडी')}: {service.service_id}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <CardContent className="pt-0">
                      {service.prices.length > 0 ? (
                        <div className="space-y-2">
                          {service.prices.map((priceItem) => {
                            const discountedPrice = calculateDiscountedPrice(priceItem);
                            const hasDiscount = priceItem.discount_is_active && priceItem.discount_percentage > 0;
                            const pendingChange = getPendingForPrice(priceItem.id);

                            return (
                              <div key={priceItem.id} className="rounded-lg overflow-hidden border">
                                {pendingChange && (
                                  <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-800">
                                    <Clock className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" />
                                    <span className="text-xs text-amber-700 dark:text-amber-400">
                                      {pendingChange.field_name === 'delete'
                                        ? getLocalizedText('Pending deletion — awaiting admin approval', 'मेटाउने अनुरोध — प्रशासक अनुमोदन पर्खँदै')
                                        : getLocalizedText(
                                            `Pending update: ${formatPendingPrice(pendingChange.new_value)}`,
                                            `अद्यावधिक पर्खँदै: ${formatPendingPrice(pendingChange.new_value)}`
                                          )
                                      }
                                    </span>
                                  </div>
                                )}
                                <div
                                  className={`flex items-center justify-between p-4 ${
                                    hasDiscount ? 'bg-primary/5' : 'bg-muted/30'
                                  }`}
                                >
                                  <div>
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="font-semibold text-lg">
                                        {formatCurrency(discountedPrice)}
                                      </span>
                                      {hasDiscount && (
                                        <>
                                          <span className="text-muted-foreground line-through text-sm">
                                            {formatCurrency(priceItem.price)}
                                          </span>
                                          <Badge variant="secondary" className="ml-2">
                                            {priceItem.discount_name} ({priceItem.discount_percentage}%)
                                          </Badge>
                                        </>
                                      )}
                                      {priceItem.is_minimum_price && (
                                        <Badge variant="outline" className="ml-2">
                                          {getLocalizedText('Minimum Price', 'न्यूनतम मूल्य')}
                                        </Badge>
                                      )}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                      {priceItem.price_unit.name} | {priceItem.quality_type.name}
                                    </div>
                                    {priceItem.has_warranty && (
                                      <div className="flex items-center gap-1 mt-1 text-xs text-primary font-medium">
                                        <ShieldCheck className="h-3.5 w-3.5" />
                                        {priceItem.warranty_duration} {priceItem.warranty_unit} {getLocalizedText('warranty', 'वारेन्टी')}
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleOpenPriceModal(service, priceItem)}
                                      disabled={!!pendingChange}
                                      title={pendingChange ? getLocalizedText('A change is already pending approval', 'परिवर्तन अनुमोदन पर्खँदैछ') : undefined}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleDeletePrice(priceItem)}
                                      disabled={!!pendingChange}
                                      title={pendingChange ? getLocalizedText('A change is already pending approval', 'परिवर्तन अनुमोदन पर्खँदैछ') : undefined}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-4 text-muted-foreground">
                          {getLocalizedText('No prices set for this service', 'यस सेवाको लागि कुनै मूल्य सेट गरिएको छैन')}
                        </div>
                      )}

                      {/* Pending create indicator */}
                      {pendingCreate && (
                        <div className="flex items-center gap-2 mt-3 px-4 py-2 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
                          <Clock className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" />
                          <span className="text-xs text-amber-700 dark:text-amber-400">
                            {getLocalizedText(
                              `New price pending approval: ${formatPendingPrice(pendingCreate.new_value)}`,
                              `नयाँ मूल्य अनुमोदन पर्खँदैछ: ${formatPendingPrice(pendingCreate.new_value)}`
                            )}
                          </span>
                        </div>
                      )}

                      <Button
                        variant="ghost"
                        className="w-full mt-4"
                        onClick={() => handleOpenPriceModal(service)}
                        disabled={!!pendingCreate}
                        title={pendingCreate ? getLocalizedText('A new price is already pending approval', 'नयाँ मूल्य अनुमोदन पर्खँदैछ') : undefined}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        {getLocalizedText('Add New Price', 'नयाँ मूल्य थप्नुहोस्')}
                      </Button>
                    </CardContent>
                  </AccordionContent>
                </AccordionItem>
              </Card>
            );
          })}
        </Accordion>
      )}

      {/* Price Modal */}
      <Dialog open={priceModalOpen} onOpenChange={setPriceModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {selectedPrice
                ? getLocalizedText('Edit Price', 'मूल्य सम्पादन गर्नुहोस्')
                : getLocalizedText('Add New Price', 'नयाँ मूल्य थप्नुहोस्')
              }
            </DialogTitle>
            <DialogDescription>
              {selectedService && (language === 'ne'
                ? selectedService.service.name_np
                : selectedService.service.name_en
              )}
              <span className="block text-xs text-amber-600 mt-1">
                {getLocalizedText(
                  'Changes require admin approval before taking effect.',
                  'परिवर्तनहरू लागू हुनु अघि प्रशासक अनुमोदन आवश्यक छ।'
                )}
              </span>
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="price">
                {getLocalizedText('Price', 'मूल्य')} *
              </Label>
              <Input
                id="price"
                type="number"
                value={price}
                 onChange={(e) => {
      const val = e.target.value;
      if (val.length <= 8) {
        setPrice(val);
      }
    }}
     min="1"
    step="1"
                placeholder={getLocalizedText('Enter price', 'मूल्य प्रविष्ट गर्नुहोस्')}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="minimum-price">
                {getLocalizedText('Minimum Price', 'न्यूनतम मूल्य')}
              </Label>
              <Switch
                id="minimum-price"
                checked={isMinimumPrice}
                onCheckedChange={setIsMinimumPrice}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="price-unit">
                {getLocalizedText('Price Unit', 'मूल्य एकाइ')} *
              </Label>
              <Select
                value={selectedPriceUnitId?.toString()}
                onValueChange={(value) => setSelectedPriceUnitId(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={getLocalizedText('Select price unit', 'मूल्य एकाइ चयन गर्नुहोस्')} />
                </SelectTrigger>
                <SelectContent>
                  {priceUnits.map((unit) => (
                    <SelectItem key={unit.id} value={unit.id.toString()}>
                      {unit.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="quality-type">
                {getLocalizedText('Quality Type', 'गुणस्तर प्रकार')} *
              </Label>
              <Select
                value={selectedQualityTypeId?.toString()}
                onValueChange={(value) => setSelectedQualityTypeId(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={getLocalizedText('Select quality type', 'गुणस्तर प्रकार चयन गर्नुहोस्')} />
                </SelectTrigger>
                <SelectContent>
                  {qualityTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="discount-name">
                {getLocalizedText('Discount Name', 'छुटको नाम')}
              </Label>
              <Input
                id="discount-name"
                value={discountName}
             onChange={(e) => {
    const val = e.target.value;
    if (/^[a-zA-Z0-9 ]*$/.test(val) && val.length <= 50) {
      setDiscountName(val);
    }
  }}
  placeholder={getLocalizedText('e.g., Summer Sale', 'जस्तै, ग्रीष्मकालीन बिक्री')}
  maxLength={50}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="discount-percentage">
                {getLocalizedText('Discount Percentage', 'छुट प्रतिशत')}
              </Label>
              <Input
                id="discount-percentage"
                type="number"
                value={discountPercentage}
                 onChange={(e) => {
      const val = e.target.value;
      if (val.length <= 2) {
       setDiscountPercentage(e.target.value)}
      }
                 }
                placeholder="0"
                min="0"
                max="100"
                maxLength={1}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="discount-active">
                {getLocalizedText('Activate Discount', 'छुट सक्रिय गर्नुहोस्')}
              </Label>
              <Switch
                id="discount-active"
                checked={discountIsActive}
                onCheckedChange={setDiscountIsActive}
              />
            </div>

            {/* Warranty */}
            <div className="flex items-center justify-between">
              <Label htmlFor="has-warranty" className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                {getLocalizedText('Has Warranty', 'वारेन्टी छ')}
              </Label>
              <Switch
                id="has-warranty"
                checked={hasWarranty}
                onCheckedChange={setHasWarranty}
              />
            </div>

            {hasWarranty && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="warranty-duration">
                    {getLocalizedText('Warranty Duration', 'वारेन्टी अवधि')} *
                  </Label>
                  <Input
                    id="warranty-duration"
                    type="number"
                    value={warrantyDuration}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val.length <= 2) setWarrantyDuration(val);
                    }}
                    placeholder={getLocalizedText('e.g., 6', 'जस्तै, ६')}
                    min="1"
                    max="99"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="warranty-unit">
                    {getLocalizedText('Warranty Unit', 'वारेन्टी एकाइ')} *
                  </Label>
                  <Select
                    value={warrantyUnit ?? undefined}
                    onValueChange={setWarrantyUnit}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={getLocalizedText('Select unit', 'एकाइ चयन गर्नुहोस्')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="days">{getLocalizedText('Days', 'दिन')}</SelectItem>
                      <SelectItem value="months">{getLocalizedText('Months', 'महिना')}</SelectItem>
                      <SelectItem value="years">{getLocalizedText('Years', 'वर्ष')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPriceModalOpen(false)}
              disabled={submitting}
            >
              {getLocalizedText('Cancel', 'रद्द गर्नुहोस्')}
            </Button>
            <Button onClick={handleSavePrice} disabled={submitting}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {selectedPrice
                ? getLocalizedText('Submit for Approval', 'अनुमोदनको लागि पेश गर्नुहोस्')
                : getLocalizedText('Submit for Approval', 'अनुमोदनको लागि पेश गर्नुहोस्')
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {getLocalizedText('Request Price Removal', 'मूल्य हटाउने अनुरोध')}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {getLocalizedText(
                'This will submit a deletion request for admin approval. The price will be removed once approved.',
                'यसले प्रशासक अनुमोदनको लागि मेटाउने अनुरोध पेश गर्नेछ। अनुमोदन भएपछि मूल्य हटाइनेछ।'
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedPrice(null)}>
              {getLocalizedText('Cancel', 'रद्द गर्नुहोस्')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {getLocalizedText('Submit Request', 'अनुरोध पेश गर्नुहोस्')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

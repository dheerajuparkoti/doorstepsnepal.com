// 'use client';

// import { useState, useEffect } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import {
//   fetchServicesByProfessionalId,
//   fetchPriceUnits,
//   fetchQualityTypes,
//   createPrice,
//   updatePrice,
//   deletePrice,
//   createProfessionalService,
//   fetchPrices
// } from '@/lib/api/professional-services';
// import { ProfessionalService, ProfessionalServicePrice } from '@/lib/data/professional-services';
// import { 
//   Card, 
//   CardContent, 
//   CardHeader, 
//   CardTitle,
//   CardDescription 
// } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Switch } from '@/components/ui/switch';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
//   DialogDescription,
// } from '@/components/ui/dialog';
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from '@/components/ui/alert-dialog';
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from '@/components/ui/accordion';
// import { Badge } from '@/components/ui/badge';
// import { Skeleton } from '@/components/ui/skeleton';
// import { 
//   Plus, 
//   Edit, 
//   Trash2, 
//   ArrowLeft,
//   Loader2,
//   Image as ImageIcon
// } from 'lucide-react';
// import { useToast } from '@/hooks/use-toast';
// import { PriceUnit, QualityType } from '@/lib/data/professional-services';
// import Image from 'next/image';
// import { useAuth } from '@/lib/context/auth-context';

// export default function ProfessionalServicesChoosePage() {
//   const params = useParams();
//   const router = useRouter();
//   const { toast } = useToast();
//   const {user} = useAuth();
  
//   // const professionalId = Number(params.professionalId);
//   const professionalId = user?.professional_id ?? 0;
//   const [services, setServices] = useState<ProfessionalService[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [priceUnits, setPriceUnits] = useState<PriceUnit[]>([]);
//   const [qualityTypes, setQualityTypes] = useState<QualityType[]>([]);
  
//   // Modal states
//   const [priceModalOpen, setPriceModalOpen] = useState(false);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [selectedService, setSelectedService] = useState<ProfessionalService | null>(null);
//   const [selectedPrice, setSelectedPrice] = useState<ProfessionalServicePrice | null>(null);
  
//   // Form states
//   const [price, setPrice] = useState('');
//   const [discountName, setDiscountName] = useState('');
//   const [discountPercentage, setDiscountPercentage] = useState('');
//   const [selectedPriceUnitId, setSelectedPriceUnitId] = useState<number | null>(null);
//   const [selectedQualityTypeId, setSelectedQualityTypeId] = useState<number | null>(null);
//   const [discountIsActive, setDiscountIsActive] = useState(false);
//   const [isMinimumPrice, setIsMinimumPrice] = useState(false);
//   const [submitting, setSubmitting] = useState(false);

//   useEffect(() => {
//     if (professionalId) {
//       loadData();
//       loadDropdowns();
//     }
//   }, [professionalId]);

//   const loadData = async () => {
//     setLoading(true);
//     try {
//       const servicesData = await fetchServicesByProfessionalId(professionalId);
//       setServices(servicesData);
//     } catch (error) {
//       toast({
//         title: 'Error',
//         description: 'Failed to load services',
//         variant: 'destructive',
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//  const loadDropdowns = async () => {
//     try {
//       const [units, types] = await Promise.all([
//         fetchPriceUnits(),
//         fetchQualityTypes()
//       ]);
//       setPriceUnits(units);
//       setQualityTypes(types);
//     } catch (error) {
//       console.error('Error loading dropdowns:', error);
//       toast({
//         title: 'Error',
//         description: 'Failed to load dropdown data',
//         variant: 'destructive',
//       });
//     }
//   };

  


//   const handleOpenPriceModal = (service: ProfessionalService, price?: ProfessionalServicePrice) => {
//     setSelectedService(service);
//     setSelectedPrice(price || null);
    
//     if (price) {
//       setPrice(price.price.toString());
//       setDiscountName(price.discount_name || '');
//       setDiscountPercentage(price.discount_percentage.toString());
//       setSelectedPriceUnitId(price.price_unit_id);
//       setSelectedQualityTypeId(price.quality_type_id);
//       setDiscountIsActive(price.discount_is_active);
//       setIsMinimumPrice(price.is_minimum_price);
//     } else {
//       resetForm();
//     }
    
//     setPriceModalOpen(true);
//   };

//   const resetForm = () => {
//     setPrice('');
//     setDiscountName('');
//     setDiscountPercentage('');
//     setSelectedPriceUnitId(null);
//     setSelectedQualityTypeId(null);
//     setDiscountIsActive(false);
//     setIsMinimumPrice(false);
//   };

//   const handleSavePrice = async () => {
//     if (!selectedService || !selectedPriceUnitId || !selectedQualityTypeId || !price) {
//       toast({
//         title: 'Validation Error',
//         description: 'Please fill all required fields',
//         variant: 'destructive',
//       });
//       return;
//     }

//     setSubmitting(true);
//     try {
//       const priceData = {
//         professional_service_id: selectedService.id,
//         price_unit_id: selectedPriceUnitId,
//         quality_type_id: selectedQualityTypeId,
//         price: Number(price),
//         discount_percentage: Number(discountPercentage) || 0,
//         discount_name: discountName,
//         discount_is_active: discountIsActive,
//         is_minimum_price: isMinimumPrice,
//       };

//       if (selectedPrice) {
//         await updatePrice(selectedPrice.id, priceData);
//         toast({
//           title: 'Success',
//           description: 'Price updated successfully',
//         });
//       } else {
//         await createPrice(priceData);
//         toast({
//           title: 'Success',
//           description: 'Price added successfully',
//         });
//       }

//       setPriceModalOpen(false);
//       resetForm();
//       loadData(); // Refresh the list
//     } catch (error) {
//       toast({
//         title: 'Error',
//         description: 'Failed to save price',
//         variant: 'destructive',
//       });
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleDeletePrice = async (price: ProfessionalServicePrice) => {
//     setSelectedPrice(price);
//     setDeleteDialogOpen(true);
//   };

//   const confirmDelete = async () => {
//     if (!selectedPrice) return;

//     try {
//       await deletePrice(selectedPrice.id);
//       toast({
//         title: 'Success',
//         description: 'Price removed successfully',
//       });
//       loadData(); // Refresh the list
//     } catch (error) {
//       toast({
//         title: 'Error',
//         description: 'Failed to delete price',
//         variant: 'destructive',
//       });
//     } finally {
//       setDeleteDialogOpen(false);
//       setSelectedPrice(null);
//     }
//   };

//   const calculateDiscountedPrice = (price: ProfessionalServicePrice) => {
//     const originalPrice = price.price;
//     if (price.discount_is_active && price.discount_percentage > 0) {
//       return originalPrice - (originalPrice * price.discount_percentage / 100);
//     }
//     return originalPrice;
//   };

//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat('en-NP', {
//       style: 'currency',
//       currency: 'NPR',
//       minimumFractionDigits: 0,
//     }).format(amount);
//   };

//   if (loading) {
//     return (
//       <div className="container mx-auto py-6">
//         <div className="flex items-center justify-between mb-6">
//           <Skeleton className="h-10 w-48" />
//           <Skeleton className="h-10 w-32" />
//         </div>
//         <div className="space-y-4">
//           {[1, 2, 3].map((i) => (
//             <Skeleton key={i} className="h-32 w-full" />
//           ))}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto py-6">
//       <div className="flex items-center justify-between mb-6">
//         <div className="flex items-center gap-4">
//           {/* <Button
//             variant="outline"
//             size="icon"
//             onClick={() => router.back()}
//           >
//             <ArrowLeft className="h-4 w-4" />
//           </Button> */}
//           <div>
//             <h1 className="text-3xl font-bold tracking-tight">Your Services</h1>
//             <p className="text-muted-foreground">
//               Manage prices for your offered services
//             </p>
//           </div>
//         </div>
//         <Button onClick={() => router.push(`/dashboard/professional/own-services/browseable?professionalId=${professionalId}`)}>
//           <Plus className="mr-2 h-4 w-4" />
//           Add New Services
//         </Button>
//       </div>

//       {services.length === 0 ? (
//         <Card>
//           <CardContent className="pt-6">
//             <div className="text-center py-12">
//               <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
//                 <ImageIcon className="h-12 w-12 text-muted-foreground" />
//               </div>
//               <h3 className="text-lg font-medium mb-2">No services added yet</h3>
//               <p className="text-muted-foreground mb-6">
//                 Start by adding services you want to offer
//               </p>
//               <Button onClick={() => router.push(`/dashboard/professional/own-services/browseable?professionalId=${professionalId}`)}>
//                 <Plus className="mr-2 h-4 w-4" />
//                 Browse Services
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       ) : (
//         <Accordion type="multiple" className="space-y-4">
//           {services.map((service) => (
//             <Card key={service.id}>
//               <AccordionItem value={service.id.toString()} className="border-0">
//                 <AccordionTrigger className="px-6 py-4 hover:no-underline">
//                   <div className="flex items-start gap-4 text-left">
//                     <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted">
//                       {service.service.image ? (
//                         <Image
//                           src={service.service.image}
//                           alt={service.service.name_en}
//                           fill
//                           className="object-cover"
//                         />
//                       ) : (
//                         <div className="w-full h-full flex items-center justify-center">
//                           <ImageIcon className="h-8 w-8 text-muted-foreground" />
//                         </div>
//                       )}
//                     </div>
//                     <div className="flex-1">
//                       <h3 className="font-semibold text-lg">
//                         {service.service.name_en}
//                       </h3>
//                       <div className="flex items-center gap-2 mt-1">
//                         <Badge variant="outline">
//                           Service ID: {service.service_id}
//                         </Badge>
//                       </div>
//                     </div>
//                   </div>
//                 </AccordionTrigger>
//                 <AccordionContent>
//                   <CardContent className="pt-0">
//                     {service.prices.length > 0 ? (
//                       <div className="space-y-2">
//                         {service.prices.map((price) => {
//                           const discountedPrice = calculateDiscountedPrice(price);
//                           const hasDiscount = price.discount_is_active && price.discount_percentage > 0;
                          
//                           return (
//                             <div
//                               key={price.id}
//                               className={`flex items-center justify-between p-4 rounded-lg ${
//                                 hasDiscount ? 'bg-primary/5' : 'bg-muted/30'
//                               }`}
//                             >
//                               <div>
//                                 <div className="flex items-center gap-2 mb-1">
//                                   <span className="font-semibold text-lg">
//                                     {formatCurrency(discountedPrice)}
//                                   </span>
//                                   {hasDiscount && (
//                                     <>
//                                       <span className="text-muted-foreground line-through text-sm">
//                                         {formatCurrency(price.price)}
//                                       </span>
//                                       <Badge variant="secondary" className="ml-2">
//                                         {price.discount_name} ({price.discount_percentage}%)
//                                       </Badge>
//                                     </>
//                                   )}
//                                   {price.is_minimum_price && (
//                                     <Badge variant="outline" className="ml-2">
//                                       Minimum Price
//                                     </Badge>
//                                   )}
//                                 </div>
//                                 <div className="text-sm text-muted-foreground">
//                                   {price.price_unit.name} | {price.quality_type.name}
//                                 </div>
//                               </div>
//                               <div className="flex items-center gap-2">
//                                 <Button
//                                   variant="outline"
//                                   size="sm"
//                                   onClick={() => handleOpenPriceModal(service, price)}
//                                 >
//                                   <Edit className="h-4 w-4" />
//                                 </Button>
//                                 <Button
//                                   variant="outline"
//                                   size="sm"
//                                   onClick={() => handleDeletePrice(price)}
//                                 >
//                                   <Trash2 className="h-4 w-4" />
//                                 </Button>
//                               </div>
//                             </div>
//                           );
//                         })}
//                       </div>
//                     ) : (
//                       <div className="text-center py-4 text-muted-foreground">
//                         No prices set for this service
//                       </div>
//                     )}
                    
//                     <Button
//                       variant="ghost"
//                       className="w-full mt-4"
//                       onClick={() => handleOpenPriceModal(service)}
//                     >
//                       <Plus className="mr-2 h-4 w-4" />
//                       Add New Price
//                     </Button>
//                   </CardContent>
//                 </AccordionContent>
//               </AccordionItem>
//             </Card>
//           ))}
//         </Accordion>
//       )}

//       {/* Price Modal */}
//       <Dialog open={priceModalOpen} onOpenChange={setPriceModalOpen}>
//         <DialogContent className="sm:max-w-[425px]">
//           <DialogHeader>
//             <DialogTitle>
//               {selectedPrice ? 'Edit Price' : 'Add New Price'}
//             </DialogTitle>
//             <DialogDescription>
//               {selectedService?.service.name_en}
//             </DialogDescription>
//           </DialogHeader>
          
//           <div className="grid gap-4 py-4">
//             <div className="grid gap-2">
//               <Label htmlFor="price">Price *</Label>
//               <Input
//                 id="price"
//                 type="number"
//                 value={price}
//                 onChange={(e) => setPrice(e.target.value)}
//                 placeholder="Enter price"
//               />
//             </div>
            
//             <div className="flex items-center justify-between">
//               <Label htmlFor="minimum-price">Minimum Price</Label>
//               <Switch
//                 id="minimum-price"
//                 checked={isMinimumPrice}
//                 onCheckedChange={setIsMinimumPrice}
//               />
//             </div>
            
//             <div className="grid gap-2">
//               <Label htmlFor="price-unit">Price Unit *</Label>
//               <Select
//                 value={selectedPriceUnitId?.toString()}
//                 onValueChange={(value) => setSelectedPriceUnitId(Number(value))}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select price unit" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {priceUnits.map((unit) => (
//                     <SelectItem key={unit.id} value={unit.id.toString()}>
//                       {unit.name}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
            
//             <div className="grid gap-2">
//               <Label htmlFor="quality-type">Quality Type *</Label>
//               <Select
//                 value={selectedQualityTypeId?.toString()}
//                 onValueChange={(value) => setSelectedQualityTypeId(Number(value))}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select quality type" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {qualityTypes.map((type) => (
//                     <SelectItem key={type.id} value={type.id.toString()}>
//                       {type.name}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
            
//             <div className="grid gap-2">
//               <Label htmlFor="discount-name">Discount Name</Label>
//               <Input
//                 id="discount-name"
//                 value={discountName}
//                 onChange={(e) => setDiscountName(e.target.value)}
//                 placeholder="e.g., Summer Sale"
//                 maxLength={50}
//               />
//             </div>
            
//             <div className="grid gap-2">
//               <Label htmlFor="discount-percentage">Discount Percentage</Label>
//               <Input
//                 id="discount-percentage"
//                 type="number"
//                 value={discountPercentage}
//                 onChange={(e) => setDiscountPercentage(e.target.value)}
//                 placeholder="0"
//                 max={100}
//               />
//             </div>
            
//             <div className="flex items-center justify-between">
//               <Label htmlFor="discount-active">Activate Discount</Label>
//               <Switch
//                 id="discount-active"
//                 checked={discountIsActive}
//                 onCheckedChange={setDiscountIsActive}
//               />
//             </div>
//           </div>
          
//           <DialogFooter>
//             <Button
//               variant="outline"
//               onClick={() => setPriceModalOpen(false)}
//               disabled={submitting}
//             >
//               Cancel
//             </Button>
//             <Button onClick={handleSavePrice} disabled={submitting}>
//               {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//               {selectedPrice ? 'Update Price' : 'Add Price'}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Delete Confirmation Dialog */}
//       <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Remove Price</AlertDialogTitle>
//             <AlertDialogDescription>
//               Are you sure you want to remove this price? This action cannot be undone.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel onClick={() => setSelectedPrice(null)}>
//               Cancel
//             </AlertDialogCancel>
//             <AlertDialogAction
//               onClick={confirmDelete}
//               className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
//             >
//               Remove
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   );
// }

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
  Image as ImageIcon
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
  
  // const professionalId = Number(params.professionalId);
  const professionalId = user?.professional_id ?? 0;
  const [services, setServices] = useState<ProfessionalService[]>([]);
  const [loading, setLoading] = useState(true);
  const [priceUnits, setPriceUnits] = useState<PriceUnit[]>([]);
  const [qualityTypes, setQualityTypes] = useState<QualityType[]>([]);
  
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
  const [submitting, setSubmitting] = useState(false);

  const getLocalizedText = (en: string, ne: string) => {
    return language === 'ne' ? ne : en;
  };

  useEffect(() => {
    if (professionalId) {
      loadData();
      loadDropdowns();
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
      };

      if (selectedPrice) {
        await updatePrice(selectedPrice.id, priceData);
        toast({
          title: getLocalizedText('Success', 'सफल'),
          description: getLocalizedText('Price updated successfully', 'मूल्य सफलतापूर्वक अद्यावधिक गरियो'),
        });
      } else {
        await createPrice(priceData);
        toast({
          title: getLocalizedText('Success', 'सफल'),
          description: getLocalizedText('Price added successfully', 'मूल्य सफलतापूर्वक थपियो'),
        });
      }

      setPriceModalOpen(false);
      resetForm();
      loadData(); // Refresh the list
    } catch (error) {
      toast({
        title: getLocalizedText('Error', 'त्रुटि'),
        description: getLocalizedText('Failed to save price', 'मूल्य सुरक्षित गर्न असफल'),
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
        title: getLocalizedText('Success', 'सफल'),
        description: getLocalizedText('Price removed successfully', 'मूल्य सफलतापूर्वक हटाइयो'),
      });
      loadData(); // Refresh the list
    } catch (error) {
      toast({
        title: getLocalizedText('Error', 'त्रुटि'),
        description: getLocalizedText('Failed to delete price', 'मूल्य मेटाउन असफल'),
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
          {services.map((service) => (
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
                        {service.prices.map((price) => {
                          const discountedPrice = calculateDiscountedPrice(price);
                          const hasDiscount = price.discount_is_active && price.discount_percentage > 0;
                          
                          return (
                            <div
                              key={price.id}
                              className={`flex items-center justify-between p-4 rounded-lg ${
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
                                        {formatCurrency(price.price)}
                                      </span>
                                      <Badge variant="secondary" className="ml-2">
                                        {price.discount_name} ({price.discount_percentage}%)
                                      </Badge>
                                    </>
                                  )}
                                  {price.is_minimum_price && (
                                    <Badge variant="outline" className="ml-2">
                                      {getLocalizedText('Minimum Price', 'न्यूनतम मूल्य')}
                                    </Badge>
                                  )}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {price.price_unit.name} | {price.quality_type.name}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleOpenPriceModal(service, price)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeletePrice(price)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
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
                    
                    <Button
                      variant="ghost"
                      className="w-full mt-4"
                      onClick={() => handleOpenPriceModal(service)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      {getLocalizedText('Add New Price', 'नयाँ मूल्य थप्नुहोस्')}
                    </Button>
                  </CardContent>
                </AccordionContent>
              </AccordionItem>
            </Card>
          ))}
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
                ? getLocalizedText('Update Price', 'मूल्य अद्यावधिक गर्नुहोस्')
                : getLocalizedText('Add Price', 'मूल्य थप्नुहोस्')
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
              {getLocalizedText('Remove Price', 'मूल्य हटाउनुहोस्')}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {getLocalizedText(
                'Are you sure you want to remove this price? This action cannot be undone.',
                'के तपाईं यो मूल्य हटाउन निश्चित हुनुहुन्छ? यो कार्य पूर्ववत गर्न सकिँदैन।'
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
              {getLocalizedText('Remove', 'हटाउनुहोस्')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
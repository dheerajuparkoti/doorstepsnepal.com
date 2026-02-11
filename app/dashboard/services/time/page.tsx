'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { useServiceAvailabilityStore } from '@/stores/service-availability-store';
import { formatTimeForDisplay, getDayNameInNepali, timeToString } from '@/lib/data/service-availability';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';
import {
  Plus,
  X,
  RefreshCw,
  Trash2,
  Loader2,
  Clock,
  Calendar,
  Edit,
  AlertTriangle,
  Check,
  ChevronDown,
  ChevronUp,
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';

// Mock professional ID - in real app, get from auth or params
const MOCK_PROFESSIONAL_ID = 24;

// Form validation schema
const availabilityFormSchema = z.object({
  day_of_week: z.string().min(1, 'Day is required'),
  start_time: z.string().min(1, 'Start time is required'),
  end_time: z.string().min(1, 'End time is required'),
}).refine(data => {
  // Custom validation to ensure end time is after start time
  const start = new Date(`1970-01-01T${data.start_time}`);
  const end = new Date(`1970-01-01T${data.end_time}`);
  return end > start;
}, {
  message: 'End time must be after start time',
  path: ['end_time'],
});

type AvailabilityFormValues = z.infer<typeof availabilityFormSchema>;

// Time slot display component
interface TimeSlotProps {
  availability: any;
  onEdit: (availability: any) => void;
  onDelete: (availabilityId: number) => void;
  isProcessing: boolean;
  locale: string;
}

const TimeSlotCard = ({ availability, onEdit, onDelete, isProcessing, locale }: TimeSlotProps) => {
  const { day_of_week, start_time, end_time, id } = availability;
  const dayName = locale === 'ne' ? getDayNameInNepali(day_of_week) : day_of_week;
  const startTime = formatTimeForDisplay(start_time);
  const endTime = formatTimeForDisplay(end_time);

  return (
    <div className="group relative border rounded-lg p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{dayName}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="w-3 h-3 text-gray-500" />
                <span className="text-gray-600">
                  {startTime} - {endTime}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(availability)}
            disabled={isProcessing}
            className="h-8 w-8"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(id)}
            disabled={isProcessing}
            className="h-8 w-8 text-red-500 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default function ProfessionalServiceAvailabilityPage() {
  const { locale } = useI18n();
  const {
    // State
    availabilities,
    isLoadingAvailabilities,
    isUpdating,
    isDeleting,
    error,
    
    // Form state
    selectedDay,
    startTime,
    endTime,
    availableDays,
    
    // Constants
    daysOfWeek,
    maxSlots,
    
    // Actions
    setSelectedDay,
    setStartTime,
    setEndTime,
    resetForm,
    fetchAvailabilities,
    createAvailability,
    updateAvailability,
    deleteAvailability,
    clearError,
  } = useServiceAvailabilityStore();
  
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingAvailability, setEditingAvailability] = useState<any>(null);
  const [timeError, setTimeError] = useState<string | null>(null);

  // Initialize form
  const form = useForm<AvailabilityFormValues>({
    resolver: zodResolver(availabilityFormSchema),
    defaultValues: {
      day_of_week: '',
      start_time: '09:00:00',
      end_time: '17:00:00',
    },
  });

  // Edit form
  const editForm = useForm<AvailabilityFormValues>({
    resolver: zodResolver(availabilityFormSchema),
  });

  useEffect(() => {
    loadAvailabilities();
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

  const loadAvailabilities = async () => {
    try {
      await fetchAvailabilities(MOCK_PROFESSIONAL_ID);
    } catch (err) {
      // Error handled by store
    }
  };

  const handleCreateAvailability = async (data: AvailabilityFormValues) => {
    try {
      // Validate time
      if (!validateTimes(data.start_time, data.end_time)) {
        return;
      }

      await createAvailability({
        professional_id: MOCK_PROFESSIONAL_ID,
        day_of_week: data.day_of_week,
        start_time: data.start_time,
        end_time: data.end_time,
      });

      toast({
        title: locale === 'ne' ? 'सफलता' : 'Success',
        description: locale === 'ne'
          ? 'समय स्लट सफलतापूर्वक थपियो'
          : 'Time slot added successfully',
      });

      form.reset();
      setShowAddDialog(false);
    } catch (err) {
      // Error handled by store
    }
  };

  const handleEditAvailability = async (data: AvailabilityFormValues) => {
    if (!editingAvailability) return;
    
    try {
      // Validate time
      if (!validateTimes(data.start_time, data.end_time)) {
        return;
      }

      await updateAvailability(editingAvailability.id, {
        day_of_week: data.day_of_week,
        start_time: data.start_time,
        end_time: data.end_time,
      });

      toast({
        title: locale === 'ne' ? 'सफलता' : 'Success',
        description: locale === 'ne'
          ? 'समय स्लट सफलतापूर्वक अपडेट गरियो'
          : 'Time slot updated successfully',
      });

      setShowEditDialog(false);
      setEditingAvailability(null);
    } catch (err) {
      // Error handled by store
    }
  };

  const handleDeleteAvailability = async (availabilityId: number) => {
    if (!confirm(
      locale === 'ne'
        ? 'के तपाईं यो समय स्लट हटाउन चाहनुहुन्छ?'
        : 'Are you sure you want to delete this time slot?'
    )) {
      return;
    }

    try {
      await deleteAvailability(availabilityId);
      toast({
        title: locale === 'ne' ? 'सफलता' : 'Success',
        description: locale === 'ne'
          ? 'समय स्लट हटाइयो'
          : 'Time slot deleted successfully',
      });
    } catch (err) {
      // Error handled by store
    }
  };

  const validateTimes = (start: string, end: string): boolean => {
    const startTime = new Date(`1970-01-01T${start}`);
    const endTime = new Date(`1970-01-01T${end}`);
    
    if (endTime <= startTime) {
      setTimeError(locale === 'ne' 
        ? 'समाप्ति समय सुरुवात समय भन्दा पछि हुनुपर्छ' 
        : 'End time must be after start time'
      );
      return false;
    }
    
    // Check if duration is reasonable (at least 1 hour)
    const duration = endTime.getTime() - startTime.getTime();
    const minDuration = 60 * 60 * 1000; // 1 hour in milliseconds
    
    if (duration < minDuration) {
      setTimeError(locale === 'ne'
        ? 'समय स्लट कम्तिमा १ घण्टा हुनुपर्छ'
        : 'Time slot must be at least 1 hour'
      );
      return false;
    }
    
    setTimeError(null);
    return true;
  };

  const handleEditClick = (availability: any) => {
    setEditingAvailability(availability);
    editForm.reset({
      day_of_week: availability.day_of_week,
      start_time: availability.start_time,
      end_time: availability.end_time,
    });
    setShowEditDialog(true);
  };

  const getDayDisplayName = (day: string) => {
    return locale === 'ne' ? getDayNameInNepali(day) : day;
  };

  const isLimitReached = availabilities.length >= maxSlots;

  if (isLoadingAvailabilities && availabilities.length === 0) {
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
                {[...Array(3)].map((_, i) => (
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
                {[...Array(2)].map((_, i) => (
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {locale === 'ne' ? 'सेवा उपलब्धता' : 'Service Availability'}
            </h1>
            <p className="text-muted-foreground">
              {locale === 'ne'
                ? 'तपाईंको सेवा प्रदान गर्ने समयहरू सेट गर्नुहोस्'
                : 'Set your available service times'}
            </p>
          </div>
          <Button
            variant="secondary"
            onClick={loadAvailabilities}
            disabled={isLoadingAvailabilities}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingAvailabilities ? 'animate-spin' : ''}`} />
            {locale === 'ne' ? 'ताजा पार्नुहोस्' : 'Refresh'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Current Availability */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Availability Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle>
                      {locale === 'ne' ? 'वर्तमान उपलब्धता' : 'Current Availability'}
                    </CardTitle>
                    <CardDescription>
                      {locale === 'ne'
                        ? `तपाईंको सेवा समयहरू (${availabilities.length}/${maxSlots})`
                        : `Your service time slots (${availabilities.length}/${maxSlots})`}
                    </CardDescription>
                  </div>
                </div>
                <Badge variant={availabilities.length > 0 ? "default" : "outline"}>
                  {availabilities.length} {locale === 'ne' ? 'स्लटहरू' : 'slots'}
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
                        ? 'तपाईंले सेवा प्रदान गर्ने दिन र समयहरू सेट गर्नुहोस्। तपाईं प्रत्येक दिनका लागि एक समय स्लट थप्न सक्नुहुन्छ र कुल ७ स्लट सम्म थप्न सक्नुहुन्छ।'
                        : 'Set the days and times when you provide services. You can add one time slot per day and up to 7 slots in total.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">
                    {locale === 'ne' ? 'स्लट सीमा' : 'Slot Limit'}
                  </span>
                  <span className="text-sm">
                    {availabilities.length}/{maxSlots}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      isLimitReached
                        ? 'bg-red-600'
                        : availabilities.length >= maxSlots * 0.8
                        ? 'bg-yellow-600'
                        : 'bg-green-600'
                    }`}
                    style={{ width: `${(availabilities.length / maxSlots) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {locale === 'ne'
                    ? `तपाईं ${maxSlots - availabilities.length} स्लटहरू थप्न सक्नुहुन्छ`
                    : `You can add ${maxSlots - availabilities.length} more slots`}
                </p>
              </div>

              <Separator className="my-4" />

              {/* Availability Slots List */}
              {availabilities.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    {locale === 'ne' ? 'कुनै समय स्लट फेला परेन' : 'No Time Slots Found'}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {locale === 'ne'
                      ? 'कृपया सेवा उपलब्धता समयहरू थप्नुहोस्'
                      : 'Please add service availability time slots'}
                  </p>
                  <Button
                    onClick={() => setShowAddDialog(true)}
                    disabled={isLimitReached}
                    className="gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    {locale === 'ne' ? 'पहिलो स्लट थप्नुहोस्' : 'Add First Time Slot'}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {availabilities.map((availability) => (
                    <TimeSlotCard
                      key={availability.id}
                      availability={availability}
                      onEdit={handleEditClick}
                      onDelete={handleDeleteAvailability}
                      isProcessing={isUpdating || isDeleting}
                      locale={locale}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Add New Slot Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <Plus className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <CardTitle>
                    {locale === 'ne' ? 'नयाँ समय स्लट थप्नुहोस्' : 'Add New Time Slot'}
                  </CardTitle>
                  <CardDescription>
                    {locale === 'ne'
                      ? 'सेवा प्रदान गर्ने नयाँ समय थप्नुहोस्'
                      : 'Add new service time slot'}
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
                        isLimitReached
                          ? locale === 'ne'
                            ? 'स्लट सीमा पुग्यो'
                            : 'Slot limit reached'
                          : locale === 'ne'
                          ? 'नयाँ समय स्लट थप्न क्लिक गर्नुहोस्...'
                          : 'Click to add new time slot...'
                      }
                      readOnly
                      disabled={isLimitReached}
                      onClick={() => setShowAddDialog(true)}
                      className="cursor-pointer"
                    />
                    <Plus className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>

                <Button
                  onClick={() => setShowAddDialog(true)}
                  disabled={isLimitReached}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  {locale === 'ne' ? 'थप्नुहोस्' : 'Add'}
                </Button>
              </div>

              {/* Slot Limit Warning */}
              {isLimitReached && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mt-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-800">
                        {locale === 'ne' ? 'स्लट सीमा' : 'Slot Limit Reached'}
                      </p>
                      <p className="text-sm text-yellow-700 mt-1">
                        {locale === 'ne'
                          ? 'तपाईंले अधिकतम ७ समय स्लटहरू मात्र थप्न सक्नुहुन्छ। नयाँ स्लट थप्न पहिला केही हटाउनुहोस्।'
                          : 'You can only add up to 7 time slots. Remove some slots to add new ones.'}
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
                  <Clock className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <CardTitle>
                    {locale === 'ne' ? 'समय तथ्याङ्क' : 'Time Statistics'}
                  </CardTitle>
                  <CardDescription>
                    {locale === 'ne'
                      ? 'तपाईंका सेवा समयहरूको विश्लेषण'
                      : 'Analysis of your service times'}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-700">
                      {availabilities.length}
                    </div>
                    <div className="text-sm text-blue-600">
                      {locale === 'ne' ? 'स्लटहरू' : 'Slots'}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-700">
                      {maxSlots - availabilities.length}
                    </div>
                    <div className="text-sm text-green-600">
                      {locale === 'ne' ? 'थप्न सकिने' : 'Available'}
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-medium">
                    {locale === 'ne' ? 'दिन अनुसार' : 'By Day'}
                  </h4>
                  <div className="space-y-2">
                    {availabilities.map((availability) => {
                      const dayName = getDayDisplayName(availability.day_of_week);
                      const timeRange = `${formatTimeForDisplay(availability.start_time)} - ${formatTimeForDisplay(availability.end_time)}`;
                      return (
                        <div key={availability.id} className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-sm">{dayName}</div>
                            <div className="text-xs text-muted-foreground">{timeRange}</div>
                          </div>
                          <Badge variant="outline">
                            {formatTimeForDisplay(availability.start_time)}
                          </Badge>
                        </div>
                      );
                    })}
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
                  <Calendar className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <CardTitle>
                    {locale === 'ne' ? 'द्रुत कार्यहरू' : 'Quick Actions'}
                  </CardTitle>
                  <CardDescription>
                    {locale === 'ne'
                      ? 'समय स्लटहरू व्यवस्थापन गर्ने विकल्पहरू'
                      : 'Options to manage your time slots'}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={() => setShowAddDialog(true)}
                disabled={isLimitReached}
              >
                <Plus className="w-4 h-4" />
                {locale === 'ne' ? 'नयाँ स्लट थप्नुहोस्' : 'Add New Slot'}
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={loadAvailabilities}
                disabled={isLoadingAvailabilities}
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingAvailabilities ? 'animate-spin' : ''}`} />
                {locale === 'ne' ? 'ताजा पार्नुहोस्' : 'Refresh List'}
              </Button>

              {availabilities.length > 0 && (
                <Button
                  variant="destructive"
                  className="w-full justify-start gap-2"
                  onClick={() => {
                    if (confirm(
                      locale === 'ne'
                        ? 'के तपाईं सबै समय स्लटहरू हटाउन चाहनुहुन्छ?'
                        : 'Are you sure you want to remove all time slots?'
                    )) {
                      // Delete all slots
                      Promise.all(
                        availabilities.map(slot => deleteAvailability(slot.id))
                      ).catch(err => {
                        // Error handled by store
                      });
                    }
                  }}
                  disabled={isUpdating || isDeleting}
                >
                  <Trash2 className="w-4 h-4" />
                  {locale === 'ne' ? 'सबै स्लट हटाउनुहोस्' : 'Remove All Slots'}
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
                        ? 'ग्राहकहरूले बढी सेवा लिने दिनहरूमा फोकस गर्नुहोस्'
                        : 'Focus on days when customers need services most'}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3 h-3 mt-0.5 text-green-600 flex-shrink-0" />
                    <span>
                      {locale === 'ne'
                        ? 'कम्तिमा २-३ घण्टाको समय स्लट राख्नुहोस्'
                        : 'Keep time slots of at least 2-3 hours'}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3 h-3 mt-0.5 text-green-600 flex-shrink-0" />
                    <span>
                      {locale === 'ne'
                        ? 'नियमित रूपमा उपलब्धता अपडेट गर्नुहोस्'
                        : 'Regularly update your availability'}
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
                    {locale === 'ne' ? 'द्रुत समय सेटिङ' : 'Quick Time Settings'}
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {availableDays.slice(0, 3).map((day) => (
                <Button
                  key={day}
                  variant="outline"
                  className="w-full justify-start text-left"
                  onClick={() => {
                    form.setValue('day_of_week', day);
                    form.setValue('start_time', '09:00:00');
                    form.setValue('end_time', '17:00:00');
                    setShowAddDialog(true);
                  }}
                  disabled={isLimitReached}
                >
                  <div className="flex-1">
                    <div className="font-medium">{getDayDisplayName(day)}</div>
                    <div className="text-xs text-muted-foreground">
                      {locale === 'ne' ? '९:०० बजे देखि ५:०० बजे सम्म' : '9:00 AM - 5:00 PM'}
                    </div>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Time Slot Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {locale === 'ne' ? 'नयाँ समय स्लट थप्नुहोस्' : 'Add New Time Slot'}
            </DialogTitle>
            <DialogDescription>
              {locale === 'ne'
                ? 'दिन र समय छान्नुहोस्'
                : 'Select day and time'}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCreateAvailability)} className="space-y-4">
              {/* Day Selection */}
              <FormField
                control={form.control}
                name="day_of_week"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {locale === 'ne' ? 'दिन' : 'Day'} *
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value || availableDays[0]}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={locale === 'ne' ? 'दिन छान्नुहोस्' : 'Select day'} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableDays.map((day) => (
                          <SelectItem key={day} value={day}>
                            {getDayDisplayName(day)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      {locale === 'ne'
                        ? 'उपलब्ध दिनहरू मात्र देखाइएको छ'
                        : 'Only available days are shown'}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Time Selection */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="start_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {locale === 'ne' ? 'सुरुवात समय' : 'Start Time'} *
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="time"
                          {...field}
                          onChange={(e) => {
                            const time = e.target.value;
                            field.onChange(time ? `${time}:00` : '');
                            if (form.getValues('end_time')) {
                              validateTimes(time ? `${time}:00` : '', form.getValues('end_time'));
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="end_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {locale === 'ne' ? 'समाप्ति समय' : 'End Time'} *
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="time"
                          {...field}
                          onChange={(e) => {
                            const time = e.target.value;
                            field.onChange(time ? `${time}:00` : '');
                            if (form.getValues('start_time')) {
                              validateTimes(form.getValues('start_time'), time ? `${time}:00` : '');
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {timeError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    {timeError}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddDialog(false);
                    form.reset();
                    setTimeError(null);
                  }}
                  disabled={isUpdating}
                >
                  {locale === 'ne' ? 'रद्द गर्नुहोस्' : 'Cancel'}
                </Button>
                <Button
                  type="submit"
                  disabled={isUpdating || isLimitReached}
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {locale === 'ne' ? 'थपिदै...' : 'Adding...'}
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      {locale === 'ne' ? 'समय स्लट थप्नुहोस्' : 'Add Time Slot'}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Time Slot Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {locale === 'ne' ? 'समय स्लट सम्पादन गर्नुहोस्' : 'Edit Time Slot'}
            </DialogTitle>
            <DialogDescription>
              {editingAvailability && (
                <span>
                  {locale === 'ne' ? 'दिन र समय परिवर्तन गर्नुहोस्' : 'Change day and time'}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          
          {editingAvailability && (
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(handleEditAvailability)} className="space-y-4">
                {/* Day Selection */}
                <FormField
                  control={editForm.control}
                  name="day_of_week"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {locale === 'ne' ? 'दिन' : 'Day'} *
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={locale === 'ne' ? 'दिन छान्नुहोस्' : 'Select day'} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {daysOfWeek.map((day) => (
                            <SelectItem key={day} value={day}>
                              {getDayDisplayName(day)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Time Selection */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={editForm.control}
                    name="start_time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {locale === 'ne' ? 'सुरुवात समय' : 'Start Time'} *
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="time"
                            value={field.value ? field.value.split(':').slice(0, 2).join(':') : ''}
                            onChange={(e) => {
                              const time = e.target.value;
                              field.onChange(time ? `${time}:00` : '');
                              if (editForm.getValues('end_time')) {
                                validateTimes(time ? `${time}:00` : '', editForm.getValues('end_time'));
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={editForm.control}
                    name="end_time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {locale === 'ne' ? 'समाप्ति समय' : 'End Time'} *
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="time"
                            value={field.value ? field.value.split(':').slice(0, 2).join(':') : ''}
                            onChange={(e) => {
                              const time = e.target.value;
                              field.onChange(time ? `${time}:00` : '');
                              if (editForm.getValues('start_time')) {
                                validateTimes(editForm.getValues('start_time'), time ? `${time}:00` : '');
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {timeError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      {timeError}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowEditDialog(false);
                      setEditingAvailability(null);
                      setTimeError(null);
                    }}
                    disabled={isUpdating}
                  >
                    {locale === 'ne' ? 'रद्द गर्नुहोस्' : 'Cancel'}
                  </Button>
                  <Button
                    type="submit"
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {locale === 'ne' ? 'अपडेट हुदैछ...' : 'Updating...'}
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        {locale === 'ne' ? 'अपडेट गर्नुहोस्' : 'Update Slot'}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
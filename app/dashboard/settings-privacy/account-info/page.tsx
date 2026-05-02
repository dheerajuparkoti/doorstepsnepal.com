

'use client';

import { useState, useEffect, useCallback } from 'react'; 
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/auth-context';
import { 
  useUser, 
  useUserLoading, 
  useRefreshUser, 
  useUpdateUser 
} from '@/stores/user-store'; 
import { AGE_GROUPS, GENDERS } from '@/lib/data/user';
import {
  updateFullName,
  updateEmail,
  updateGender,
  updateAgeGroup,
  updatePhone,
  updateProfileImage,
  deleteAccount,
  cancelAccountDeletion,
} from '@/lib/api/user';
import { getMyPendingChanges, PendingChange } from '@/lib/api/pending-changes';
import { ProfileHeader } from '@/components/account/profile-header';
import { DetailItem } from '@/components/account/detail-item';
import { EditDialog } from '@/components/account/edit-dialog';
import { DeleteAccountDialog } from '@/components/account/delete-account-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import {
  User as UserIcon,
  Phone,
  Mail,
  Briefcase,
  Calendar,
  Shield,
  LogOut,
  Trash2,
  CheckCircle,
  XCircle,
  CreditCard,
  Camera,
  FileText,
  Award,
} from 'lucide-react';
import { AddressSection } from '@/components/account/address-section';
import { useProfessionalStore } from '@/stores/professional-store';
import { professionalApi } from '@/lib/api/professional';
import { useI18n } from '@/lib/i18n/context';
import { getProfileSchema } from '@/lib/schemas/profile-schema';
import { z } from 'zod';
export default function AccountInfoPage() {
  const { t, language } = useI18n();
  const router = useRouter();
  const { logout, mode } = useAuth();
  
  // Zustand hooks 
  const user = useUser();
  const isLoading = useUserLoading();
  const refreshUser = useRefreshUser(); 
  const updateStoreUser = useUpdateUser(); 
  
  // Professional store hooks
  const { 
    profile: professionalProfile, 
    fetchProfile: fetchProfessionalProfile,
    patchProfile: patchProfessionalProfile,
    isLoading: isProfessionalLoading 
  } = useProfessionalStore();
  
  const [isUpdatingProfileImage, setIsUpdatingProfileImage] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<PendingChange[]>([]);
  const [currentEditField, setCurrentEditField] = useState<{
    field: string;
    title: string;
    value: string;
    type: 'text' | 'email' | 'select' | 'textarea';
    options?: ReadonlyArray<{ value: string; label: string }>;
    maxLength?: number;
  } | null>(null);
  const [activeTab, setActiveTab] = useState('personal');

  const getLocalizedText = (en: string, ne: string) => {
    return language === 'ne' ? ne : en;
  };

  // Fetch professional profile when in professional mode
  useEffect(() => {
    const loadProfessionalData = async () => {
      if (mode === 'professional' && user?.professional_id && !professionalProfile) {
        try {
          await fetchProfessionalProfile(user.professional_id);
        } catch (error) {
          console.error('Failed to fetch professional profile:', error);
        }
      }
    };

    loadProfessionalData();
  }, [mode, user?.professional_id, professionalProfile, fetchProfessionalProfile]);

  const refreshPendingChanges = useCallback(async () => {
    try {
      const changes = await getMyPendingChanges();
      setPendingChanges(changes.filter(c => c.status === 'pending'));
    } catch {
      // silently ignore
    }
  }, []);

  useEffect(() => {
    refreshPendingChanges();
  }, [refreshPendingChanges]);

  const getPending = useCallback(
    (entityType: PendingChange['entity_type'], fieldName: string) =>
      pendingChanges.find(c => c.entity_type === entityType && c.field_name === fieldName),
    [pendingChanges]
  );

  // Handle profile image upload
  const handleProfileImageChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      toast.error(getLocalizedText('Invalid file type', 'अमान्य फाइल प्रकार'), {
        description: getLocalizedText(
          'Please select a JPG, JPEG, or PNG image.',
          'कृपया JPG, JPEG, वा PNG छवि चयन गर्नुहोस्।'
        ),
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error(getLocalizedText('File too large', 'फाइल धेरै ठूलो छ'), {
        description: getLocalizedText(
          'Please select an image smaller than 5MB.',
          'कृपया 5MB भन्दा सानो छवि चयन गर्नुहोस्।'
        ),
      });
      return;
    }

    setIsUpdatingProfileImage(true);
    try {
      await updateProfileImage(file);
      toast.success(getLocalizedText('Profile image updated successfully', 'प्रोफाइल छवि सफलतापूर्वक अद्यावधिक गरियो'));
    } catch (error) {
      toast.error(getLocalizedText('Failed to update profile image', 'प्रोफाइल छवि अद्यावधिक गर्न असफल'), {
        description: error instanceof Error ? error.message : getLocalizedText('Please try again', 'कृपया पुनः प्रयास गर्नुहोस्'),
      });
    } finally {
      setIsUpdatingProfileImage(false);
    }
  }, [user, getLocalizedText]);

  // Open edit dialog
  const openEditDialog = useCallback((
    field: string,
    title: string,
    value: string,
    type: 'text' | 'email' | 'select' | 'textarea' = 'text',
    options?: readonly { value: string; label: string }[],
    maxLength?: number
  ) => {
    setCurrentEditField({ field, title, value, type, options, maxLength });
    setEditDialogOpen(true);
  }, []);

  // Handle field update
const handleFieldUpdate = useCallback(async (value: string) => {
  if (!currentEditField || !user) return;
  const schema = getProfileSchema(getLocalizedText);

  try {
    
    if (currentEditField.field === 'full_name') {
      schema.pick({ full_name: true }).parse({ full_name: value });
      await updateFullName(value);
    } else if (currentEditField.field === 'email') {
      schema.pick({ email: true }).parse({ email: value });
      await updateEmail(value);
    } else if (currentEditField.field === 'phone_number') {
      schema.pick({ phone_number: true }).parse({ phone_number: value });
      await updatePhone(value);
    } else if (currentEditField.field === 'gender') {
      schema.pick({ gender: true }).parse({ gender: value });
      await updateGender(value);
    } else if (currentEditField.field === 'age_group') {
      schema.pick({ age_group: true }).parse({ age_group: value });
      await updateAgeGroup(value);
    } else if (currentEditField.field === 'bio') {
      schema.pick({ bio: true }).parse({ bio: value });
      if (user.professional_id) {
        await patchProfessionalProfile(user.professional_id, { bio: value });
      }
    } else if (currentEditField.field === 'experience' && user.professional_id) {
      const exp = parseInt(value, 10);
      if (isNaN(exp) || exp < 1 || exp > 65) {
        toast.error(getLocalizedText(
          'Please enter a valid experience (1-65 years)',
          'कृपया मान्य अनुभव प्रविष्ट गर्नुहोस् (१-६५ वर्ष)'
        ));
        return;
      }
      await patchProfessionalProfile(user.professional_id, { experience: exp });
      toast.success(getLocalizedText('Experience updated successfully', 'अनुभव सफलतापूर्वक अद्यावधिक गरियो'));
    }

    // Refresh user for core fields
    if (['full_name', 'email', 'gender', 'age_group', 'phone_number'].includes(currentEditField.field)) {
      await refreshUser();
    }

    refreshPendingChanges();
    setEditDialogOpen(false);
    toast.success(getLocalizedText("Updated successfully", "सफलतापूर्वक अद्यावधिक गरियो"));
  } catch (error) {
    if (error instanceof z.ZodError) {
      toast.error(error.errors[0].message);
    } else {
      toast.error(getLocalizedText(
        `Failed to update ${currentEditField.title.toLowerCase()}`,
        `${currentEditField.title} अद्यावधिक गर्न असफल`
      ), {
        description: error instanceof Error ? error.message : getLocalizedText('Please try again', 'कृपया पुनः प्रयास गर्नुहोस्'),
      });
    }
  }
}, [currentEditField, user, refreshUser, patchProfessionalProfile, getLocalizedText, refreshPendingChanges]);
  // Handle account deletion
  const handleDeleteAccount = useCallback(async () => {
    try {
      await deleteAccount();
      toast.success(getLocalizedText('Account deletion requested', 'खाता हटाउने अनुरोध गरियो'));
      logout();
      router.push('/');
    } catch (error) {
      toast.error(getLocalizedText('Failed to delete account', 'खाता हटाउन असफल'), {
        description: error instanceof Error ? error.message : getLocalizedText('Please try again', 'कृपया पुनः प्रयास गर्नुहोस्'),
      });
      throw error;
    }
  }, [logout, router, getLocalizedText]);

  // Handle cancel deletion
  const handleCancelDeletion = useCallback(async () => {
    if (!user?.deletion_requested) return;

    try {
      await cancelAccountDeletion();
      await refreshUser();
      toast.success(getLocalizedText('Account deletion cancelled', 'खाता हटाउने रद्द गरियो'));
    } catch (error) {
      toast.error(getLocalizedText('Failed to cancel deletion', 'हटाउने रद्द गर्न असफल'), {
        description: error instanceof Error ? error.message : getLocalizedText('Please try again', 'कृपया पुनः प्रयास गर्नुहोस्'),
      });
    }
  }, [user, refreshUser, getLocalizedText]);

  // Format date
  const formatDate = useCallback((dateString?: string) => {
    if (!dateString) return getLocalizedText('N/A', 'उपलब्ध छैन');
    return new Date(dateString).toLocaleDateString(language === 'ne' ? 'ne-NP' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, [language, getLocalizedText]);



  // Get user type display value
  const getUserTypeDisplay = useCallback(() => {
    if (!user) return getLocalizedText('Customer', 'ग्राहक');
    return mode === 'professional' 
      ? getLocalizedText('Professional', 'प्रोफेशनल') 
      : getLocalizedText('Customer', 'ग्राहक');
  }, [user, mode, getLocalizedText]);
  const memberYears = user?.member_since === 0 ? 1 : user?.member_since;
  // Loading state
  if (isLoading || !user || (mode === 'professional' && isProfessionalLoading)) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Header Skeleton */}
            <div className="mb-8">
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-96" />
            </div>
            
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar Skeleton */}
              <div className="lg:w-1/4">
                <Skeleton className="h-64 w-full rounded-xl" />
              </div>
              
              {/* Content Skeleton */}
              <div className="lg:w-3/4">
                <Skeleton className="h-12 w-full mb-6" />
                <div className="grid gap-4">
                  {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              {getLocalizedText('Account Settings', 'खाता सेटिङ्हरू')}
            </h1>
            <p className="text-muted-foreground text-lg">
              {getLocalizedText(
                'Manage your account information, privacy settings, and security preferences',
                'तपाईंको खाता जानकारी, गोपनीयता सेटिङ्हरू, र सुरक्षा प्राथमिकताहरू व्यवस्थापन गर्नुहोस्'
              )}
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Profile Card */}
            <div className="lg:w-1/4">
              <Card className="sticky top-8 border shadow-sm bg-card">
                <CardHeader className="pb-4">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-4">
                      <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-background shadow-lg ring-2 ring-border">
                        <img 
                          src={user.profile_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name)}&background=random`}
                          alt={user.full_name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <label 
                        htmlFor="profile-image" 
                        className="absolute bottom-0 right-0 cursor-pointer"
                      >
                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-primary to-secondary shadow-lg hover:shadow-xl transition-all hover:scale-105">
                          {isUpdatingProfileImage ? (
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          ) : (
                            <Camera className="h-5 w-5 text-white" />
                          )}
                        </div>
                        <input
                          id="profile-image"
                          type="file"
                          accept="image/jpeg,image/jpg,image/png"
                          className="hidden"
                          onChange={handleProfileImageChange}
                          disabled={isUpdatingProfileImage}
                        />
                      </label>
                    </div>
                    
                    <h2 className="text-xl font-bold text-foreground">{user.full_name}</h2>
                    <Badge 
                      className={`mt-2 ${
                        getUserTypeDisplay() === getLocalizedText('Professional', 'प्रोफेशनल')
                          ? 'bg-secondary/20 text-primary hover:bg-primary/30 border-primary/30'
                          : 'bg-primary/20 text-primary hover:bg-primary/30 border-primary/30'
                      }`}
                      variant="outline"
                    >
                      {getUserTypeDisplay()}
                    </Badge>
                    
                    <Separator className="my-4" />
                    
                    <div className="space-y-3 text-sm text-muted-foreground w-full">
                      <div className="flex justify-between">
               <span>{getLocalizedText('Member Since', 'सदस्यता मिति')}</span>
                      <span className="font-medium text-foreground">
                   {(user.member_since === 0 ? 1 : user.member_since)}{' '}
{getLocalizedText('Year', 'वर्ष')}
                      </span>
                      </div>
                      
                      {/* Only show booking stats for customers, not professionals */}
  {mode !== 'professional' && (
    <>
      <div className="flex justify-between">
        <span>{getLocalizedText('Total Bookings', 'कुल बुकिङ')}</span>
        <span className="font-medium text-foreground">{user.order_count || 0}</span>
      </div>
      <div className="flex justify-between">
        <span>{getLocalizedText('Total Spent', 'कुल खर्च')}</span>
        <span className="font-medium text-foreground">रू {(user.total_spent || 0).toFixed(2)}</span>
      </div>
    </>
  )}
</div>
        
                  </div>
                </CardHeader>
                
                {user.deletion_requested && (
                  <CardContent className="pt-4 border-t">
                    <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
                      <p className="text-sm text-amber-800 dark:text-amber-300">
                        <strong className="font-semibold">⚠️ {getLocalizedText('Deletion Requested', 'हटाउने अनुरोध गरियो')}</strong><br />
                        {getLocalizedText('Scheduled for', 'मिति')} {formatDate(user.deletion_requested_at)}
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancelDeletion}
                        className="w-full mt-2 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/30"
                      >
                        {getLocalizedText('Cancel Deletion', 'हटाउने रद्द गर्नुहोस्')}
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>
            </div>

            {/* Main Content Area */}
            <div className="lg:w-3/4">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-3 mb-8 bg-muted p-1">
                  <TabsTrigger 
                    value="personal" 
                    className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                  >
                    <UserIcon className="h-4 w-4 mr-2" />
                    {getLocalizedText('Personal', 'व्यक्तिगत')}
                  </TabsTrigger>
                  <TabsTrigger 
                    value="account" 
                    className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    {getLocalizedText('Account', 'खाता')}
                  </TabsTrigger>
                  <TabsTrigger 
                    value="danger" 
                    className="data-[state=active]:bg-destructive/10 data-[state=active]:text-destructive data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-destructive/20"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {getLocalizedText('Danger Zone', 'खतरा क्षेत्र')}
                  </TabsTrigger>
                </TabsList>

                {/* Personal Information Tab */}
                <TabsContent value="personal" className="space-y-6 animate-in fade-in duration-300">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-foreground">
                        <UserIcon className="h-5 w-5 mr-2 text-primary" />
                        {getLocalizedText('Personal Information', 'व्यक्तिगत जानकारी')}
                      </CardTitle>
                      <CardDescription>
                        {getLocalizedText(
                          'Update your personal details and contact information',
                          'तपाईंको व्यक्तिगत विवरण र सम्पर्क जानकारी अद्यावधिक गर्नुहोस्'
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-2">
                        <DetailItem
                          icon={UserIcon}
                          title={getLocalizedText('Full Name', 'पूरा नाम')}
                          value={user.full_name}
                          isEditable
                          pendingValue={getPending('user', 'full_name')?.new_value ?? null}
                          onEdit={() =>
                            openEditDialog(
                              'full_name',
                              getLocalizedText('Full Name', 'पूरा नाम'),
                              user.full_name,
                              'text'
                            )
                          }
                        />

                        {(() => {
                          const hasEmail = !!(user.email && user.email.includes('@'));
                          const hasPhone = !!(user.phone_number && /^\d+$/.test(user.phone_number));

                          return (
                            <>
                              <DetailItem
                                icon={Mail}
                                title={getLocalizedText('Email Address', 'इमेल ठेगाना')}
                                value={user.email || getLocalizedText('Not set', 'सेट गरिएको छैन')}
                                isEditable={hasPhone && !hasEmail}
                                onEdit={() =>
                                  openEditDialog(
                                    'email',
                                    getLocalizedText('Email Address', 'इमेल ठेगाना'),
                                    user.email || '',
                                    'email'
                                  )
                                }
                              />

                              <DetailItem
                                icon={Phone}
                                title={getLocalizedText('Phone Number', 'फोन नम्बर')}
                                value={
                                  hasPhone
                                    ? user.phone_number
                                    : getLocalizedText('Not set', 'सेट गरिएको छैन')
                                }
                                isEditable={hasEmail && !hasPhone}
                                onEdit={() =>
                                  openEditDialog(
                                    'phone_number',
                                    getLocalizedText('Phone Number', 'फोन नम्बर'),
                                    '',
                                    'text'
                                  )
                                }
                              />

                              {hasEmail && hasPhone && (
                                <div className="md:col-span-2 flex items-start gap-2 rounded-md border border-muted bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
                                  <Shield className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
                                  <span>
                                    {getLocalizedText(
                                      'To change your email or phone number, please contact ',
                                      'इमेल वा फोन नम्बर परिवर्तन गर्न, कृपया सम्पर्क गर्नुहोस् '
                                    )}
                                    <span className="font-medium text-foreground">
                                      {getLocalizedText('Doorsteps Nepal support', 'Doorsteps Nepal सहयोग')}
                                    </span>
                                    .
                                  </span>
                                </div>
                              )}
                            </>
                          );
                        })()}

                        <DetailItem
                          icon={UserIcon}
                          title={getLocalizedText('Gender', 'लिङ्ग')}
                          value={GENDERS.find(g => g.value === user.gender)?.label || user.gender || getLocalizedText('Not set', 'सेट गरिएको छैन')}
                          isEditable
                          pendingValue={getPending('user', 'gender')?.new_value
                            ? (GENDERS.find(g => g.value === getPending('user', 'gender')?.new_value)?.label ?? getPending('user', 'gender')?.new_value ?? null)
                            : null}
                          onEdit={() =>
                            openEditDialog(
                              'gender',
                              getLocalizedText('Gender', 'लिङ्ग'),
                              user.gender || '',
                              'select',
                              GENDERS
                            )
                          }
                        />

                        <DetailItem
                          icon={Calendar}
                          title={getLocalizedText('Age Group', 'उमेर समूह')}
                          value={AGE_GROUPS.find(a => a.value === user.age_group)?.label || user.age_group || getLocalizedText('Not set', 'सेट गरिएको छैन')}
                          isEditable
                          pendingValue={getPending('user', 'age_group')?.new_value
                            ? (AGE_GROUPS.find(a => a.value === getPending('user', 'age_group')?.new_value)?.label ?? getPending('user', 'age_group')?.new_value ?? null)
                            : null}
                          onEdit={() =>
                            openEditDialog(
                              'age_group',
                              getLocalizedText('Age Group', 'उमेर समूह'),
                              user.age_group || '',
                              'select',
                              AGE_GROUPS
                            )
                          }
                        />

                        <DetailItem
                          icon={Briefcase}
                          title={getLocalizedText('Account Type', 'खाता प्रकार')}
                          value={getUserTypeDisplay()}
                          isEditable={false}
                        />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <AddressSection
                    pendingChanges={pendingChanges}
                    onAddressChange={refreshPendingChanges}
                  />

                  {/* Professional Section - Always show for professional users */}
                  {getUserTypeDisplay() === getLocalizedText('Professional', 'प्रोफेशनल') && user.professional_id && (
                    <>
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center text-foreground">
                            <Briefcase className="h-5 w-5 mr-2 text-secondary" />
                            {getLocalizedText('Professional Information', 'प्रोफेशनल जानकारी')}
                          </CardTitle>
                          <CardDescription>
                            {getLocalizedText(
                              'Your professional account details and status',
                              'तपाईंको प्रोफेशनल खाता विवरण र स्थिति'
                            )}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid gap-4 md:grid-cols-2">
                            <DetailItem
                              icon={Briefcase}
                              title={getLocalizedText('Professional ID', 'प्रोफेशनल आईडी')}
                              value={`#${user.professional_id}`}
                              isEditable={false}
                            />

                            <DetailItem
                              icon={Shield}
                              title={getLocalizedText('Admin Approval', 'प्रशासक स्वीकृति')}
                              value={
                                user.is_admin_approved ? (
                                  <span className="flex items-center text-green-600 dark:text-green-400">
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    {getLocalizedText('Approved', 'स्वीकृत')}
                                  </span>
                                ) : (
                                  <span className="flex items-center text-amber-600 dark:text-amber-400">
                                    <XCircle className="h-4 w-4 mr-2" />
                                    {getLocalizedText('Pending Review', 'समीक्षा हुँदै')}
                                  </span>
                                )
                              }
                              isEditable={false}
                            />
                          </div>
                        </CardContent>
                      </Card>

                      {/* Professional Details Card - Bio & Experience */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center text-foreground">
                            <Award className="h-5 w-5 mr-2 text-secondary" />
                            {getLocalizedText('Professional Details', 'प्रोफेशनल विवरण')}
                          </CardTitle>
                          <CardDescription>
                            {getLocalizedText(
                              'Manage your professional profile information',
                              'तपाईंको प्रोफेशनल प्रोफाइल जानकारी व्यवस्थापन गर्नुहोस्'
                            )}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid gap-4">
                            {/* Experience Field */}
                            <DetailItem
                              icon={Award}
                              title={getLocalizedText('Years of Experience', 'अनुभव वर्ष')}
                              value={
                                professionalProfile?.experience
                                  ? getLocalizedText(
                                      `${professionalProfile.experience} ${professionalProfile.experience === 1 ? 'year' : 'years'}`,
                                      `${professionalProfile.experience} वर्ष`
                                    )
                                  : getLocalizedText('Not set', 'सेट गरिएको छैन')
                              }
                              isEditable={true}
                              pendingValue={getPending('professional', 'experience')?.new_value
                                ? getLocalizedText(
                                    `${getPending('professional', 'experience')?.new_value} years`,
                                    `${getPending('professional', 'experience')?.new_value} वर्ष`
                                  )
                                : null}
                              onEdit={() =>
                                openEditDialog(
                                  'experience',
                                  getLocalizedText('Years of Experience', 'अनुभव वर्ष'),
                                  (professionalProfile?.experience || 1).toString(),
                                  'text',
                                  undefined,
                                  2
                                )
                              }
                            />

                            {/* Bio Field - Using textarea for multi-line */}
                            <DetailItem
                              icon={FileText}
                              title={getLocalizedText('Bio', 'बायो')}
                              value={professionalProfile?.bio || getLocalizedText('No bio added yet', 'अहिलेसम्म बायो थपिएको छैन')}
                              isEditable={true}
                              pendingValue={getPending('professional', 'bio')?.new_value ?? null}
                              onEdit={() =>
                                openEditDialog(
                                  'bio',
                                  getLocalizedText('Bio', 'बायो'),
                                  professionalProfile?.bio || '',
                                  'textarea',
                                  undefined,
                                  500
                                )
                              }
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  )}
                </TabsContent>

                {/* Account Information Tab */}
                <TabsContent value="account" className="space-y-6 animate-in fade-in duration-300">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-foreground">
                        <Shield className="h-5 w-5 mr-2 text-primary" />
                        {getLocalizedText('Account Details', 'खाता विवरण')}
                      </CardTitle>
                      <CardDescription>
                        {getLocalizedText(
                          'View your account status and activity',
                          'तपाईंको खाता स्थिति र गतिविधि हेर्नुहोस्'
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-2">
                        <DetailItem
                          icon={Shield}
                          title={getLocalizedText('Account Status', 'खाता स्थिति')}
                          value={
                            user.deletion_requested ? (
                              <Badge 
                                variant="outline" 
                                className="bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800"
                              >
                                {getLocalizedText('Deletion Requested', 'हटाउने अनुरोध गरियो')}
                              </Badge>
                            ) : user.is_deleted ? (
                              <Badge 
                                variant="outline" 
                                className="bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800"
                              >
                                {getLocalizedText('Deleted', 'हटाइयो')}
                              </Badge>
                            ) : (
                              <Badge 
                                variant="outline" 
                                className="bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800"
                              >
                                {getLocalizedText('Active', 'सक्रिय')}
                              </Badge>
                            )
                          }
                          isEditable={false}
                        />

                        <DetailItem
                          icon={Calendar}
                          title={getLocalizedText('Member Since', 'सदस्यता मिति')}
                      value={`${memberYears} ${getLocalizedText('Year', 'वर्ष')}`}
                          isEditable={false}
                        />

                 {/* Only show booking stats for customers, not professionals */}
{mode !== 'professional' && (
  <>
    <DetailItem
      icon={Briefcase}
      title={getLocalizedText('Total Bookings', 'कुल बुकिङ')}
      value={getLocalizedText(`${user.order_count || 0} bookings`, `${user.order_count || 0} बुकिङ`)}
      isEditable={false}
    />
  
    <DetailItem
      icon={CreditCard}
      title={getLocalizedText('Total Spent', 'कुल खर्च')}
      value={`रू ${(user.total_spent || 0).toFixed(2)}`}
      isEditable={false}
    />
  </>
)}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Danger Zone Tab */}
                <TabsContent value="danger" className="space-y-6 animate-in fade-in duration-300">
                  <Card className="border-destructive/20 dark:border-destructive/40">
                    <CardHeader>
                      <CardTitle className="flex items-center text-destructive">
                        <Trash2 className="h-5 w-5 mr-2" />
                        {getLocalizedText('Danger Zone', 'खतरा क्षेत्र')}
                      </CardTitle>
                      <CardDescription className="text-muted-foreground">
                        {getLocalizedText(
                          'Irreversible actions that will affect your account',
                          'अपरिवर्तनीय कार्यहरू जसले तपाईंको खातालाई असर गर्नेछ'
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-4 border border-border rounded-lg bg-card">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex-1">
                              <h3 className="font-semibold text-foreground">{getLocalizedText('Sign Out', 'साइन आउट')}</h3>
                              <p className="text-sm text-muted-foreground">
                                {getLocalizedText(
                                  'Sign out of your account on this device',
                                  'यस उपकरणमा तपाईंको खाताबाट साइन आउट गर्नुहोस्'
                                )}
                              </p>
                            </div>
                            <Button
                              variant="outline"
                              onClick={logout}
                              className="sm:w-auto w-full"
                            >
                              <LogOut className="h-4 w-4 mr-2" />
                              {getLocalizedText('Sign Out', 'साइन आउट')}
                            </Button>
                          </div>
                        </div>

                        <div className="p-4 border border-destructive/30 dark:border-destructive/50 rounded-lg bg-destructive/5 dark:bg-destructive/10">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex-1">
                              <h3 className="font-semibold text-destructive">{getLocalizedText('Delete Account', 'खाता हटाउनुहोस्')}</h3>
                              <p className="text-sm text-muted-foreground dark:text-destructive/80">
                                {getLocalizedText(
                                  'Permanently delete your account and all associated data',
                                  'तपाईंको खाता र सबै सम्बन्धित डाटा स्थायी रूपमा हटाउनुहोस्'
                                )}
                              </p>
                            </div>
                            <Button
                              variant="destructive"
                              onClick={() => setDeleteDialogOpen(true)}
                              className="sm:w-auto w-full"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              {getLocalizedText('Delete Account', 'खाता हटाउनुहोस्')}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      {currentEditField && (
        <EditDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          title={currentEditField.title}
          field={currentEditField.field}
          initialValue={currentEditField.value}
          onSubmit={handleFieldUpdate}
          type={currentEditField.type}
          options={currentEditField.options}
          maxLength={currentEditField.maxLength}
        />
      )}

      {/* Delete Account Dialog */}
      <DeleteAccountDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteAccount}
      />
    </div>
  );
}
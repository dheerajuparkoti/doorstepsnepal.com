'use client';

import { useState, useEffect, useRef, JSX } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { useShowcaseStore } from '@/stores/showcase-store';
import { ShowcaseItem, ShowcaseStatus } from '@/lib/data/showcase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';
import { Switch } from '@/components/ui/switch';
import {
  Upload,
  Trash2,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Plus,
  RefreshCw,
  AlertCircle,
  Image as ImageIcon,
  EyeOff,
  Grid3x3,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ProfessionalShowcasePage() {
  const { locale } = useI18n();
  const {
    showcases = [],
    isLoading,
    error,
    isUploading,
    isDeleting,
    isToggling,
    fetchShowcases,
    uploadShowcase,
    updateShowcase,
    deleteShowcase,
    toggleShowcaseActive,
    clearError,
  } = useShowcaseStore();
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [editingShowcase, setEditingShowcase] = useState<ShowcaseItem | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Mock professional ID - in real app, get from auth or params
  const mockProfessionalId = 24;

  useEffect(() => {
    loadShowcases();
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

  const loadShowcases = async () => {
    try {
      await fetchShowcases(mockProfessionalId);
    } catch (err) {
      // Error handled by store
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        toast({
          title: locale === 'ne' ? 'अमान्य फाइल' : 'Invalid File',
          description: locale === 'ne' 
            ? 'कृपया JPG, JPEG, वा PNG फाइल चयन गर्नुहोस्' 
            : 'Please select a JPG, JPEG, or PNG file',
          variant: 'destructive',
        });
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: locale === 'ne' ? 'फाइल ठूलो छ' : 'File Too Large',
          description: locale === 'ne' 
            ? 'फाइल 5MB भन्दा सानो हुनुपर्छ' 
            : 'File must be less than 5MB',
          variant: 'destructive',
        });
        return;
      }
      
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast({
        title: locale === 'ne' ? 'चेतावनी' : 'Warning',
        description: locale === 'ne' 
          ? 'कृपया फाइल चयन गर्नुहोस्' 
          : 'Please select a file',
        variant: 'destructive',
      });
      return;
    }

    try {
      if (isEditMode && editingShowcase) {
        await updateShowcase(mockProfessionalId, editingShowcase.id, selectedFile, description);
        toast({
          title: locale === 'ne' ? 'सफलता' : 'Success',
          description: locale === 'ne' 
            ? 'शोकेस सफलतापूर्वक अपडेट गरियो' 
            : 'Showcase updated successfully',
        });
        setIsEditMode(false);
        setEditingShowcase(null);
      } else {
        await uploadShowcase(mockProfessionalId, selectedFile, description);
        toast({
          title: locale === 'ne' ? 'सफलता' : 'Success',
          description: locale === 'ne' 
            ? 'शोकेस सफलतापूर्वक अपलोड गरियो' 
            : 'Showcase uploaded successfully',
        });
      }
      
      // Reset form
      setSelectedFile(null);
      setDescription('');
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
    } catch (err) {
      // Error handled by store
    }
  };

  const handleEdit = (showcase: ShowcaseItem) => {
    // Only allow editing if showcase is pending or rejected
    if (showcase.status === ShowcaseStatus.VERIFIED) {
      toast({
        title: locale === 'ne' ? 'चेतावनी' : 'Warning',
        description: locale === 'ne' 
          ? 'सत्यापित शोकेस सम्पादन गर्न सकिँदैन' 
          : 'Verified showcases cannot be edited',
        variant: 'destructive',
      });
      return;
    }
    
    setEditingShowcase(showcase);
    setDescription(showcase.description || '');
    setIsEditMode(true);
    setSelectedFile(null);
    setPreviewUrl(showcase.image_url);
    
    // Scroll to form
    document.getElementById('showcase-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDelete = async (showcaseId: number) => {
    if (!confirm(locale === 'ne' 
      ? 'के तपाईं यो शोकेस मेटाउन निश्चित हुनुहुन्छ?' 
      : 'Are you sure you want to delete this showcase?')) {
      return;
    }
    
    try {
      await deleteShowcase(mockProfessionalId, showcaseId);
      toast({
        title: locale === 'ne' ? 'सफलता' : 'Success',
        description: locale === 'ne' 
          ? 'शोकेस सफलतापूर्वक मेटाइयो' 
          : 'Showcase deleted successfully',
      });
    } catch (err) {
      // Error handled by store
    }
  };

  const handleDownload = (imageUrl: string, showcaseName: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = showcaseName || 'showcase';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleToggleActive = async (showcaseId: number, currentActive: boolean) => {
    try {
      await toggleShowcaseActive(mockProfessionalId, showcaseId, !currentActive);
      toast({
        title: locale === 'ne' ? 'सफलता' : 'Success',
        description: currentActive 
          ? (locale === 'ne' ? 'शोकेस लुकाइयो' : 'Showcase hidden')
          : (locale === 'ne' ? 'शोकेस देखाइयो' : 'Showcase shown'),
      });
    } catch (err) {
      // Error handled by store
    }
  };

  const getStatusBadge = (status: ShowcaseStatus) => {
    switch (status) {
      case ShowcaseStatus.VERIFIED:
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="w-3 h-3 mr-1" />
            {locale === 'ne' ? 'सत्यापित' : 'Verified'}
          </Badge>
        );
      case ShowcaseStatus.REJECTED:
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" />
            {locale === 'ne' ? 'अस्वीकृत' : 'Rejected'}
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-800 hover:bg-yellow-50">
            <Clock className="w-3 h-3 mr-1" />
            {locale === 'ne' ? 'पेन्डिङ' : 'Pending'}
          </Badge>
        );
    }
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditingShowcase(null);
    setSelectedFile(null);
    setDescription('');
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const activeShowcases = showcases.filter(showcase => showcase.is_active);
  const inactiveShowcases = showcases.filter(showcase => !showcase.is_active);
  const pendingShowcases = showcases.filter(showcase => showcase.status === ShowcaseStatus.PENDING);
  const verifiedShowcases = showcases.filter(showcase => showcase.status === ShowcaseStatus.VERIFIED);
  const rejectedShowcases = showcases.filter(showcase => showcase.status === ShowcaseStatus.REJECTED);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {locale === 'ne' ? 'पेशेवर शोकेस' : 'Professional Showcase'}
        </h1>
        <p className="text-muted-foreground">
          {locale === 'ne' 
            ? 'आफ्ना कामहरूको पोर्टफोलियो अपलोड गर्नुहोस्' 
            : 'Upload your work portfolio and showcase your skills'}
        </p>
      </div>

      {/* Upload/Edit Form */}
      <Card className="mb-8" id="showcase-form">
        <CardHeader>
          <CardTitle>
            {isEditMode 
              ? (locale === 'ne' ? 'शोकेस सम्पादन गर्नुहोस्' : 'Edit Showcase')
              : (locale === 'ne' ? 'नयाँ शोकेस अपलोड गर्नुहोस्' : 'Upload New Showcase')
            }
          </CardTitle>
          <CardDescription>
            {locale === 'ne' 
              ? 'JPG, JPEG, वा PNG फाइलहरू (अधिकतम 5MB)' 
              : 'JPG, JPEG, or PNG files (max 5MB)'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* File Upload Section */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="showcase-file">
                    {locale === 'ne' ? 'शोकेस फाइल' : 'Showcase File'} *
                  </Label>
                  <div className="mt-2">
                    <Input
                      id="showcase-file"
                      ref={fileInputRef}
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      onChange={handleFileSelect}
                      className="cursor-pointer"
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      {locale === 'ne' 
                        ? 'आफ्ना कामहरूको उत्कृष्ट फोटोहरू अपलोड गर्नुहोस्' 
                        : 'Upload high-quality photos of your work'}
                    </p>
                  </div>
                </div>

                {/* Preview */}
                {(previewUrl || editingShowcase?.image_url) && (
                  <div className="space-y-2">
                    <Label>{locale === 'ne' ? 'पूर्वावलोकन' : 'Preview'}</Label>
                    <div className="relative border rounded-lg overflow-hidden">
                      <img
                        src={previewUrl || editingShowcase?.image_url || ''}
                        alt="Showcase preview"
                        className="w-full h-48 object-contain bg-gray-50"
                      />
                      <div className="absolute top-2 right-2">
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => window.open(previewUrl || editingShowcase?.image_url || '', '_blank')}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          {locale === 'ne' ? 'हेर्नुहोस्' : 'View'}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Description Section */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="description">
                    {locale === 'ne' ? 'विवरण' : 'Description'}
                  </Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={
                      locale === 'ne' 
                        ? 'उदाहरण: बाथरूम रेनोवेसन, किचन डिजाइन, आदि' 
                        : 'Example: Bathroom renovation, kitchen design, etc.'
                    }
                    className="mt-2 min-h-[120px]"
                  />
                </div>

                {/* Instructions */}
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>
                    {locale === 'ne' ? 'अनुदेशहरू' : 'Instructions'}
                  </AlertTitle>
                  <AlertDescription className="text-sm space-y-1">
                    <p>{locale === 'ne' 
                      ? '• उच्च गुणस्तरका फोटोहरू अपलोड गर्नुहोस्' 
                      : '• Upload high-quality photos'}</p>
                    <p>{locale === 'ne' 
                      ? '• कामको पहिले र पछिका फोटोहरू' 
                      : '• Before and after photos of your work'}</p>
                    <p>{locale === 'ne' 
                      ? '• विभिन्न प्रकारका परियोजनाहरू' 
                      : '• Different types of projects'}</p>
                    <p>{locale === 'ne' 
                      ? '• अधिकतम २० वटा शोकेस अपलोड गर्न सकिन्छ' 
                      : '• Maximum 20 showcases can be uploaded'}</p>
                  </AlertDescription>
                </Alert>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-wrap gap-3">
              <Button 
                type="submit" 
                disabled={isUploading || (!selectedFile && !isEditMode)}
              >
                {isUploading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    {locale === 'ne' ? 'प्रक्रिया हुदैछ...' : 'Processing...'}
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    {isEditMode 
                      ? (locale === 'ne' ? 'अपडेट गर्नुहोस्' : 'Update')
                      : (locale === 'ne' ? 'अपलोड गर्नुहोस्' : 'Upload')
                    }
                  </>
                )}
              </Button>
              
              {isEditMode && (
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={handleCancelEdit}
                >
                  {locale === 'ne' ? 'रद्द गर्नुहोस्' : 'Cancel'}
                </Button>
              )}
              
              <Button 
                type="button" 
                variant="secondary"
                onClick={loadShowcases}
                disabled={isLoading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                {locale === 'ne' ? 'ताजा पार्नुहोस्' : 'Refresh'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Showcases List */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">
            {locale === 'ne' ? 'तपाईंका शोकेसहरू' : 'Your Showcases'}
          </h2>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {showcases.length} {locale === 'ne' ? 'शोकेस' : 'showcases'}
            </Badge>
            {activeShowcases.length > 0 && (
              <Badge className="bg-green-100 text-green-800">
                <Eye className="w-3 h-3 mr-1" />
                {activeShowcases.length} {locale === 'ne' ? 'सक्रिय' : 'active'}
              </Badge>
            )}
            {showcases.length >= 20 && (
              <Badge variant="destructive">
                {locale === 'ne' ? 'सीमा पुग्यो' : 'Limit reached'}
              </Badge>
            )}
          </div>
        </div>

        {isLoading && showcases.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-40 w-full rounded-md" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : showcases.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="mx-auto w-20 h-20 mb-6 flex items-center justify-center rounded-full bg-purple-50">
                <Grid3x3 className="w-10 h-10 text-purple-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {locale === 'ne' ? 'कुनै शोकेस छैन' : 'No Showcases'}
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {locale === 'ne' 
                  ? 'तपाईंले अहिलेसम्म कुनै शोकेस अपलोड गर्नुभएको छैन। आफ्ना कामहरूको पोर्टफोलियो बनाउन शुरू गर्नुहोस्।' 
                  : 'You haven\'t uploaded any showcases yet. Start building your work portfolio.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid grid-cols-5 mb-6">
              <TabsTrigger value="all">
                {locale === 'ne' ? 'सबै' : 'All'} ({showcases.length})
              </TabsTrigger>
              <TabsTrigger value="active">
                {locale === 'ne' ? 'सक्रिय' : 'Active'} ({activeShowcases.length})
              </TabsTrigger>
              <TabsTrigger value="inactive">
                {locale === 'ne' ? 'निष्क्रिय' : 'Inactive'} ({inactiveShowcases.length})
              </TabsTrigger>
              <TabsTrigger value="verified">
                {locale === 'ne' ? 'सत्यापित' : 'Verified'} ({verifiedShowcases.length})
              </TabsTrigger>
              <TabsTrigger value="pending">
                {locale === 'ne' ? 'पेन्डिङ' : 'Pending'} ({pendingShowcases.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-6">
              <ShowcaseGrid 
                showcases={showcases} 
                onEdit={handleEdit}
                onDelete={handleDelete}
                onDownload={handleDownload}
                onToggleActive={handleToggleActive}
                getStatusBadge={getStatusBadge}
                locale={locale}
                isToggling={isToggling}
              />
            </TabsContent>
            
            <TabsContent value="active" className="space-y-6">
              <ShowcaseGrid 
                showcases={activeShowcases} 
                onEdit={handleEdit}
                onDelete={handleDelete}
                onDownload={handleDownload}
                onToggleActive={handleToggleActive}
                getStatusBadge={getStatusBadge}
                locale={locale}
                isToggling={isToggling}
              />
            </TabsContent>
            
            <TabsContent value="inactive" className="space-y-6">
              <ShowcaseGrid 
                showcases={inactiveShowcases} 
                onEdit={handleEdit}
                onDelete={handleDelete}
                onDownload={handleDownload}
                onToggleActive={handleToggleActive}
                getStatusBadge={getStatusBadge}
                locale={locale}
                isToggling={isToggling}
              />
            </TabsContent>
            
            <TabsContent value="verified" className="space-y-6">
              <ShowcaseGrid 
                showcases={verifiedShowcases} 
                onEdit={handleEdit}
                onDelete={handleDelete}
                onDownload={handleDownload}
                onToggleActive={handleToggleActive}
                getStatusBadge={getStatusBadge}
                locale={locale}
                isToggling={isToggling}
              />
            </TabsContent>
            
            <TabsContent value="pending" className="space-y-6">
              <ShowcaseGrid 
                showcases={pendingShowcases} 
                onEdit={handleEdit}
                onDelete={handleDelete}
                onDownload={handleDownload}
                onToggleActive={handleToggleActive}
                getStatusBadge={getStatusBadge}
                locale={locale}
                isToggling={isToggling}
              />
            </TabsContent>
          </Tabs>
        )}
      </div>

      {/* Stats Summary */}
      {showcases.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold">{showcases.length}</div>
                <div className="text-sm text-muted-foreground">
                  {locale === 'ne' ? 'कुल शोकेस' : 'Total Showcases'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {activeShowcases.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  {locale === 'ne' ? 'सक्रिय' : 'Active'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-600">
                  {inactiveShowcases.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  {locale === 'ne' ? 'निष्क्रिय' : 'Inactive'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {verifiedShowcases.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  {locale === 'ne' ? 'सत्यापित' : 'Verified'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600">
                  {pendingShowcases.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  {locale === 'ne' ? 'पेन्डिङ' : 'Pending'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface ShowcaseGridProps {
  showcases: ShowcaseItem[];
  onEdit: (showcase: ShowcaseItem) => void;
  onDelete: (id: number) => void;
  onDownload: (url: string, name: string) => void;
  onToggleActive: (id: number, currentActive: boolean) => void;
  getStatusBadge: (status: ShowcaseStatus) => JSX.Element;
  locale: string;
  isToggling: boolean;
}

function ShowcaseGrid({ 
  showcases, 
  onEdit, 
  onDelete, 
  onDownload, 
  onToggleActive,
  getStatusBadge,
  locale,
  isToggling
}: ShowcaseGridProps) {
  if (showcases.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          {locale === 'ne' 
            ? 'कुनै शोकेस छैन' 
            : 'No showcases in this category'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {showcases.map((showcase) => (
        <Card key={showcase.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <CardContent className="p-0">
            {/* Showcase Image */}
            <div className="relative h-56 bg-gray-100">
              <img
                src={showcase.image_url}
                alt={showcase.description || 'Showcase'}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2">
                {getStatusBadge(showcase.status)}
              </div>
              <div className="absolute top-2 right-2 flex flex-col gap-1">
                {!showcase.is_active && (
                  <Badge variant="outline" className="bg-gray-100">
                    <EyeOff className="w-3 h-3 mr-1" />
                    {locale === 'ne' ? 'लुकेको' : 'Hidden'}
                  </Badge>
                )}
              </div>
            </div>
            
            {/* Showcase Info */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold truncate">
                    {showcase.description || (locale === 'ne' ? 'शोकेस' : 'Showcase')}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    ID: {showcase.id}
                  </p>
                </div>
              </div>
              
              {/* Rejection Reason */}
              {showcase.status === ShowcaseStatus.REJECTED && showcase.reason && (
                <Alert variant="destructive" className="mb-3">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    <span className="font-semibold">
                      {locale === 'ne' ? 'कारण:' : 'Reason:'}
                    </span> {showcase.reason}
                  </AlertDescription>
                </Alert>
              )}
              
              {/* Date and Status */}
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                <span>
                  {new Date(showcase.created_at).toLocaleDateString()}
                </span>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 ${showcase.is_active ? 'text-green-600' : 'text-gray-500'}`}>
                    {showcase.is_active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    {showcase.is_active 
                      ? (locale === 'ne' ? 'सक्रिय' : 'Active') 
                      : (locale === 'ne' ? 'निष्क्रिय' : 'Inactive')}
                  </span>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(showcase)}
                  disabled={showcase.status === ShowcaseStatus.VERIFIED}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  {locale === 'ne' ? 'हेर्नुहोस्/सम्पादन' : 'View/Edit'}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDownload(showcase.image_url, showcase.description || 'showcase')}
                >
                  <Download className="w-4 h-4 mr-1" />
                  {locale === 'ne' ? 'डाउनलोड' : 'Download'}
                </Button>
                
                <div className="flex items-center gap-2">
                  <Switch
                    checked={showcase.is_active}
                    onCheckedChange={() => onToggleActive(showcase.id, showcase.is_active)}
                    disabled={isToggling}
                  />
                  <span className="text-xs text-muted-foreground">
                    {showcase.is_active 
                      ? (locale === 'ne' ? 'लुकाउनुहोस्' : 'Hide') 
                      : (locale === 'ne' ? 'देखाउनुहोस्' : 'Show')}
                  </span>
                </div>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={showcase.status === ShowcaseStatus.VERIFIED}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      {locale === 'ne' ? 'मेटाउनुहोस्' : 'Delete'}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {locale === 'ne' 
                          ? 'शोकेस मेटाउनुहुन्छ?' 
                          : 'Delete Showcase?'}
                      </DialogTitle>
                      <DialogDescription>
                        {locale === 'ne' 
                          ? 'यो कार्य पूर्ववत गर्न सकिँदैन। के तपाईं निश्चित हुनुहुन्छ?' 
                          : 'This action cannot be undone. Are you sure?'}
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button
                        variant="destructive"
                        onClick={() => onDelete(showcase.id)}
                      >
                        {locale === 'ne' ? 'मेटाउनुहोस्' : 'Delete'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
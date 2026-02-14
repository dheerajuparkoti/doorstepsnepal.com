// 'use client';

// import { useState, useEffect, useRef, JSX } from 'react';
// import { useI18n } from '@/lib/i18n/context';
// import { useDocumentStore } from '@/stores/document-store';
// import { VerificationDocument, VerificationStatus } from '@/lib/data/document';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { Label } from '@/components/ui/label';
// import { Badge } from '@/components/ui/badge';
// import { Separator } from '@/components/ui/separator';
// import { Skeleton } from '@/components/ui/skeleton';
// import { toast } from '@/components/ui/use-toast';
// import {
//   Upload,
//   Trash2,
//   Download,
//   Eye,
//   CheckCircle,
//   XCircle,
//   Clock,
//   Plus,
//   RefreshCw,
//   AlertCircle,
//   Image as ImageIcon,
// } from 'lucide-react';
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from '@/components/ui/dialog';
// import {
//   Alert,
//   AlertDescription,
//   AlertTitle,
// } from '@/components/ui/alert';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// export default function ProfessionalVerificationPage() {
//   const { locale } = useI18n();
//   const {
//     documents,
//     isLoading,
//     error,
//     isUploading,
//     isDeleting,
//     fetchDocuments,
//     uploadDocument,
//     updateDocument,
//     deleteDocument,
//     clearError,
//   } = useDocumentStore();
  
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [description, setDescription] = useState('');
//   const [editingDocument, setEditingDocument] = useState<VerificationDocument | null>(null);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [previewUrl, setPreviewUrl] = useState<string | null>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);
  
//   // Mock professional ID - in real app, get from auth or params
//   const mockProfessionalId = 24;

//   useEffect(() => {
//     loadDocuments();
//   }, []);

//   useEffect(() => {
//     if (error) {
//       toast({
//         title: locale === 'ne' ? 'त्रुटि' : 'Error',
//         description: error,
//         variant: 'destructive',
//       });
//       clearError();
//     }
//   }, [error]);

//   const loadDocuments = async () => {
//     try {
//       await fetchDocuments(mockProfessionalId);
//     } catch (err) {
//       // Error handled by store
//     }
//   };

//   const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       // Validate file type
//       const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
//       if (!validTypes.includes(file.type)) {
//         toast({
//           title: locale === 'ne' ? 'अमान्य फाइल' : 'Invalid File',
//           description: locale === 'ne' 
//             ? 'कृपया JPG, JPEG, वा PNG फाइल चयन गर्नुहोस्' 
//             : 'Please select a JPG, JPEG, or PNG file',
//           variant: 'destructive',
//         });
//         return;
//       }
      
//       // Validate file size (max 5MB)
//       if (file.size > 5 * 1024 * 1024) {
//         toast({
//           title: locale === 'ne' ? 'फाइल ठूलो छ' : 'File Too Large',
//           description: locale === 'ne' 
//             ? 'फाइल 5MB भन्दा सानो हुनुपर्छ' 
//             : 'File must be less than 5MB',
//           variant: 'destructive',
//         });
//         return;
//       }
      
//       setSelectedFile(file);
//       setPreviewUrl(URL.createObjectURL(file));
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!selectedFile) {
//       toast({
//         title: locale === 'ne' ? 'चेतावनी' : 'Warning',
//         description: locale === 'ne' 
//           ? 'कृपया फाइल चयन गर्नुहोस्' 
//           : 'Please select a file',
//         variant: 'destructive',
//       });
//       return;
//     }

//     if (!description.trim()) {
//       toast({
//         title: locale === 'ne' ? 'चेतावनी' : 'Warning',
//         description: locale === 'ne' 
//           ? 'कृपया विवरण प्रदान गर्नुहोस्' 
//           : 'Please provide a description',
//         variant: 'destructive',
//       });
//       return;
//     }

//     try {
//       if (isEditMode && editingDocument) {
//         await updateDocument(mockProfessionalId, editingDocument.id, selectedFile, description);
//         toast({
//           title: locale === 'ne' ? 'सफलता' : 'Success',
//           description: locale === 'ne' 
//             ? 'कागजात सफलतापूर्वक अपडेट गरियो' 
//             : 'Document updated successfully',
//         });
//         setIsEditMode(false);
//         setEditingDocument(null);
//       } else {
//         await uploadDocument(mockProfessionalId, selectedFile, description);
//         toast({
//           title: locale === 'ne' ? 'सफलता' : 'Success',
//           description: locale === 'ne' 
//             ? 'कागजात सफलतापूर्वक अपलोड गरियो' 
//             : 'Document uploaded successfully',
//         });
//       }
      
//       // Reset form
//       setSelectedFile(null);
//       setDescription('');
//       setPreviewUrl(null);
//       if (fileInputRef.current) {
//         fileInputRef.current.value = '';
//       }
      
//     } catch (err) {
//       // Error handled by store
//     }
//   };

//  const handleEdit = (doc: VerificationDocument) => {

  
//   // Only allow editing if document is pending or rejected
//   if (doc.status === VerificationStatus.VERIFIED) {
//     toast({
//       title: locale === 'ne' ? 'चेतावनी' : 'Warning',
//       description: locale === 'ne' 
//         ? 'सत्यापित कागजात सम्पादन गर्न सकिँदैन' 
//         : 'Verified documents cannot be edited',
//       variant: 'destructive',
//     });
//     return;
//   }
  
//   setEditingDocument(doc);
//   setDescription(doc.description || '');
//   setIsEditMode(true);
//   setSelectedFile(null);
//   setPreviewUrl(doc.image);

//   if (typeof window !== 'undefined' && typeof document !== 'undefined') {
//     const formElement = document.getElementById('document-form');
//     if (formElement) {
//       formElement.scrollIntoView({ behavior: 'smooth' });
//     }
//   }
// };

//   const handleDelete = async (documentId: number) => {
//     if (!confirm(locale === 'ne' 
//       ? 'के तपाईं यो कागजात मेटाउन निश्चित हुनुहुन्छ?' 
//       : 'Are you sure you want to delete this document?')) {
//       return;
//     }
    
//     try {
//       await deleteDocument(mockProfessionalId, documentId);
//       toast({
//         title: locale === 'ne' ? 'सफलता' : 'Success',
//         description: locale === 'ne' 
//           ? 'कागजात सफलतापूर्वक मेटाइयो' 
//           : 'Document deleted successfully',
//       });
//     } catch (err) {
//       // Error handled by store
//     }
//   };

//   const handleDownload = (imageUrl: string, documentName: string) => {
//     const link = document.createElement('a');
//     link.href = imageUrl;
//     link.download = documentName || 'document';
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const getStatusBadge = (status: VerificationStatus) => {
//     switch (status) {
//       case VerificationStatus.VERIFIED:
//         return (
//           <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
//             <CheckCircle className="w-3 h-3 mr-1" />
//             {locale === 'ne' ? 'सत्यापित' : 'Verified'}
//           </Badge>
//         );
//       case VerificationStatus.REJECTED:
//         return (
//           <Badge variant="destructive">
//             <XCircle className="w-3 h-3 mr-1" />
//             {locale === 'ne' ? 'अस्वीकृत' : 'Rejected'}
//           </Badge>
//         );
//       default:
//         return (
//           <Badge variant="outline" className="bg-yellow-50 text-yellow-800 hover:bg-yellow-50">
//             <Clock className="w-3 h-3 mr-1" />
//             {locale === 'ne' ? 'पेन्डिङ' : 'Pending'}
//           </Badge>
//         );
//     }
//   };

//   const handleCancelEdit = () => {
//     setIsEditMode(false);
//     setEditingDocument(null);
//     setSelectedFile(null);
//     setDescription('');
//     setPreviewUrl(null);
//     if (fileInputRef.current) {
//       fileInputRef.current.value = '';
//     }
//   };

//   const pendingDocuments = documents.filter(doc => doc.status === VerificationStatus.PENDING);
//   const verifiedDocuments = documents.filter(doc => doc.status === VerificationStatus.VERIFIED);
//   const rejectedDocuments = documents.filter(doc => doc.status === VerificationStatus.REJECTED);

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold mb-2">
//           {locale === 'ne' ? 'पेशेवर सत्यापन' : 'Professional Verification'}
//         </h1>
//         <p className="text-muted-foreground">
//           {locale === 'ne' 
//             ? 'अपने पेशेवर प्रमाणपत्र और दस्तावेज़ अपलोड करें' 
//             : 'Upload your professional certificates and documents'}
//         </p>
//       </div>

//       {/* Upload/Edit Form */}
//       <Card className="mb-8" id="document-form">
//         <CardHeader>
//           <CardTitle>
//             {isEditMode 
//               ? (locale === 'ne' ? 'कागजात सम्पादन गर्नुहोस्' : 'Edit Document')
//               : (locale === 'ne' ? 'नयाँ कागजात अपलोड गर्नुहोस्' : 'Upload New Document')
//             }
//           </CardTitle>
//           <CardDescription>
//             {locale === 'ne' 
//               ? 'JPG, JPEG, वा PNG फाइलहरू (अधिकतम 5MB)' 
//               : 'JPG, JPEG, or PNG files (max 5MB)'}
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {/* File Upload Section */}
//               <div className="space-y-4">
//                 <div>
//                   <Label htmlFor="document-file">
//                     {locale === 'ne' ? 'कागजात फाइल' : 'Document File'} *
//                   </Label>
//                   <div className="mt-2">
//                     <Input
//                       id="document-file"
//                       ref={fileInputRef}
//                       type="file"
//                       accept=".jpg,.jpeg,.png"
//                       onChange={handleFileSelect}
//                       className="cursor-pointer"
//                     />
//                     <p className="text-sm text-muted-foreground mt-2">
//                       {locale === 'ne' 
//                         ? 'कृपया स्पष्ट र पढ्न योग्य फाइल अपलोड गर्नुहोस्' 
//                         : 'Please upload clear and readable files'}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Preview */}
//                 {(previewUrl || editingDocument?.image) && (
//                   <div className="space-y-2">
//                     <Label>{locale === 'ne' ? 'पूर्वावलोकन' : 'Preview'}</Label>
//                     <div className="relative border rounded-lg overflow-hidden">
//                       <img
//                         src={previewUrl || editingDocument?.image || ''}
//                         alt="Document preview"
//                         className="w-full h-48 object-contain bg-gray-50"
//                       />
//                       <div className="absolute top-2 right-2">
//                         <Button
//                           type="button"
//                           variant="secondary"
//                           size="sm"
//                           onClick={() => window.open(previewUrl || editingDocument?.image || '', '_blank')}
//                         >
//                           <Eye className="w-4 h-4 mr-1" />
//                           {locale === 'ne' ? 'हेर्नुहोस्' : 'View'}
//                         </Button>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {/* Description Section */}
//               <div className="space-y-4">
//                 <div>
//                   <Label htmlFor="description">
//                     {locale === 'ne' ? 'विवरण' : 'Description'} *
//                   </Label>
//                   <Textarea
//                     id="description"
//                     value={description}
//                     onChange={(e) => setDescription(e.target.value)}
//                     placeholder={
//                       locale === 'ne' 
//                         ? 'उदाहरण: शैक्षिक प्रमाणपत्र, लाइसेन्स, प्रमाणपत्र, आदि' 
//                         : 'Example: Educational certificate, license, certificate, etc.'
//                     }
//                     className="mt-2 min-h-[120px]"
//                     required
//                   />
//                 </div>

//                 {/* Instructions */}
//                 <Alert>
//                   <AlertCircle className="h-4 w-4" />
//                   <AlertTitle>
//                     {locale === 'ne' ? 'अनुदेशहरू' : 'Instructions'}
//                   </AlertTitle>
//                   <AlertDescription className="text-sm">
//                     {locale === 'ne' 
//                       ? '• कागजात स्पष्ट र पढ्न योग्य हुनुपर्छ\n• फोटोको गुणस्तर राम्रो हुनुपर्छ\n• सबै जानकारी दृश्यात्मक हुनुपर्छ\n• अधिकतम 10 वटा कागजात अपलोड गर्न सकिन्छ'
//                       : '• Documents must be clear and readable\n• Photo quality should be good\n• All information should be visible\n• Maximum 10 documents can be uploaded'}
//                   </AlertDescription>
//                 </Alert>
//               </div>
//             </div>

//             {/* Form Actions */}
//             <div className="flex flex-wrap gap-3">
//               <Button 
//                 type="submit" 
//                 disabled={isUploading || (!selectedFile && !isEditMode)}
//               >
//                 {isUploading ? (
//                   <>
//                     <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
//                     {locale === 'ne' ? 'प्रक्रिया हुदैछ...' : 'Processing...'}
//                   </>
//                 ) : (
//                   <>
//                     <Upload className="w-4 h-4 mr-2" />
//                     {isEditMode 
//                       ? (locale === 'ne' ? 'अपडेट गर्नुहोस्' : 'Update')
//                       : (locale === 'ne' ? 'अपलोड गर्नुहोस्' : 'Upload')
//                     }
//                   </>
//                 )}
//               </Button>
              
//               {isEditMode && (
//                 <Button 
//                   type="button" 
//                   variant="outline"
//                   onClick={handleCancelEdit}
//                 >
//                   {locale === 'ne' ? 'रद्द गर्नुहोस्' : 'Cancel'}
//                 </Button>
//               )}
              
//               <Button 
//                 type="button" 
//                 variant="secondary"
//                 onClick={loadDocuments}
//                 disabled={isLoading}
//               >
//                 <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
//                 {locale === 'ne' ? 'ताजा पार्नुहोस्' : 'Refresh'}
//               </Button>
//             </div>
//           </form>
//         </CardContent>
//       </Card>

//       {/* Documents List */}
//       <div className="mb-8">
//         <div className="flex items-center justify-between mb-6">
//           <h2 className="text-2xl font-semibold">
//             {locale === 'ne' ? 'तपाईंका कागजातहरू' : 'Your Documents'}
//           </h2>
//           <div className="flex items-center gap-2">
//             <Badge variant="outline">
//               {documents.length} {locale === 'ne' ? 'कागजात' : 'documents'}
//             </Badge>
//             {documents.length >= 10 && (
//               <Badge variant="destructive">
//                 {locale === 'ne' ? 'सीमा पुग्यो' : 'Limit reached'}
//               </Badge>
//             )}
//           </div>
//         </div>

//         {isLoading && documents.length === 0 ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {[...Array(3)].map((_, i) => (
//               <Card key={i}>
//                 <CardContent className="p-6">
//                   <div className="space-y-3">
//                     <Skeleton className="h-6 w-3/4" />
//                     <Skeleton className="h-4 w-full" />
//                     <Skeleton className="h-4 w-2/3" />
//                     <Skeleton className="h-40 w-full rounded-md" />
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         ) : documents.length === 0 ? (
//           <Card>
//             <CardContent className="p-12 text-center">
//               <div className="mx-auto w-20 h-20 mb-6 flex items-center justify-center rounded-full bg-blue-50">
//                 <ImageIcon className="w-10 h-10 text-blue-500" />
//               </div>
//               <h3 className="text-lg font-semibold mb-2">
//                 {locale === 'ne' ? 'कुनै कागजात छैन' : 'No Documents'}
//               </h3>
//               <p className="text-muted-foreground mb-6 max-w-md mx-auto">
//                 {locale === 'ne' 
//                   ? 'तपाईंले अहिलेसम्म कुनै कागजात अपलोड गर्नुभएको छैन। सत्यापनको लागि आफ्ना कागजातहरू अपलोड गर्नुहोस्।' 
//                   : 'You haven\'t uploaded any documents yet. Upload your documents for verification.'}
//               </p>
//             </CardContent>
//           </Card>
//         ) : (
//           <Tabs defaultValue="all" className="w-full">
//             <TabsList className="grid grid-cols-4 mb-6">
//               <TabsTrigger value="all">
//                 {locale === 'ne' ? 'सबै' : 'All'} ({documents.length})
//               </TabsTrigger>
//               <TabsTrigger value="pending">
//                 {locale === 'ne' ? 'पेन्डिङ' : 'Pending'} ({pendingDocuments.length})
//               </TabsTrigger>
//               <TabsTrigger value="verified">
//                 {locale === 'ne' ? 'सत्यापित' : 'Verified'} ({verifiedDocuments.length})
//               </TabsTrigger>
//               <TabsTrigger value="rejected">
//                 {locale === 'ne' ? 'अस्वीकृत' : 'Rejected'} ({rejectedDocuments.length})
//               </TabsTrigger>
//             </TabsList>
            
//             <TabsContent value="all" className="space-y-6">
//               <DocumentGrid 
//                 documents={documents} 
//                 onEdit={handleEdit}
//                 onDelete={handleDelete}
//                 onDownload={handleDownload}
//                 getStatusBadge={getStatusBadge}
//                 locale={locale}
//               />
//             </TabsContent>
            
//             <TabsContent value="pending" className="space-y-6">
//               <DocumentGrid 
//                 documents={pendingDocuments} 
//                 onEdit={handleEdit}
//                 onDelete={handleDelete}
//                 onDownload={handleDownload}
//                 getStatusBadge={getStatusBadge}
//                 locale={locale}
//               />
//             </TabsContent>
            
//             <TabsContent value="verified" className="space-y-6">
//               <DocumentGrid 
//                 documents={verifiedDocuments} 
//                 onEdit={handleEdit}
//                 onDelete={handleDelete}
//                 onDownload={handleDownload}
//                 getStatusBadge={getStatusBadge}
//                 locale={locale}
//               />
//             </TabsContent>
            
//             <TabsContent value="rejected" className="space-y-6">
//               <DocumentGrid 
//                 documents={rejectedDocuments} 
//                 onEdit={handleEdit}
//                 onDelete={handleDelete}
//                 onDownload={handleDownload}
//                 getStatusBadge={getStatusBadge}
//                 locale={locale}
//               />
//             </TabsContent>
//           </Tabs>
//         )}
//       </div>

//       {/* Stats Summary */}
//       {documents.length > 0 && (
//         <Card>
//           <CardContent className="p-6">
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//               <div className="text-center">
//                 <div className="text-3xl font-bold">{documents.length}</div>
//                 <div className="text-sm text-muted-foreground">
//                   {locale === 'ne' ? 'कुल कागजात' : 'Total Documents'}
//                 </div>
//               </div>
//               <div className="text-center">
//                 <div className="text-3xl font-bold text-green-600">
//                   {verifiedDocuments.length}
//                 </div>
//                 <div className="text-sm text-muted-foreground">
//                   {locale === 'ne' ? 'सत्यापित' : 'Verified'}
//                 </div>
//               </div>
//               <div className="text-center">
//                 <div className="text-3xl font-bold text-yellow-600">
//                   {pendingDocuments.length}
//                 </div>
//                 <div className="text-sm text-muted-foreground">
//                   {locale === 'ne' ? 'पेन्डिङ' : 'Pending'}
//                 </div>
//               </div>
//               <div className="text-center">
//                 <div className="text-3xl font-bold text-red-600">
//                   {rejectedDocuments.length}
//                 </div>
//                 <div className="text-sm text-muted-foreground">
//                   {locale === 'ne' ? 'अस्वीकृत' : 'Rejected'}
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   );
// }

// interface DocumentGridProps {
//   documents: VerificationDocument[];
//   onEdit: (doc: VerificationDocument) => void;
//   onDelete: (id: number) => void;
//   onDownload: (url: string, name: string) => void;
//   getStatusBadge: (status: VerificationStatus) => JSX.Element;
//   locale: string;
// }

// function DocumentGrid({ 
//   documents, 
//   onEdit, 
//   onDelete, 
//   onDownload, 
//   getStatusBadge,
//   locale 
// }: DocumentGridProps) {
//   if (documents.length === 0) {
//     return (
//       <div className="text-center py-12">
//         <p className="text-muted-foreground">
//           {locale === 'ne' 
//             ? 'कुनै कागजात छैन' 
//             : 'No documents in this category'}
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//       {documents.map((doc) => (
//         <Card key={doc.id} className="overflow-hidden">
//           <CardContent className="p-0">
//             {/* Document Image */}
//             <div className="relative h-48 bg-gray-100">
//               <img
//                 src={doc.image}
//                 alt={doc.description || 'Document'}
//                 className="w-full h-full object-contain"
//               />
//               <div className="absolute top-2 right-2">
//                 {getStatusBadge(doc.status)}
//               </div>
//             </div>
            
//             {/* Document Info */}
//             <div className="p-4">
//               <div className="flex items-start justify-between mb-2">
//                 <div>
//                   <h3 className="font-semibold truncate">
//                     {doc.description || (locale === 'ne' ? 'कागजात' : 'Document')}
//                   </h3>
//                   <p className="text-sm text-muted-foreground">
//                     ID: {doc.id}
//                   </p>
//                 </div>
//               </div>
              
//               {/* Rejection Reason */}
//               {doc.status === VerificationStatus.REJECTED && doc.reason && (
//                 <Alert variant="destructive" className="mb-3">
//                   <AlertCircle className="h-4 w-4" />
//                   <AlertDescription className="text-sm">
//                     <span className="font-semibold">
//                       {locale === 'ne' ? 'कारण:' : 'Reason:'}
//                     </span> {doc.reason}
//                   </AlertDescription>
//                 </Alert>
//               )}
              
//               {/* Document Date */}
//               {doc.created_at && (
//                 <p className="text-xs text-muted-foreground mb-4">
//                   {locale === 'ne' ? 'अपलोड मिति:' : 'Uploaded:'}{' '}
//                   {new Date(doc.created_at).toLocaleDateString()}
//                 </p>
//               )}
              
//               {/* Actions */}
//               <div className="flex flex-wrap gap-2">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => onEdit(doc)}
//                   disabled={doc.status === VerificationStatus.VERIFIED}
//                 >
//                   <Eye className="w-4 h-4 mr-1" />
//                   {locale === 'ne' ? 'हेर्नुहोस्/सम्पादन' : 'View/Edit'}
//                 </Button>
                
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => onDownload(doc.image, doc.description || 'document')}
//                 >
//                   <Download className="w-4 h-4 mr-1" />
//                   {locale === 'ne' ? 'डाउनलोड' : 'Download'}
//                 </Button>
                
//                 <Dialog>
//                   <DialogTrigger asChild>
//                     <Button
//                       variant="destructive"
//                       size="sm"
//                       disabled={doc.status === VerificationStatus.VERIFIED}
//                     >
//                       <Trash2 className="w-4 h-4 mr-1" />
//                       {locale === 'ne' ? 'मेटाउनुहोस्' : 'Delete'}
//                     </Button>
//                   </DialogTrigger>
//                   <DialogContent>
//                     <DialogHeader>
//                       <DialogTitle>
//                         {locale === 'ne' 
//                           ? 'कागजात मेटाउनुहुन्छ?' 
//                           : 'Delete Document?'}
//                       </DialogTitle>
//                       <DialogDescription>
//                         {locale === 'ne' 
//                           ? 'यो कार्य पूर्ववत गर्न सकिँदैन। के तपाईं निश्चित हुनुहुन्छ?' 
//                           : 'This action cannot be undone. Are you sure?'}
//                       </DialogDescription>
//                     </DialogHeader>
//                     <DialogFooter>
//                       <Button
//                         variant="destructive"
//                         onClick={() => onDelete(doc.id)}
//                       >
//                         {locale === 'ne' ? 'मेटाउनुहोस्' : 'Delete'}
//                       </Button>
//                     </DialogFooter>
//                   </DialogContent>
//                 </Dialog>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       ))}
//     </div>
//   );
// }


'use client';

import { useState, useEffect, useRef, JSX } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { useDocumentStore } from '@/stores/document-store';
import { VerificationDocument, VerificationStatus } from '@/lib/data/document';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';
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
  ArrowRight,
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

interface ProfessionalVerificationPageProps {
  isOnboarding?: boolean;
  professionalId?: number;
  onNext?: () => void;
  onSkip?: () => void;
}

export default function ProfessionalVerificationPage({ 
  isOnboarding = false,
  professionalId,
  onNext,
  onSkip 
}: ProfessionalVerificationPageProps) {
  const { locale } = useI18n();
  const {
    documents,
    isLoading,
    error,
    isUploading,
    isDeleting,
    fetchDocuments,
    uploadDocument,
    updateDocument,
    deleteDocument,
    clearError,
  } = useDocumentStore();
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [editingDocument, setEditingDocument] = useState<VerificationDocument | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Use provided professionalId or default to mock ID
  const currentProfessionalId = professionalId || 24;

  useEffect(() => {
    loadDocuments();
  }, [currentProfessionalId]);

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

  const loadDocuments = async () => {
    try {
      await fetchDocuments(currentProfessionalId);
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

    if (!description.trim()) {
      toast({
        title: locale === 'ne' ? 'चेतावनी' : 'Warning',
        description: locale === 'ne' 
          ? 'कृपया विवरण प्रदान गर्नुहोस्' 
          : 'Please provide a description',
        variant: 'destructive',
      });
      return;
    }

    try {
      if (isEditMode && editingDocument) {
        await updateDocument(currentProfessionalId, editingDocument.id, selectedFile, description);
        toast({
          title: locale === 'ne' ? 'सफलता' : 'Success',
          description: locale === 'ne' 
            ? 'कागजात सफलतापूर्वक अपडेट गरियो' 
            : 'Document updated successfully',
        });
        setIsEditMode(false);
        setEditingDocument(null);
      } else {
        await uploadDocument(currentProfessionalId, selectedFile, description);
        toast({
          title: locale === 'ne' ? 'सफलता' : 'Success',
          description: locale === 'ne' 
            ? 'कागजात सफलतापूर्वक अपलोड गरियो' 
            : 'Document uploaded successfully',
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

  const handleEdit = (doc: VerificationDocument) => {
    // Only allow editing if document is pending or rejected
    if (doc.status === VerificationStatus.VERIFIED) {
      toast({
        title: locale === 'ne' ? 'चेतावनी' : 'Warning',
        description: locale === 'ne' 
          ? 'सत्यापित कागजात सम्पादन गर्न सकिँदैन' 
          : 'Verified documents cannot be edited',
        variant: 'destructive',
      });
      return;
    }
    
    setEditingDocument(doc);
    setDescription(doc.description || '');
    setIsEditMode(true);
    setSelectedFile(null);
    setPreviewUrl(doc.image);

    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      const formElement = document.getElementById('document-form');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleDelete = async (documentId: number) => {
    if (!confirm(locale === 'ne' 
      ? 'के तपाईं यो कागजात मेटाउन निश्चित हुनुहुन्छ?' 
      : 'Are you sure you want to delete this document?')) {
      return;
    }
    
    try {
      await deleteDocument(currentProfessionalId, documentId);
      toast({
        title: locale === 'ne' ? 'सफलता' : 'Success',
        description: locale === 'ne' 
          ? 'कागजात सफलतापूर्वक मेटाइयो' 
          : 'Document deleted successfully',
      });
    } catch (err) {
      // Error handled by store
    }
  };

  const handleDownload = (imageUrl: string, documentName: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = documentName || 'document';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: VerificationStatus) => {
    switch (status) {
      case VerificationStatus.VERIFIED:
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="w-3 h-3 mr-1" />
            {locale === 'ne' ? 'सत्यापित' : 'Verified'}
          </Badge>
        );
      case VerificationStatus.REJECTED:
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
    setEditingDocument(null);
    setSelectedFile(null);
    setDescription('');
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleNext = () => {
    if (documents.length === 0) {
      toast({
        title: locale === 'ne' ? 'चेतावनी' : 'Warning',
        description: locale === 'ne' 
          ? 'कृपया कम्तीमा एउटा कागजात अपलोड गर्नुहोस्' 
          : 'Please upload at least one document',
        variant: 'destructive',
      });
      return;
    }
    onNext?.();
  };

  const pendingDocuments = documents.filter(doc => doc.status === VerificationStatus.PENDING);
  const verifiedDocuments = documents.filter(doc => doc.status === VerificationStatus.VERIFIED);
  const rejectedDocuments = documents.filter(doc => doc.status === VerificationStatus.REJECTED);

  const hasDocuments = documents.length > 0;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Onboarding Header */}
      {isOnboarding && (
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {locale === 'ne' ? 'कागजात सत्यापन' : 'Document Verification'}
              </h1>
              <p className="text-muted-foreground">
                {locale === 'ne' 
                  ? 'आफ्नो पहिचान र योग्यता प्रमाणित गर्न कागजातहरू अपलोड गर्नुहोस्' 
                  : 'Upload documents to verify your identity and qualifications'}
              </p>
            </div>
            
            {/* Skip Option for Onboarding */}
            {onSkip && (
              <Button variant="ghost" onClick={onSkip}>
                {locale === 'ne' ? 'छोड्नुहोस्' : 'Skip for now'}
              </Button>
            )}
          </div>
          
          {/* Progress Indicator */}
          <div className="mt-4 flex items-center gap-2">
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-500"
                style={{ width: hasDocuments ? '100%' : '50%' }}
              />
            </div>
            <span className="text-sm text-muted-foreground">
              {hasDocuments 
                ? (locale === 'ne' ? 'चरण २/२ पूरा' : 'Step 2/2 Complete')
                : (locale === 'ne' ? 'चरण २/२' : 'Step 2/2')
              }
            </span>
          </div>
        </div>
      )}

      {/* Regular Dashboard Header */}
      {!isOnboarding && (
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {locale === 'ne' ? 'पेशेवर सत्यापन' : 'Professional Verification'}
          </h1>
          <p className="text-muted-foreground">
            {locale === 'ne' 
              ? 'अपने पेशेवर प्रमाणपत्र और दस्तावेज़ अपलोड करें' 
              : 'Upload your professional certificates and documents'}
          </p>
        </div>
      )}

      {/* Upload/Edit Form */}
      <Card className="mb-8" id="document-form">
        <CardHeader>
          <CardTitle>
            {isEditMode 
              ? (locale === 'ne' ? 'कागजात सम्पादन गर्नुहोस्' : 'Edit Document')
              : (locale === 'ne' ? 'नयाँ कागजात अपलोड गर्नुहोस्' : 'Upload New Document')
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
                  <Label htmlFor="document-file">
                    {locale === 'ne' ? 'कागजात फाइल' : 'Document File'} *
                  </Label>
                  <div className="mt-2">
                    <Input
                      id="document-file"
                      ref={fileInputRef}
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      onChange={handleFileSelect}
                      className="cursor-pointer"
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      {locale === 'ne' 
                        ? 'कृपया स्पष्ट र पढ्न योग्य फाइल अपलोड गर्नुहोस्' 
                        : 'Please upload clear and readable files'}
                    </p>
                  </div>
                </div>

                {/* Preview */}
                {(previewUrl || editingDocument?.image) && (
                  <div className="space-y-2">
                    <Label>{locale === 'ne' ? 'पूर्वावलोकन' : 'Preview'}</Label>
                    <div className="relative border rounded-lg overflow-hidden">
                      <img
                        src={previewUrl || editingDocument?.image || ''}
                        alt="Document preview"
                        className="w-full h-48 object-contain bg-gray-50"
                      />
                      <div className="absolute top-2 right-2">
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => window.open(previewUrl || editingDocument?.image || '', '_blank')}
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
                    {locale === 'ne' ? 'विवरण' : 'Description'} *
                  </Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={
                      locale === 'ne' 
                        ? 'उदाहरण: शैक्षिक प्रमाणपत्र, लाइसेन्स, प्रमाणपत्र, आदि' 
                        : 'Example: Educational certificate, license, certificate, etc.'
                    }
                    className="mt-2 min-h-[120px]"
                    required
                  />
                </div>

                {/* Instructions */}
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>
                    {locale === 'ne' ? 'अनुदेशहरू' : 'Instructions'}
                  </AlertTitle>
                  <AlertDescription className="text-sm">
                    {locale === 'ne' 
                      ? '• कागजात स्पष्ट र पढ्न योग्य हुनुपर्छ\n• फोटोको गुणस्तर राम्रो हुनुपर्छ\n• सबै जानकारी दृश्यात्मक हुनुपर्छ\n• अधिकतम 10 वटा कागजात अपलोड गर्न सकिन्छ'
                      : '• Documents must be clear and readable\n• Photo quality should be good\n• All information should be visible\n• Maximum 10 documents can be uploaded'}
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
                onClick={loadDocuments}
                disabled={isLoading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                {locale === 'ne' ? 'ताजा पार्नुहोस्' : 'Refresh'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Documents List */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">
            {locale === 'ne' ? 'तपाईंका कागजातहरू' : 'Your Documents'}
          </h2>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {documents.length} {locale === 'ne' ? 'कागजात' : 'documents'}
            </Badge>
            {documents.length >= 10 && (
              <Badge variant="destructive">
                {locale === 'ne' ? 'सीमा पुग्यो' : 'Limit reached'}
              </Badge>
            )}
          </div>
        </div>

        {isLoading && documents.length === 0 ? (
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
        ) : documents.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="mx-auto w-20 h-20 mb-6 flex items-center justify-center rounded-full bg-blue-50">
                <ImageIcon className="w-10 h-10 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {locale === 'ne' ? 'कुनै कागजात छैन' : 'No Documents'}
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {locale === 'ne' 
                  ? 'तपाईंले अहिलेसम्म कुनै कागजात अपलोड गर्नुभएको छैन। सत्यापनको लागि आफ्ना कागजातहरू अपलोड गर्नुहोस्।' 
                  : 'You haven\'t uploaded any documents yet. Upload your documents for verification.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="all">
                {locale === 'ne' ? 'सबै' : 'All'} ({documents.length})
              </TabsTrigger>
              <TabsTrigger value="pending">
                {locale === 'ne' ? 'पेन्डिङ' : 'Pending'} ({pendingDocuments.length})
              </TabsTrigger>
              <TabsTrigger value="verified">
                {locale === 'ne' ? 'सत्यापित' : 'Verified'} ({verifiedDocuments.length})
              </TabsTrigger>
              <TabsTrigger value="rejected">
                {locale === 'ne' ? 'अस्वीकृत' : 'Rejected'} ({rejectedDocuments.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-6">
              <DocumentGrid 
                documents={documents} 
                onEdit={handleEdit}
                onDelete={handleDelete}
                onDownload={handleDownload}
                getStatusBadge={getStatusBadge}
                locale={locale}
              />
            </TabsContent>
            
            <TabsContent value="pending" className="space-y-6">
              <DocumentGrid 
                documents={pendingDocuments} 
                onEdit={handleEdit}
                onDelete={handleDelete}
                onDownload={handleDownload}
                getStatusBadge={getStatusBadge}
                locale={locale}
              />
            </TabsContent>
            
            <TabsContent value="verified" className="space-y-6">
              <DocumentGrid 
                documents={verifiedDocuments} 
                onEdit={handleEdit}
                onDelete={handleDelete}
                onDownload={handleDownload}
                getStatusBadge={getStatusBadge}
                locale={locale}
              />
            </TabsContent>
            
            <TabsContent value="rejected" className="space-y-6">
              <DocumentGrid 
                documents={rejectedDocuments} 
                onEdit={handleEdit}
                onDelete={handleDelete}
                onDownload={handleDownload}
                getStatusBadge={getStatusBadge}
                locale={locale}
              />
            </TabsContent>
          </Tabs>
        )}
      </div>

      {/* Stats Summary */}
      {documents.length > 0 && (
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold">{documents.length}</div>
                <div className="text-sm text-muted-foreground">
                  {locale === 'ne' ? 'कुल कागजात' : 'Total Documents'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {verifiedDocuments.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  {locale === 'ne' ? 'सत्यापित' : 'Verified'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600">
                  {pendingDocuments.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  {locale === 'ne' ? 'पेन्डिङ' : 'Pending'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">
                  {rejectedDocuments.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  {locale === 'ne' ? 'अस्वीकृत' : 'Rejected'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Onboarding Navigation */}
      {isOnboarding && (
        <div className="flex justify-end gap-4 pt-6 border-t">
          <Button
            size="lg"
            onClick={handleNext}
            disabled={!hasDocuments}
            className="min-w-[200px] bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
          >
            {locale === 'ne' ? 'अर्को चरणमा जानुहोस्' : 'Continue to Next Step'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}

interface DocumentGridProps {
  documents: VerificationDocument[];
  onEdit: (doc: VerificationDocument) => void;
  onDelete: (id: number) => void;
  onDownload: (url: string, name: string) => void;
  getStatusBadge: (status: VerificationStatus) => JSX.Element;
  locale: string;
}

function DocumentGrid({ 
  documents, 
  onEdit, 
  onDelete, 
  onDownload, 
  getStatusBadge,
  locale 
}: DocumentGridProps) {
  if (documents.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          {locale === 'ne' 
            ? 'कुनै कागजात छैन' 
            : 'No documents in this category'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {documents.map((doc) => (
        <Card key={doc.id} className="overflow-hidden">
          <CardContent className="p-0">
            {/* Document Image */}
            <div className="relative h-48 bg-gray-100">
              <img
                src={doc.image}
                alt={doc.description || 'Document'}
                className="w-full h-full object-contain"
              />
              <div className="absolute top-2 right-2">
                {getStatusBadge(doc.status)}
              </div>
            </div>
            
            {/* Document Info */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold truncate">
                    {doc.description || (locale === 'ne' ? 'कागजात' : 'Document')}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    ID: {doc.id}
                  </p>
                </div>
              </div>
              
              {/* Rejection Reason */}
              {doc.status === VerificationStatus.REJECTED && doc.reason && (
                <Alert variant="destructive" className="mb-3">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    <span className="font-semibold">
                      {locale === 'ne' ? 'कारण:' : 'Reason:'}
                    </span> {doc.reason}
                  </AlertDescription>
                </Alert>
              )}
              
              {/* Document Date */}
              {doc.created_at && (
                <p className="text-xs text-muted-foreground mb-4">
                  {locale === 'ne' ? 'अपलोड मिति:' : 'Uploaded:'}{' '}
                  {new Date(doc.created_at).toLocaleDateString()}
                </p>
              )}
              
              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(doc)}
                  disabled={doc.status === VerificationStatus.VERIFIED}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  {locale === 'ne' ? 'हेर्नुहोस्/सम्पादन' : 'View/Edit'}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDownload(doc.image, doc.description || 'document')}
                >
                  <Download className="w-4 h-4 mr-1" />
                  {locale === 'ne' ? 'डाउनलोड' : 'Download'}
                </Button>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={doc.status === VerificationStatus.VERIFIED}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      {locale === 'ne' ? 'मेटाउनुहोस्' : 'Delete'}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {locale === 'ne' 
                          ? 'कागजात मेटाउनुहुन्छ?' 
                          : 'Delete Document?'}
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
                        onClick={() => onDelete(doc.id)}
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
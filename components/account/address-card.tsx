// components/account/address-card.tsx
'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { Address, AddressType } from '@/lib/data/address';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Home, 
  Building, 
  Navigation, 
  Edit, 
  Trash2,
  AlertCircle, 
  Loader2
} from 'lucide-react';
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

interface AddressCardProps {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (addressId: number) => Promise<void>;
  isDeleting?: boolean;
}

export function AddressCard({ 
  address, 
  onEdit, 
  onDelete, 
  isDeleting = false 
}: AddressCardProps) {
  const { locale } = useI18n();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const getTypeBadge = (type: AddressType) => {
    if (type === 'permanent') {
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          {locale === 'ne' ? 'स्थायी' : 'Permanent'}
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
        {locale === 'ne' ? 'अस्थायी' : 'Temporary'}
      </Badge>
    );
  };

  const handleDelete = async () => {
    await onDelete(address.id);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <Card className="border hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${
                address.type === 'permanent' 
                  ? 'bg-blue-50' 
                  : 'bg-amber-50'
              }`}>
                <MapPin className={`h-5 w-5 ${
                  address.type === 'permanent'
                    ? 'text-blue-600'
                    : 'text-amber-600'
                }`} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">
                    {address.type === 'permanent'
                      ? locale === 'ne' ? 'स्थायी ठेगाना' : 'Permanent Address'
                      : locale === 'ne' ? 'अस्थायी ठेगाना' : 'Temporary Address'
                    }
                  </h3>
                  {getTypeBadge(address.type)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {address.full_address}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(address)}
                className="h-8 w-8"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowDeleteDialog(true)}
                className="h-8 w-8 text-destructive hover:text-destructive"
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t">
            <div className="flex items-center gap-2">
              <Building className="h-3 w-3 text-gray-400" />
              <span className="text-xs text-muted-foreground">
                {locale === 'ne' ? 'प्रदेश' : 'Province'}:
              </span>
              <span className="text-xs font-medium">{address.province}</span>
            </div>
            <div className="flex items-center gap-2">
              <Navigation className="h-3 w-3 text-gray-400" />
              <span className="text-xs text-muted-foreground">
                {locale === 'ne' ? 'जिल्ला' : 'District'}:
              </span>
              <span className="text-xs font-medium">{address.district}</span>
            </div>
            <div className="flex items-center gap-2">
              <Home className="h-3 w-3 text-gray-400" />
              <span className="text-xs text-muted-foreground">
                {locale === 'ne' ? 'नगरपालिका' : 'Municipality'}:
              </span>
              <span className="text-xs font-medium">{address.municipality}</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-3 w-3 text-gray-400" />
              <span className="text-xs text-muted-foreground">
                {locale === 'ne' ? 'वडा' : 'Ward'}:
              </span>
              <span className="text-xs font-medium">{address.ward_no}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {locale === 'ne' ? 'ठेगाना हटाउने पुष्टि' : 'Delete Address Confirmation'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {locale === 'ne'
                ? `के तपाईं यो ${address.type === 'permanent' ? 'स्थायी' : 'अस्थायी'} ठेगाना हटाउन चाहनुहुन्छ? यो कार्य पछि फिर्ता गर्न सकिने छैन।`
                : `Are you sure you want to delete this ${address.type} address? This action cannot be undone.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              {locale === 'ne' ? 'रद्द गर्नुहोस्' : 'Cancel'}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {locale === 'ne' ? 'हटाउँदै...' : 'Deleting...'}
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  {locale === 'ne' ? 'हटाउनुहोस्' : 'Delete'}
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
// components/account/address-section.tsx
'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { useAddressStore, useAddresses, useAddressLoading, useAddressUpdating } from '@/stores/address-store';
import { Address, CreateAddressRequest, AddressType } from '@/lib/data/address';
import { AddressCard } from './address-card';
import { AddressDialog } from './address-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { 
  MapPin, 
  Plus, 
  Home, 
  Briefcase,
  RefreshCw 
} from 'lucide-react';

interface AddressSectionProps {
  userId?: number;
}

export function AddressSection({ userId }: AddressSectionProps) {
  const { locale } = useI18n();
  
  // Zustand store
  const addresses = useAddresses();
  const isLoading = useAddressLoading();
  const isUpdating = useAddressUpdating();
  const { fetchAddresses, createAddress, updateAddress, deleteAddress } = useAddressStore();
  
  const [showAddressDialog, setShowAddressDialog] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [dialogType, setDialogType] = useState<AddressType>('permanent');

  useEffect(() => {
    fetchAddresses();
  }, []);

  const permanentAddress = addresses.find(addr => addr.type === 'permanent');
  const temporaryAddress = addresses.find(addr => addr.type === 'temporary');

  const handleAddAddress = async (data: CreateAddressRequest) => {
    try {
      await createAddress(data);
      toast.success(
        locale === 'ne'
          ? 'ठेगाना सफलतापूर्वक थपियो'
          : 'Address added successfully'
      );
      setShowAddressDialog(false);
    } catch (error) {
      toast.error(
        locale === 'ne'
          ? 'ठेगाना थप्न असफल'
          : 'Failed to add address'
      );
    }
  };

  const handleUpdateAddress = async (addressId: number, data: CreateAddressRequest) => {
    try {
      await updateAddress(addressId, data);
      toast.success(
        locale === 'ne'
          ? 'ठेगाना सफलतापूर्वक अद्यावधिक गरियो'
          : 'Address updated successfully'
      );
      setEditingAddress(null);
      setShowAddressDialog(false);
    } catch (error) {
      toast.error(
        locale === 'ne'
          ? 'ठेगाना अद्यावधिक गर्न असफल'
          : 'Failed to update address'
      );
    }
  };

  const handleDeleteAddress = async (addressId: number) => {
    try {
      await deleteAddress(addressId);
      toast.success(
        locale === 'ne'
          ? 'ठेगाना सफलतापूर्वक हटाइयो'
          : 'Address deleted successfully'
      );
    } catch (error) {
      toast.error(
        locale === 'ne'
          ? 'ठेगाना हटाउन असफल'
          : 'Failed to delete address'
      );
    }
  };

  const handleEditClick = (address: Address) => {
    setEditingAddress(address);
    setDialogType(address.type);
    setShowAddressDialog(true);
  };

  const handleAddClick = (type: AddressType) => {
    setEditingAddress(null);
    setDialogType(type);
    setShowAddressDialog(true);
  };

  const handleDialogSubmit = async (data: any) => {
    if (editingAddress) {
      await handleUpdateAddress(editingAddress.id, data);
    } else {
      await handleAddAddress(data);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <MapPin className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <CardTitle>
                  {locale === 'ne' ? 'ठेगानाहरू' : 'Addresses'}
                </CardTitle>
                <CardDescription>
                  {locale === 'ne'
                    ? 'आफ्नो स्थायी र अस्थायी ठेगाना व्यवस्थापन गर्नुहोस्'
                    : 'Manage your permanent and temporary addresses'}
                </CardDescription>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchAddresses(true)}
              disabled={isLoading}
              className="gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              {locale === 'ne' ? 'ताजा पार्नुहोस्' : 'Refresh'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Permanent Address */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Home className="h-4 w-4 text-blue-600" />
                <h3 className="font-semibold">
                  {locale === 'ne' ? 'स्थायी ठेगाना' : 'Permanent Address'}
                </h3>
              </div>
              {!permanentAddress && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleAddClick('permanent')}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  {locale === 'ne' ? 'थप्नुहोस्' : 'Add'}
                </Button>
              )}
            </div>
            
            {permanentAddress ? (
              <AddressCard
                address={permanentAddress}
                onEdit={handleEditClick}
                onDelete={handleDeleteAddress}
                isDeleting={isUpdating}
              />
            ) : (
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <Home className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                  {locale === 'ne'
                    ? 'कुनै स्थायी ठेगाना छैन'
                    : 'No permanent address added'}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddClick('permanent')}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  {locale === 'ne' ? 'स्थायी ठेगाना थप्नुहोस्' : 'Add Permanent Address'}
                </Button>
              </div>
            )}
          </div>

          {/* Temporary Address */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-amber-600" />
                <h3 className="font-semibold">
                  {locale === 'ne' ? 'अस्थायी ठेगाना' : 'Temporary Address'}
                </h3>
              </div>
              {!temporaryAddress && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleAddClick('temporary')}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  {locale === 'ne' ? 'थप्नुहोस्' : 'Add'}
                </Button>
              )}
            </div>
            
            {temporaryAddress ? (
              <AddressCard
                address={temporaryAddress}
                onEdit={handleEditClick}
                onDelete={handleDeleteAddress}
                isDeleting={isUpdating}
              />
            ) : (
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <Briefcase className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                  {locale === 'ne'
                    ? 'कुनै अस्थायी ठेगाना छैन'
                    : 'No temporary address added'}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddClick('temporary')}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  {locale === 'ne' ? 'अस्थायी ठेगाना थप्नुहोस्' : 'Add Temporary Address'}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Address Dialog */}
      <AddressDialog
        open={showAddressDialog}
        onOpenChange={setShowAddressDialog}
        onSubmit={handleDialogSubmit}
        initialData={editingAddress ? {
          type: editingAddress.type,
          province: editingAddress.province,
          district: editingAddress.district,
          municipality: editingAddress.municipality,
          ward_no: editingAddress.ward_no,
          street_address: editingAddress.street_address,
        } : null}
        title={
          editingAddress
            ? locale === 'ne'
              ? 'ठेगाना सम्पादन गर्नुहोस्'
              : 'Edit Address'
            : locale === 'ne'
              ? 'नयाँ ठेगाना थप्नुहोस्'
              : 'Add New Address'
        }
        description={
          editingAddress
            ? locale === 'ne'
              ? 'आफ्नो ठेगाना जानकारी अद्यावधिक गर्नुहोस्'
              : 'Update your address information'
            : dialogType === 'permanent'
              ? locale === 'ne'
                ? 'आफ्नो स्थायी ठेगाना विवरणहरू भर्नुहोस्'
                : 'Enter your permanent address details'
              : locale === 'ne'
                ? 'आफ्नो अस्थायी ठेगाना विवरणहरू भर्नुहोस्'
                : 'Enter your temporary address details'
        }
        isLoading={isUpdating}
        addressType={dialogType}
      />
    </>
  );
}
// hooks/use-confirmation-dialog.tsx (note the .tsx extension)
'use client';

import { useState } from 'react';
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

interface ConfirmationOptions {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive';
}

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  onCancel: () => void;
  options: ConfirmationOptions;
}

// Separate component for the dialog
function ConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  onCancel,
  options,
}: ConfirmationDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{options.title}</AlertDialogTitle>
          <AlertDialogDescription className="whitespace-pre-line">
            {options.description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>
            {options.cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={options.variant === 'destructive' ? 'bg-destructive hover:bg-destructive/90' : ''}
          >
            {options.confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function useConfirmationDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmationOptions>({
    title: '',
    description: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    variant: 'default',
  });
  const [resolvePromise, setResolvePromise] = useState<(value: boolean) => void>();

  const confirm = (options: ConfirmationOptions): Promise<boolean> => {
    setOptions(options);
    setIsOpen(true);
    
    return new Promise((resolve) => {
      setResolvePromise(() => resolve);
    });
  };

  const handleConfirm = () => {
    setIsOpen(false);
    if (resolvePromise) {
      resolvePromise(true);
    }
    setResolvePromise(undefined);
  };

  const handleCancel = () => {
    setIsOpen(false);
    if (resolvePromise) {
      resolvePromise(false);
    }
    setResolvePromise(undefined);
  };

  const ConfirmationDialogComponent = () => (
    <ConfirmationDialog
      open={isOpen}
      onOpenChange={setIsOpen}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
      options={options}
    />
  );

  return {
    confirm,
    ConfirmationDialog: ConfirmationDialogComponent,
  };
}
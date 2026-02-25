// import { useState } from 'react';
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { Textarea } from '@/components/ui/textarea';
// import { Loader2 } from 'lucide-react';

// interface EditDialogProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   title: string;
//   field: string;
//   initialValue: string;
//   onSubmit: (value: string) => Promise<void>;
//   type?: 'text' | 'email' | 'select' | 'textarea';
//   options?: readonly {
//     value: string;
//     label: string;
//   }[];
//   validate?: (value: string) => string | null;
// }

// export function EditDialog({
//   open,
//   onOpenChange,
//   title,
//   field,
//   initialValue,
//   onSubmit,
//   type = 'text',
//   options = [],
//   validate,
// }: EditDialogProps) {
//   const [value, setValue] = useState(initialValue);
//   const [error, setError] = useState<string | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleSubmit = async () => {
//     // Validation
//     if (validate) {
//       const validationError = validate(value);
//       if (validationError) {
//         setError(validationError);
//         return;
//       }
//     }

//     // Field-specific validation
//     if (field === 'email' && value) {
//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       if (!emailRegex.test(value)) {
//         setError('Please enter a valid email address');
//         return;
//       }
//     }

//     if (field === 'phone_number' && value) {
//       const phoneRegex = /^[+]?[\d\s-]+$/;
//       if (!phoneRegex.test(value)) {
//         setError('Please enter a valid phone number');
//         return;
//       }
//     }

//     setError(null);
//     setIsSubmitting(true);

//     try {
//       await onSubmit(value);
//       onOpenChange(false);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Failed to update');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-md">
//         <DialogHeader>
//           <DialogTitle>Edit {title}</DialogTitle>
//           <DialogDescription>
//             Update your {title.toLowerCase()}
//           </DialogDescription>
//         </DialogHeader>

//         <div className="space-y-4 py-4">
//           {type === 'select' ? (
//             <div className="space-y-2">
//               <Label htmlFor={field}>{title}</Label>
//               <Select value={value} onValueChange={setValue}>
//                 <SelectTrigger>
//                   <SelectValue placeholder={`Select ${title}`} />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {options.map((option) => (
//                     <SelectItem key={option.value} value={option.value}>
//                       {option.label}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           ) : type === 'textarea' ? (
//             <div className="space-y-2">
//               <Label htmlFor={field}>{title}</Label>
//               <Textarea
//                 id={field}
//                 value={value}
//                 onChange={(e) => setValue(e.target.value)}
//                 placeholder={`Enter ${title.toLowerCase()}`}
//                 rows={4}
//               />
//             </div>
//           ) : (
//             <div className="space-y-2">
//               <Label htmlFor={field}>{title}</Label>
//               <Input
//                 id={field}
//                 type={type}
//                 value={value}
//                 onChange={(e) => setValue(e.target.value)}
//                 placeholder={`Enter ${title.toLowerCase()}`}
//               />
//             </div>
//           )}

//           {error && (
//             <p className="text-sm text-destructive">{error}</p>
//           )}
//         </div>

//         <DialogFooter className="sm:justify-between">
//           <Button
//             variant="outline"
//             onClick={() => onOpenChange(false)}
//             disabled={isSubmitting}
//           >
//             Cancel
//           </Button>
//           <Button
//             onClick={handleSubmit}
//             disabled={isSubmitting || value === initialValue}
//           >
//             {isSubmitting ? (
//               <>
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 Saving...
//               </>
//             ) : (
//               'Save Changes'
//             )}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }


// components/account/edit-dialog.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface EditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  field: string;
  initialValue: string;
  onSubmit: (value: string) => Promise<void>;
  type?: 'text' | 'email' | 'select' | 'textarea';
  options?: ReadonlyArray<{ value: string; label: string }>;
  maxLength?: number;
}

export function EditDialog({
  open,
  onOpenChange,
  title,
  field,
  initialValue,
  onSubmit,
  type = 'text',
  options,
  maxLength,
}: EditDialogProps) {
  const [value, setValue] = useState(initialValue);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset value when dialog opens with new initialValue
  useEffect(() => {
    if (open) {
      setValue(initialValue);
      setError(null);
    }
  }, [open, initialValue]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!value.trim()) {
      setError('This field cannot be empty');
      return;
    }

    if (field === 'experience') {
      const exp = parseInt(value, 10);
      if (isNaN(exp) || exp < 1 || exp > 65) {
        setError('Experience must be between 1 and 65 years');
        return;
      }
    }

    if (maxLength && value.length > maxLength) {
      setError(`Maximum ${maxLength} characters allowed`);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit(value.trim());
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderInput = () => {
    switch (type) {
      case 'select':
        return (
          <Select 
            value={value} 
            onValueChange={setValue}
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder={`Select ${title.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'textarea':
        return (
          <Textarea
            id={field}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={`Enter your ${title.toLowerCase()}`}
            disabled={isSubmitting}
            rows={5}
            maxLength={maxLength}
            className="resize-none"
          />
        );

      default:
        return (
          <Input
            id={field}
            type={type}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={`Enter your ${title.toLowerCase()}`}
            disabled={isSubmitting}
            maxLength={maxLength}
          />
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit {title}</DialogTitle>
            <DialogDescription>
              Make changes to your {title.toLowerCase()} here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor={field} className="text-left">
                {title}
              </Label>
              {renderInput()}
              {maxLength && type === 'textarea' && (
                <p className="text-xs text-muted-foreground text-right">
                  {value.length}/{maxLength} characters
                </p>
              )}
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
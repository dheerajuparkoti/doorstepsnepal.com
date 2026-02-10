import { useState } from 'react';
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
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

interface EditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  field: string;
  initialValue: string;
  onSubmit: (value: string) => Promise<void>;
  type?: 'text' | 'email' | 'select' | 'textarea';
  options?: readonly {
    value: string;
    label: string;
  }[];
  validate?: (value: string) => string | null;
}

export function EditDialog({
  open,
  onOpenChange,
  title,
  field,
  initialValue,
  onSubmit,
  type = 'text',
  options = [],
  validate,
}: EditDialogProps) {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    // Validation
    if (validate) {
      const validationError = validate(value);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    // Field-specific validation
    if (field === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        setError('Please enter a valid email address');
        return;
      }
    }

    if (field === 'phone_number' && value) {
      const phoneRegex = /^[+]?[\d\s-]+$/;
      if (!phoneRegex.test(value)) {
        setError('Please enter a valid phone number');
        return;
      }
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await onSubmit(value);
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit {title}</DialogTitle>
          <DialogDescription>
            Update your {title.toLowerCase()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {type === 'select' ? (
            <div className="space-y-2">
              <Label htmlFor={field}>{title}</Label>
              <Select value={value} onValueChange={setValue}>
                <SelectTrigger>
                  <SelectValue placeholder={`Select ${title}`} />
                </SelectTrigger>
                <SelectContent>
                  {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : type === 'textarea' ? (
            <div className="space-y-2">
              <Label htmlFor={field}>{title}</Label>
              <Textarea
                id={field}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={`Enter ${title.toLowerCase()}`}
                rows={4}
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor={field}>{title}</Label>
              <Input
                id={field}
                type={type}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={`Enter ${title.toLowerCase()}`}
              />
            </div>
          )}

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
        </div>

        <DialogFooter className="sm:justify-between">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || value === initialValue}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
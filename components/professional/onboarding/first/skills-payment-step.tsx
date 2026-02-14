'use client';

import { useEffect, useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Award, 
  Plus, 
  X, 
  Wallet,
  Smartphone,
  PiggyBank,
  CreditCard
} from 'lucide-react';

// Modals
import { SkillPickerModal } from './skill-picker-modal';

const MAX_SKILLS = 7;

const skillsPaymentSchema = z.object({
  skills: z.array(z.string()).min(1, 'At least one skill is required'),
  payment_method: z.enum(['cash', 'esewa', 'khalti', 'imepay', 'bank_transfer']),
  phone_number: z.string().optional(),
}).refine((data) => {
  if (['esewa', 'khalti', 'imepay'].includes(data.payment_method)) {
    return !!data.phone_number && /^[0-9]{10}$/.test(data.phone_number);
  }
  return true;
}, {
  message: 'Valid phone number is required for digital payments',
  path: ['phone_number'],
});

type SkillsPaymentFormValues = z.infer<typeof skillsPaymentSchema>;

interface SkillsPaymentStepProps {
  initialData?: any;
  onUpdate: (data: any) => void;
}

export function SkillsPaymentStep({ initialData, onUpdate }: SkillsPaymentStepProps) {
  const { locale } = useI18n();
  const [showSkillPicker, setShowSkillPicker] = useState(false);

  const form = useForm<SkillsPaymentFormValues>({
    resolver: zodResolver(skillsPaymentSchema),
    defaultValues: {
      skills: initialData?.skills || [],
      payment_method: initialData?.payment_method || 'cash',
      phone_number: initialData?.phone_number || '',
    },
  });

  const paymentMethod = form.watch('payment_method');
  const skills = form.watch('skills');

  const handleAddSkill = (skill: string) => {
    const currentSkills = form.getValues('skills');
    if (currentSkills.length >= MAX_SKILLS) {
      return;
    }
    if (!currentSkills.includes(skill)) {
      form.setValue('skills', [...currentSkills, skill]);
    }
    setShowSkillPicker(false);
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    form.setValue('skills', skills.filter(s => s !== skillToRemove));
  };

  useEffect(() => {
    const subscription = form.watch((value) => {
      onUpdate(value);
    });
    return () => subscription.unsubscribe();
  }, [form, onUpdate]);

  return (
    <>
      <Form {...form}>
        <div className="space-y-8">
          {/* Skills Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-500" />
                {locale === 'ne' ? 'कौशलहरू' : 'Skills'} 
                <Badge variant="outline" className="ml-2">
                  {skills.length}/{MAX_SKILLS}
                </Badge>
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowSkillPicker(true)}
                disabled={skills.length >= MAX_SKILLS}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                {locale === 'ne' ? 'कौशल थप्नुहोस्' : 'Add Skill'}
              </Button>
            </div>

            {/* Skills display */}
            {skills.length > 0 ? (
              <div className="flex flex-wrap gap-2 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                <AnimatePresence>
                  {skills.map((skill) => (
                    <motion.div
                      key={skill}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      <Badge
                        variant="secondary"
                        className="px-3 py-1.5 text-sm gap-2 group hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors cursor-pointer"
                        onClick={() => handleRemoveSkill(skill)}
                      >
                        {skill}
                        <X className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Badge>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div 
                onClick={() => setShowSkillPicker(true)}
                className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 transition-colors group"
              >
                <Award className="w-12 h-12 mx-auto text-gray-300 group-hover:text-primary/50 mb-3" />
                <p className="text-muted-foreground">
                  {locale === 'ne' 
                    ? 'कौशलहरू थप्न यहाँ क्लिक गर्नुहोस्' 
                    : 'Click here to add your skills'}
                </p>
              </div>
            )}

            <FormField
              control={form.control}
              name="skills"
              render={() => (
                <FormMessage />
              )}
            />
          </div>

          {/* Payment Method Section */}
          <div className="space-y-4 pt-6 border-t">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Wallet className="w-5 h-5 text-green-500" />
              {locale === 'ne' ? 'भुक्तानी विधि' : 'Payment Method'}
            </h3>

            <FormField
              control={form.control}
              name="payment_method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {locale === 'ne' ? 'भुक्तानी प्राप्त गर्ने तरिका' : 'How would you like to receive payments?'} *
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="transition-all focus:ring-2 focus:ring-primary/20">
                        <SelectValue placeholder={locale === 'ne' ? 'छान्नुहोस्' : 'Select method'} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="cash">
                        <div className="flex items-center gap-2">
                          <PiggyBank className="w-4 h-4" />
                          {locale === 'ne' ? 'नगद' : 'Cash'}
                        </div>
                      </SelectItem>
                      <SelectItem value="esewa">
                        <div className="flex items-center gap-2">
                          <Smartphone className="w-4 h-4" />
                          eSewa
                        </div>
                      </SelectItem>
                      <SelectItem value="khalti">
                        <div className="flex items-center gap-2">
                          <Smartphone className="w-4 h-4" />
                          Khalti
                        </div>
                      </SelectItem>
                      <SelectItem value="imepay">
                        <div className="flex items-center gap-2">
                          <Smartphone className="w-4 h-4" />
                          IME Pay
                        </div>
                      </SelectItem>
                      <SelectItem value="bank_transfer">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4" />
                          {locale === 'ne' ? 'बैंक हस्तान्तरण' : 'Bank Transfer'}
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Digital Payment Phone Field */}
            <AnimatePresence>
              {['esewa', 'khalti', 'imepay'].includes(paymentMethod) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <FormField
                    control={form.control}
                    name="phone_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Smartphone className="w-4 h-4" />
                          {locale === 'ne' ? 'फोन नम्बर' : 'Phone Number'} *
                        </FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="98XXXXXXXX"
                            className="transition-all focus:ring-2 focus:ring-primary/20"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bank Transfer Info */}
            {paymentMethod === 'bank_transfer' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-xl"
              >
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  {locale === 'ne'
                    ? 'बैंक विवरण अर्को चरणमा भर्नुहोस्'
                    : 'Bank details will be collected in the next step'}
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </Form>

      {/* Skill Picker Modal */}
      <SkillPickerModal
        open={showSkillPicker}
        onClose={() => setShowSkillPicker(false)}
        onSelect={handleAddSkill}
        selectedSkills={skills}
        maxSkills={MAX_SKILLS}
      />
    </>
  );
}
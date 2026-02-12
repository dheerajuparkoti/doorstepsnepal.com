'use client';

import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n/context';
import { Phone, Mail, MapPin, User as UserIcon, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { User } from '@/lib/data/user';
import { AGE_GROUPS, GENDERS } from '@/lib/data/user';

interface ProfileContactInfoProps {
  user: User;
}

export function ProfileContactInfo({ user }: ProfileContactInfoProps) {
  const { language } = useI18n();
  const router = useRouter();

  const getGenderLabel = (gender?: string) => {
    if (!gender) return 'Not set';
    return GENDERS.find(g => g.value === gender)?.label || gender;
  };

  const getAgeGroupLabel = (ageGroup?: string) => {
    if (!ageGroup) return 'Not set';
    return AGE_GROUPS.find(a => a.value === ageGroup)?.label || ageGroup;
  };

  return (
    <Card className="mx-4 mt-6 border shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <UserIcon className="h-5 w-5 text-primary" />
            {language === 'ne' ? 'सम्पर्क जानकारी' : 'Contact Information'}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/accountInfo')}
            className="gap-2"
          >
            <Pencil className="h-4 w-4" />
            {language === 'ne' ? 'सम्पादन' : 'Edit'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Phone className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">
              {language === 'ne' ? 'फोन नम्बर' : 'Phone Number'}
            </p>
            <p className="text-sm font-medium">{user.phone_number}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Mail className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">
              {language === 'ne' ? 'इमेल' : 'Email'}
            </p>
            <p className="text-sm font-medium">{user.email || 'Not set'}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <MapPin className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">
              {language === 'ne' ? 'ठेगाना' : 'Address'}
            </p>
            <p className="text-sm font-medium line-clamp-2">
              {user.full_address || 'Not set'}
            </p>
          </div>
        </div>

        <Separator className="my-2" />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">
              {language === 'ne' ? 'लिङ्ग' : 'Gender'}
            </p>
            <p className="text-sm font-medium">{getGenderLabel(user.gender)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">
              {language === 'ne' ? 'उमेर समूह' : 'Age Group'}
            </p>
            <p className="text-sm font-medium">{getAgeGroupLabel(user.age_group)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n/context';
import { CheckCircle, Pencil, XCircle, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { User } from '@/lib/data/user';

interface ProfileHeaderProps {
  user: User;
  isReadOnly?: boolean;
}

export function ProfileHeader({ user, isReadOnly = false }: ProfileHeaderProps) { // ✅ Add to params
  const { language } = useI18n();
  const router = useRouter();
  const [imageError, setImageError] = useState(false);

  const profileImage = !imageError && user.profile_image 
    ? user.profile_image 
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name)}&background=0D9488&color=fff&size=400`;

  const userType = user.type === 'professional' ? 'Professional' : 'Customer';
  const firstName = user.full_name.split(' ')[0];
  
  const memberYears = user?.member_since === 0 ? 1 : user?.member_since;

  const totalSpend = user.total_spent 
    ? user.total_spent > 1000 
      ? `Rs. ${(user.total_spent / 1000).toFixed(1)}k`
      : `Rs. ${user.total_spent}`
    : 'Rs. 0';

  const ordersCompleted = user.order_count?.toString() || '0';
  const isVerified = user.isVerified;
  


  return (
    <div className="relative w-full h-[400px] bg-black">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={profileImage}
          alt={user.full_name}
          fill
          className="object-cover"
          priority
          onError={() => setImageError(true)}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      </div>

      {/* Edit Profile Button  */}
      {/* {!isReadOnly && (
        <Button
          size="icon"
          variant="secondary"
          className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white border-0"
          onClick={() => router.push('/dashboard/settings-privacy/account-info')}
        >
          <Pencil className="h-4 w-4" />
        </Button>
      )} */}

      {/* User Info Overlay */}
      <div className="absolute bottom-24 left-6 right-6 z-10">
        <div className="space-y-2">
          <Badge 
            variant="outline" 
            className={`
              ${user.type === 'professional' 
                ? 'bg-secondary/80 text-white border-secondary/50' 
                : 'bg-primary/80 text-white border-primary/50'
              } backdrop-blur-sm
            `}
          >
            {language === 'ne' 
              ? (user.type === 'professional' ? 'प्रोफेशनल' : 'ग्राहक')
              : userType
            }
          </Badge>
          
          <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
            {firstName}
          </h1>

          {/* Verified Badge */}
          <div className="inline-block bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-lg">
            <div className="flex items-center gap-2">
              {isVerified ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-white/90 font-medium">
                    {language === 'ne' ? 'प्रमाणित' : 'Verified'}
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm text-white/90 font-medium">
                    {language === 'ne' ? 'अप्रमाणित' : 'Not Verified'}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="absolute bottom-4 left-4 right-4 flex gap-2 z-10">
        {/* Orders Card */}
        <div className="flex-1 bg-black/40 backdrop-blur-sm rounded-lg p-3 text-center border border-white/10">
          <p className="text-lg font-semibold text-white">{ordersCompleted}</p>
          <p className="text-xs text-white/70">
            {language === 'ne' ? 'अर्डरहरू' : 'Orders'}
          </p>
        </div>


        {!isReadOnly &&  (
     
   
          // For own profile - Show Total Spent
          <div className="flex-1 bg-black/40 backdrop-blur-sm rounded-lg p-3 text-center border border-white/10">
            <p className="text-lg font-semibold text-white">{totalSpend}</p>
            <p className="text-xs text-white/70">
              {language === 'ne' ? 'कुल खर्च' : 'Total Spent'}
            </p>
          </div>
        )}

        {/* Member Since Card */}
        <div className="flex-1 bg-black/40 backdrop-blur-sm rounded-lg p-3 text-center border border-white/10">
          <p className="text-lg font-semibold text-white">{memberYears} {language === 'ne' ? 'वर्ष' : 'Year'}</p>
          <p className="text-xs text-white/70">
            {language === 'ne' ? 'सदस्यता' : 'Member'}
          </p>
        </div>
      </div>
    </div>
  );
}
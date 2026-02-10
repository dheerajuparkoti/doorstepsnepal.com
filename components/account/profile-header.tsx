'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProfileHeaderProps {
  fullName: string;
  profileImage?: string;
  userType?: string;
  onProfileImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
  isVerified?: boolean;
}

export function ProfileHeader({ 
  fullName, 
  profileImage, 
  userType = 'customer',
  onProfileImageChange, 
  isLoading,
  isVerified = false 
}: ProfileHeaderProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const statusText = userType === 'professional' ? 'Professional' : 'Customer';

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Profile Image with Badge */}
      <div className="relative group">
        <div className="relative">
          <Avatar className="h-32 w-32 border-4 border-background shadow-xl ring-2 ring-border dark:ring-border/50">
            <AvatarImage 
              src={profileImage} 
              alt={fullName}
              className="object-cover"
            />
            <AvatarFallback className="text-2xl bg-gradient-to-br from-primary/20 to-secondary/20 dark:from-primary/30 dark:to-secondary/30">
              {getInitials(fullName)}
            </AvatarFallback>
          </Avatar>
          
          {/* Verification Badge */}
          {isVerified && (
            <div className="absolute -bottom-2 -right-2 bg-background rounded-full p-1 shadow-lg dark:shadow-gray-900">
              <CheckCircle className="h-6 w-6 text-green-500 dark:text-green-400" />
            </div>
          )}
        </div>
        
        {/* Camera Button */}
        <label 
          htmlFor="profile-image" 
          className="absolute inset-0 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 dark:bg-black/50 rounded-full"
        >
          <div className="flex items-center justify-center h-12 w-12 rounded-full bg-background/90 shadow-lg hover:shadow-xl transition-all hover:scale-105">
            {isLoading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            ) : (
              <Camera className="h-5 w-5 text-foreground" />
            )}
          </div>
          <input
            id="profile-image"
            type="file"
            accept="image/jpeg,image/jpg,image/png"
            className="hidden"
            onChange={onProfileImageChange}
            disabled={isLoading}
          />
        </label>
      </div>

      {/* User Info */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          {fullName}
          {isVerified && (
            <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 inline-block ml-2" />
          )}
        </h2>
        
        <div className="flex items-center justify-center space-x-4">
          <span className={cn(
            "px-4 py-1.5 rounded-full text-sm font-semibold border",
            userType === 'professional' 
              ? "bg-secondary/20 dark:bg-secondary/30 text-secondary dark:text-secondary-foreground border-secondary/30 dark:border-secondary/50"
              : "bg-primary/20 dark:bg-primary/30 text-primary dark:text-primary-foreground border-primary/30 dark:border-primary/50"
          )}>
            {statusText}
          </span>
          
          {userType === 'professional' && (
            <span className="px-3 py-1 bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 text-amber-700 dark:text-amber-300 text-xs font-medium rounded-full border border-amber-200 dark:border-amber-700">
              PRO
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
'use client';

import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n/context';
import { 
  History, 
  Heart, 
  Settings, 
  Shield, 
  LogOut,
  Briefcase,
  ChevronRight 
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/context/auth-context';
import type { User } from '@/lib/data/user';
import { cn } from '@/lib/utils';

interface ProfileActionsProps {
  user: User;
}

export function ProfileActions({ user }: ProfileActionsProps) {
  const { language } = useI18n();
  const router = useRouter();
  const { logout } = useAuth();

  const actions = [
    {
      id: 'orders',
      icon: History,
      label: language === 'ne' ? 'अर्डर इतिहास' : 'Order History',
      description: language === 'ne' ? 'तपाईंको अर्डरहरू हेर्नुहोस्' : 'View your orders',
      href: '/orders',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-950/50',
    },
    {
      id: 'favorites',
      icon: Heart,
      label: language === 'ne' ? 'मनपर्ने' : 'Favorites',
      description: language === 'ne' ? 'तपाईंको मनपर्ने सूची' : 'Your favorite items',
      href: '/favorites',
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-100 dark:bg-red-950/50',
    },
    ...(user.type === 'professional' ? [{
      id: 'professional',
      icon: Briefcase,
      label: language === 'ne' ? 'व्यावसायिक ड्यासबोर्ड' : 'Professional Dashboard',
      description: language === 'ne' ? 'आफ्नो सेवाहरू व्यवस्थापन गर्नुहोस्' : 'Manage your services',
      href: '/professional/dashboard',
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-950/50',
    }] : []),
    {
      id: 'settings',
      icon: Settings,
      label: language === 'ne' ? 'खाता सेटिङ्ग' : 'Account Settings',
      description: language === 'ne' ? 'आफ्नो खाता व्यवस्थापन गर्नुहोस्' : 'Manage your account',
      href: '/accountInfo',
      color: 'text-gray-600 dark:text-gray-400',
      bgColor: 'bg-gray-100 dark:bg-gray-800',
    },
    {
      id: 'privacy',
      icon: Shield,
      label: language === 'ne' ? 'गोपनीयता' : 'Privacy & Security',
      description: language === 'ne' ? 'गोपनीयता सेटिङ्गहरू' : 'Privacy settings',
      href: '/privacy',
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-950/50',
    },
  ];

  return (
    <div className="px-4 py-6 space-y-4">
      <h2 className="text-lg font-semibold">
        {language === 'ne' ? 'कार्यहरू' : 'Actions'}
      </h2>
      
      <div className="space-y-3">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => router.push(action.href)}
            className="w-full flex items-center justify-between p-4 bg-card hover:bg-accent/50 rounded-lg border transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className={cn("p-2 rounded-lg", action.bgColor)}>
                <action.icon className={cn("h-5 w-5", action.color)} />
              </div>
              <div className="text-left">
                <p className="font-medium">{action.label}</p>
                <p className="text-xs text-muted-foreground">
                  {action.description}
                </p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          </button>
        ))}

        <button
          onClick={() => {
            logout();
            router.push('/');
          }}
          className="w-full flex items-center justify-between p-4 bg-destructive/5 hover:bg-destructive/10 rounded-lg border border-destructive/20 transition-colors group"
        >
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-destructive/10">
              <LogOut className="h-5 w-5 text-destructive" />
            </div>
            <div className="text-left">
              <p className="font-medium text-destructive">
                {language === 'ne' ? 'साइन आउट' : 'Sign Out'}
              </p>
              <p className="text-xs text-muted-foreground">
                {language === 'ne' ? 'आफ्नो खाताबाट बाहिर निस्कनुहोस्' : 'Sign out of your account'}
              </p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
        </button>
      </div>

      {user.deletion_requested && (
        <Card className="border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30">
          <CardContent className="p-4">
            <p className="text-sm text-amber-800 dark:text-amber-300">
              <strong className="font-semibold">⚠️ Deletion Requested</strong>
              <br />
              Scheduled for {user.deletion_requested_at 
                ? new Date(user.deletion_requested_at).toLocaleDateString()
                : 'N/A'}
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => router.push('/accountInfo')}
              className="w-full mt-2 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/30"
            >
              Cancel Deletion
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
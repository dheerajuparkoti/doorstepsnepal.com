
import { 
  Bell, 
  Gift, 
  Megaphone, 
  Wrench, 
  Sparkles, 
  AlertTriangle,
  PartyPopper,
  ShoppingBag,
  Wallet,
  CreditCard
} from "lucide-react";

export interface NotificationConfig {
  color: string;
  bgColor: string;
  icon: any;
  gradient?: string;
}

export const announcementConfigs: Record<string, NotificationConfig> = {
  maintenance: {
    color: "text-orange-500",
    bgColor: "bg-orange-50",
    icon: Wrench,
    gradient: "from-orange-500 to-orange-600"
  },
  festival: {
    color: "text-red-500",
    bgColor: "bg-red-50",
    icon: PartyPopper,
    gradient: "from-red-500 to-pink-500"
  },
  offer: {
    color: "text-green-500",
    bgColor: "bg-green-50",
    icon: Gift,
    gradient: "from-green-500 to-emerald-500"
  },
  update: {
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    icon: Sparkles,
    gradient: "from-blue-500 to-cyan-500"
  },
  alert: {
    color: "text-purple-500",
    bgColor: "bg-purple-50",
    icon: AlertTriangle,
    gradient: "from-purple-500 to-indigo-500"
  },
  payment: {
    color: "text-emerald-500",
    bgColor: "bg-emerald-50",
    icon: CreditCard,
    gradient: "from-emerald-500 to-teal-500"
  },
  wallet: {
    color: "text-amber-500",
    bgColor: "bg-amber-50",
    icon: Wallet,
    gradient: "from-amber-500 to-yellow-500"
  }
};

export const getNotificationConfig = (type?: string): NotificationConfig => {
  return announcementConfigs[type || ''] || {
    color: "text-gray-500",
    bgColor: "bg-gray-50",
    icon: Bell,
    gradient: "from-gray-500 to-gray-600"
  };
};
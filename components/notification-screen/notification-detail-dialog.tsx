"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  Megaphone,
  Clock,
  Wrench,
  PartyPopper,
  Tag,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { Notification, getNotificationTitle, getNotificationType } from "@/lib/data/notification";
import { NepaliDateService } from "@/lib/utils/nepaliDate";
import { cn } from "@/lib/utils";

interface NotificationDetailDialogProps {
  notification: Notification;
  open: boolean;
  onClose: () => void;
}

type AnnouncementConfig = {
  Icon: React.ElementType;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  badgeClass: string;
};

const announcementConfigs: Record<string, AnnouncementConfig> = {
  maintenance: {
    Icon: Wrench,
    colorClass: "text-orange-500",
    bgClass: "bg-orange-500/10",
    borderClass: "border-orange-500/20",
    badgeClass: "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20",
  },
  festival: {
    Icon: PartyPopper,
    colorClass: "text-red-500",
    bgClass: "bg-red-500/10",
    borderClass: "border-red-500/20",
    badgeClass: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
  },
  offer: {
    Icon: Tag,
    colorClass: "text-green-500",
    bgClass: "bg-green-500/10",
    borderClass: "border-green-500/20",
    badgeClass: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
  },
  update: {
    Icon: RefreshCw,
    colorClass: "text-blue-500",
    bgClass: "bg-blue-500/10",
    borderClass: "border-blue-500/20",
    badgeClass: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  },
  alert: {
    Icon: AlertTriangle,
    colorClass: "text-purple-600",
    bgClass: "bg-purple-600/10",
    borderClass: "border-purple-600/20",
    badgeClass: "bg-purple-600/10 text-purple-700 dark:text-purple-400 border-purple-600/20",
  },
};

const defaultGlobalConfig: AnnouncementConfig = {
  Icon: Megaphone,
  colorClass: "text-orange-500",
  bgClass: "bg-orange-500/10",
  borderClass: "border-orange-500/20",
  badgeClass: "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20",
};

const personalConfig: AnnouncementConfig = {
  Icon: Bell,
  colorClass: "text-primary",
  bgClass: "bg-primary/10",
  borderClass: "border-primary/20",
  badgeClass: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
};

function getConfig(notification: Notification): AnnouncementConfig {
  if (notification.isGlobal) {
    return announcementConfigs[notification.type] ?? defaultGlobalConfig;
  }
  return personalConfig;
}

export function NotificationDetailDialog({
  notification,
  open,
  onClose,
}: NotificationDetailDialogProps) {
  const config = getConfig(notification);
  const { Icon, colorClass, bgClass, borderClass, badgeClass } = config;
  const timeAgo = NepaliDateService.formatTime(notification.created_at);
  const typeLabel = getNotificationType(notification.type);
  const imageUrl = notification.custom_data?.image_url as string | undefined;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md rounded-2xl p-0 overflow-hidden">
        {/* Colored header strip */}
        <div className={cn("px-6 pt-6 pb-4", bgClass)}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full border", bgClass, borderClass)}>
                <Icon className={cn("h-5 w-5", colorClass)} />
              </div>
              <span className="text-base font-bold leading-tight">
                {getNotificationTitle(notification)}
              </span>
            </DialogTitle>
          </DialogHeader>
        </div>

        {/* Banner image */}
        {imageUrl && (
          <div className="w-full h-44 bg-muted">
            <img
              src={imageUrl}
              alt=""
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
        )}

        {/* Content */}
        <div className="px-6 py-4 space-y-4">
          {/* Type badge */}
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={cn("rounded-full px-3 py-0.5 text-xs font-medium border", badgeClass)}
            >
              {typeLabel}
            </Badge>
          </div>

          {/* Body */}
          <p className="text-sm leading-relaxed text-foreground">
            {notification.body}
          </p>

          {/* Time */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>{timeAgo}</span>
          </div>

          {/* Link if available */}
          {notification.custom_data?.link_url && (
            <a
              href={notification.custom_data.link_url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline",
                colorClass
              )}
            >
              View more →
            </a>
          )}
        </div>

        <div className="px-6 pb-6 pt-1">
          <Button
            variant="outline"
            className="w-full rounded-full"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

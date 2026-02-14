
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { X } from "lucide-react";
import { getNotificationConfig } from "./notification-config";
import { cn } from "@/lib/utils";

interface AnnouncementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type?: string;
  title: string;
  message: string;
  imageUrl?: string;
  linkUrl?: string;
}

export function AnnouncementDialog({
  open,
  onOpenChange,
  type = "announcement",
  title,
  message,
  imageUrl,
  linkUrl,
}: AnnouncementDialogProps) {
  const config = getNotificationConfig(type);
  const Icon = config.icon;

  const handleAction = () => {
    if (linkUrl) {
      window.open(linkUrl, '_blank');
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden">
        {/* Close button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 z-10 rounded-full bg-black/20 p-1.5 text-white hover:bg-black/30 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Image/Icon Header */}
        {imageUrl ? (
          <div className="relative w-full h-48">
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover"
            />
            {/* Gradient overlay */}
            <div className={`absolute inset-0 bg-gradient-to-t ${config.gradient} opacity-60`} />
          </div>
        ) : (
          <div className={cn(
            "w-full h-32 flex items-center justify-center",
            config.bgColor
          )}>
            <Icon className={cn("h-16 w-16", config.color)} />
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          <DialogTitle className="text-2xl font-bold mb-2">
            {title}
          </DialogTitle>
          <p className="text-gray-600 mb-6 leading-relaxed">
            {message}
          </p>

          {/* Action Button */}
          <Button
            onClick={handleAction}
            className={cn(
              "w-full bg-gradient-to-r text-white font-semibold py-6",
              config.gradient,
              "hover:opacity-90 transition-opacity"
            )}
          >
            {linkUrl ? "OPEN LINK" : "GOT IT"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
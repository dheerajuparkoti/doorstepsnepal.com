
"use client";

import { useFCMHandler } from "@/hooks/use-fcm-handler";
import { AnnouncementDialog } from "./announcement-dialog";

export function AnnouncementDialogWrapper() {
  const { announcement, setAnnouncement } = useFCMHandler();

  return (
    <AnnouncementDialog
      open={announcement.open}
      onOpenChange={(open) => setAnnouncement(prev => ({ ...prev, open }))}
      type={announcement.type}
      title={announcement.title}
      message={announcement.message}
      imageUrl={announcement.imageUrl}
      linkUrl={announcement.linkUrl}
    />
  );
}
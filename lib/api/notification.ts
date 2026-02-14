
import { api } from '@/config/api-client';
import { Notification, NotificationRequest, NotificationUpdateRequest } from '@/lib/data/notification';

class NotificationApiService {
  private readonly basePath = '/notifications';

  // Create Notification
  async createNotification(request: NotificationRequest): Promise<Notification> {
    return await api.post(this.basePath, request);
  }

  // Get All Notifications for current user
  async getMyNotifications(): Promise<Notification[]> {
    return await api.get(this.basePath);
  }

  // Get Notification by ID
  async getNotificationById(id: number): Promise<Notification> {
    return await api.get(`${this.basePath}/${id}`);
  }

  // Patch Notification (mark as read)
  async patchNotification(id: number, request: NotificationUpdateRequest): Promise<Notification> {
    return await api.patch(`${this.basePath}/${id}`, request);
  }

  // Delete Notification
  async deleteNotification(id: number): Promise<void> {
    await api.delete(`${this.basePath}/${id}`);
  }
}

export const notificationApi = new NotificationApiService();
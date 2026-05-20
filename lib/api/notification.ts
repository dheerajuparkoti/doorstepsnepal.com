
import { api } from '@/config/api-client';
import { Notification, NotificationRequest, NotificationUpdateRequest } from '@/lib/data/notification';

class NotificationApiService {
  private readonly basePath = '/notifications';

  async createNotification(request: NotificationRequest): Promise<Notification> {
    return await api.post(this.basePath, request);
  }

  async getMyNotifications(): Promise<Notification[]> {
    return await api.get(this.basePath);
  }

  async getNotificationById(id: number): Promise<Notification> {
    return await api.get(`${this.basePath}/${id}`);
  }

  async patchNotification(id: number, request: NotificationUpdateRequest): Promise<Notification> {
    return await api.patch(`${this.basePath}/${id}`, request);
  }

  async deleteNotification(id: number): Promise<void> {
    await api.delete(`${this.basePath}/${id}`);
  }

  // Global notifications
  async getGlobalNotifications(): Promise<Notification[]> {
    const data: any[] = await api.get(`${this.basePath}/global`);
    return data.map((item) => ({
      ...item,
      isGlobal: true,
      updated_at: item.updated_at ?? item.created_at,
    }));
  }

  async markGlobalAsRead(id: number): Promise<void> {
    await api.post(`${this.basePath}/global/${id}/read`, {});
  }

  async dismissGlobalNotification(id: number): Promise<void> {
    await api.delete(`${this.basePath}/global/${id}`);
  }
}

export const notificationApi = new NotificationApiService();
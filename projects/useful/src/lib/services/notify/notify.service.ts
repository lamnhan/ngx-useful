import { Injectable } from '@angular/core';
import { Notification } from '@lamnhan/schemata';

import { LocalstorageService } from '../localstorage/localstorage.service';

@Injectable({
  providedIn: 'root'
})
/**
 * (DON'T USE YET) Notify service
 */
export class NotifyService {
  private APP_LOCAL_NOTIFICATION_READ_IDS = 'app_local_notification_read_ids';
  private readNotificationIds: Record<string, true> = {};
  private notifications: Notification[] = [];

  constructor(
    private localstorageService: LocalstorageService,
  ) {}
  
  init(
    notifications: Notification[] = [],
    readNotificationIds?: Record<string, true>
  ) {
    // notifications
    this.notifications = notifications;
    // read ids
    if (readNotificationIds) {
      this.readNotificationIds = readNotificationIds;
    } else {
      this.localstorageService
      .get<Record<string, true>>(this.APP_LOCAL_NOTIFICATION_READ_IDS)
      .subscribe(ids => {
        this.readNotificationIds = ids || {} as Record<string, true>;  
      });
    }
    // done
    return this as NotifyService;
  }

  isNotificationRead(key: string) {
    return !!this.readNotificationIds[key];
  }

  getUnreadNotifications() {
    return this.notifications
      .filter(
        notification => notification.id && !this.isNotificationRead(notification.id)
      );
  }

  getReadNotifications() {
    return this.notifications
      .filter(
        notification => notification.id && this.isNotificationRead(notification.id)
      );
  }

  count() {
    return this.notifications.length;
  }

  countUnread() {
    return this.getUnreadNotifications().length;
  }

  setReadNotificationId(key: string) {
    // in memory
    this.readNotificationIds[key] = true;
    // local storage
    return this.localstorageService.set(
      this.APP_LOCAL_NOTIFICATION_READ_IDS,
      this.readNotificationIds,
    );
  }
}

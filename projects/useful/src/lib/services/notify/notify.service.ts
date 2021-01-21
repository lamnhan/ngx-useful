import { Injectable } from '@angular/core';

import { Notification } from '@lamnhan/schemata';

import { LocalstorageService } from '../../sheetbase-services/localstorage/localstorage.service';

@Injectable({
  providedIn: 'root'
})
export class NotifyService {

  SHEETBASE_NOTIFICATION_READ_IDS = 'notification_read_ids';

  rawNotifications: Notification[] = [];
  readNotificationIds: {[$key: string]: true} = {};

  constructor(
    private localstorageService: LocalstorageService,
  ) {
    // load read ids
    this.localstorageService
      .get(this.SHEETBASE_NOTIFICATION_READ_IDS)
      .subscribe(ids => {
        this.readNotificationIds = ids || {} as any;
      });
  }

  setNotifications(notifications: Notification[]) {
    this.rawNotifications = notifications;
  }

  notifications() {
    const unreadNotifications: Notification[] = [];
    const readNotifications: Notification[] = [];
    for (const notification of this.rawNotifications) {
      if (this.readNotificationIds[notification.$key]) {
        notification['read'] = true;
        readNotifications.push(notification);
      } else {
        unreadNotifications.push(notification);
      }
    }
    return [ ... unreadNotifications, ... readNotifications ];
  }

  unreadNotifications() {
    const notifications: Notification[] = [];
    const allNotifications = this.notifications();
    for (const notification of allNotifications) {
      if (!notification['read']) {
        notifications.push(notification);
      }
    }
    return notifications;
  }

  readNotifications() {
    const notifications: Notification[] = [];
    const allNotifications = this.notifications();
    for (const notification of allNotifications) {
      if (notification['read']) {
        notifications.push(notification);
      }
    }
    return notifications;
  }

  count() {
    return this.rawNotifications.length;
  }

  countUnread() {
    return this.unreadNotifications().length;
  }

  async setReadId($key: string) {
    this.readNotificationIds[$key] = true;
    await this.localstorageService.set(
      this.SHEETBASE_NOTIFICATION_READ_IDS,
      this.readNotificationIds,
    );
  }

}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PushNotification } from '../types';

const STORAGE_KEY_NOTIFS = 'jyotishwala_notifications';

export const INITIAL_NOTIFICATIONS: PushNotification[] = [
  {
    id: 'notif_1',
    title: 'शुभ मुहूर्त सूचना',
    body: 'आज का अभिजित मुहूर्त प्रारंभ हो गया है (11:45 AM - 12:35 PM)। सभी शुभ कार्यों के लिए श्रेष्ठ समय।',
    time: '15 मिनट पहले',
    category: 'muhurat',
    read: false
  },
  {
    id: 'notif_2',
    title: 'दैनिक पंचांग व राहुकाल',
    body: 'आज का राहुकाल सायं 04:15 से 05:35 तक रहेगा। इस दौरान नए कार्य प्रारंभ न करें।',
    time: '2 घंटे पहले',
    category: 'panchang',
    read: false
  },
  {
    id: 'notif_3',
    title: 'ग्रह गोचर अपडेट',
    body: 'चंद्रमा का वृश्चिक से धनु राशि में प्रवेश। मेष एवं सिंह राशि के जातकों को विशेष लाभ।',
    time: '5 घंटे पहले',
    category: 'transit',
    read: true
  },
  {
    id: 'notif_4',
    title: 'आगामी व्रत सूचना',
    body: 'परसों सफला एकादशी व्रत है। पारण समय एवं पूजा विधि ऐप में उपलब्ध है।',
    time: '1 दिन पहले',
    category: 'festival',
    read: true
  }
];

export function getNotifications(): PushNotification[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY_NOTIFS);
    if (!data) {
      localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify(INITIAL_NOTIFICATIONS));
      return INITIAL_NOTIFICATIONS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_NOTIFICATIONS;
  }
}

export function markAsRead(id: string) {
  const notifs = getNotifications();
  const n = notifs.find((item) => item.id === id);
  if (n) {
    n.read = true;
    localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify(notifs));
  }
}

export function markAllAsRead() {
  const notifs = getNotifications();
  notifs.forEach((n) => (n.read = true));
  localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify(notifs));
}

export function triggerNewNotification(title: string, body: string, category: PushNotification['category']): PushNotification {
  const notifs = getNotifications();
  const newNotif: PushNotification = {
    id: `notif_${Date.now()}`,
    title,
    body,
    time: 'अभी-अभी (Just now)',
    category,
    read: false
  };
  notifs.unshift(newNotif);
  localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify(notifs));

  // Trigger browser notification if permitted
  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon: '/favicon.ico'
      });
    } catch {
      // Ignore background restrictions
    }
  }

  return newNotif;
}

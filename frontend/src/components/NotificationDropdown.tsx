'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bell, BookOpen, MessageSquare, Users } from 'lucide-react';
import { Button } from './ui/button';

type NotificationType =
  | 'NEW_MESSAGE'
  | 'NEW_FOLLOWER'
  | 'SYSTEM_ALERT'
  | 'BOOKING_CONFIRMED'
  | 'BOOKING_REMINDER'
  | 'INFO';

interface Notification {
  id: string;
  title?: string;
  message: string;
  isRead: boolean;
  type: NotificationType;
  url?: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

const FAKE_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'New Message',
    message: 'You have a new message from John Doe',
    isRead: false,
    type: 'NEW_MESSAGE',
    url: '/messages/123',
    createdAt: new Date(Date.now() - 5 * 60000),
    updatedAt: new Date(Date.now() - 5 * 60000),
    userId: 'user-1',
  },
  {
    id: '2',
    title: 'Booking Confirmed',
    message: 'Your booking for apartment at 123 Main St is confirmed',
    isRead: false,
    type: 'BOOKING_CONFIRMED',
    url: '/bookings/456',
    createdAt: new Date(Date.now() - 30 * 60000),
    updatedAt: new Date(Date.now() - 30 * 60000),
    userId: 'user-1',
  },
  {
    id: '3',
    title: 'Booking Reminder',
    message: 'Your booking viewing is scheduled for tomorrow at 2:00 PM',
    isRead: true,
    type: 'BOOKING_REMINDER',
    url: '/bookings/789',
    createdAt: new Date(Date.now() - 2 * 60 * 60000),
    updatedAt: new Date(Date.now() - 2 * 60 * 60000),
    userId: 'user-1',
  },
  {
    id: '4',
    title: 'New Follower',
    message: 'Sarah Johnson followed your profile',
    isRead: true,
    type: 'NEW_FOLLOWER',
    url: '/profile/sarah',
    createdAt: new Date(Date.now() - 24 * 60 * 60000),
    updatedAt: new Date(Date.now() - 24 * 60 * 60000),
    userId: 'user-1',
  },
  {
    id: '5',
    message: 'System maintenance scheduled for tonight at 10 PM',
    isRead: true,
    type: 'SYSTEM_ALERT',
    createdAt: new Date(Date.now() - 48 * 60 * 60000),
    updatedAt: new Date(Date.now() - 48 * 60 * 60000),
    userId: 'user-1',
  },
];

function getNotificationIcon(type: NotificationType) {
  switch (type) {
    case 'NEW_MESSAGE':
      return <MessageSquare className='h-4 w-4' />;
    case 'NEW_FOLLOWER':
      return <Users className='h-4 w-4' />;
    case 'BOOKING_CONFIRMED':
    case 'BOOKING_REMINDER':
      return <BookOpen className='h-4 w-4' />;
    case 'SYSTEM_ALERT':
      return <Bell className='h-4 w-4' />;
    default:
      return <Bell className='h-4 w-4' />;
  }
}

export function NotificationDropdown() {
  const unreadCount = FAKE_NOTIFICATIONS.filter((n) => !n.isRead).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' className='relative'>
          <Bell className='h-5 w-5' />
          {unreadCount > 0 && (
            <span className='absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full' />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-96 mt-2' align='end'>
        <DropdownMenuLabel className='border-b py-2'>
          Notifications ({unreadCount})
        </DropdownMenuLabel>
        <DropdownMenuGroup className='max-h-96 overflow-x-hidden overflow-y-auto'>
          {FAKE_NOTIFICATIONS.length > 0 ? (
            FAKE_NOTIFICATIONS.map((notification) => (
              <div key={notification.id}>
                <DropdownMenuItem
                  className={`flex flex-col gap-1 cursor-pointer px-3 py-2 ${
                    !notification.isRead ? 'bg-accent/50' : ''
                  }`}
                >
                  <div className='flex items-start gap-2 w-full'>
                    <div className='mt-0.5 flex-shrink-0'>
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className='flex-1 min-w-0'>
                      {notification.title && (
                        <p className='font-medium text-sm truncate'>
                          {notification.title}
                        </p>
                      )}
                      <p className='text-xs text-muted-foreground line-clamp-2'>
                        {notification.message}
                      </p>
                      <p className='text-xs text-muted-foreground mt-1'>
                        {formatTime(notification.createdAt)}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <div className='flex-shrink-0 h-2 w-2 bg-blue-500 rounded-full mt-1' />
                    )}
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </div>
            ))
          ) : (
            <DropdownMenuItem disabled className='text-center py-4'>
              No notifications yet
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function formatTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return new Date(date).toLocaleDateString();
}

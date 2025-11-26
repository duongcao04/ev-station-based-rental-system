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
import { useNotifications } from '@/lib/queries/useNotifications';
import { useNavigate } from 'react-router-dom';
import { type Notification } from '@/lib/types/notification.type';
import { Skeleton } from './ui/skeleton';

function getNotificationIcon(type: Notification['type']) {
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
  const { notifications, isLoading, markAsRead } = useNotifications();
  console.log(notifications);
  
  const navigate = useNavigate();

  const unreadCount = notifications?.length
    ? notifications?.filter((n) => !n.isRead).length
    : 0;

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    if (notification.url) {
      navigate(notification.url);
    }
  };

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
          {isLoading ? (
            <div className='p-2 space-y-2'>
              <Skeleton className='h-16 w-full' />
              <Skeleton className='h-16 w-full' />
              <Skeleton className='h-16 w-full' />
            </div>
          ) : notifications && notifications.length > 0 ? (
            notifications.map((notification) => (
              <div key={notification.id}>
                <DropdownMenuItem
                  onClick={() => handleNotificationClick(notification)}
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

function formatTime(date: string): string {
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

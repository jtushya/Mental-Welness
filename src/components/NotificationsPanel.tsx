import React from 'react';
import { motion } from 'framer-motion';
import { X, Bell } from 'lucide-react';
import { format } from 'date-fns';

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type?: 'info' | 'success' | 'warning';
  link?: string;
}

interface NotificationsPanelProps {
  notifications: Notification[];
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({
  notifications,
  onClose,
  onMarkAsRead,
  onClearAll
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl z-50 overflow-hidden"
    >
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-purple-500" />
            <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        {notifications.length > 0 ? (
          <>
            {notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => onMarkAsRead(notification.id)}
                className={`p-4 border-b last:border-b-0 cursor-pointer transition-colors ${
                  notification.read ? 'bg-white' : 'bg-purple-50'
                } hover:bg-gray-50`}
              >
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-medium text-gray-800">{notification.title}</h4>
                  <span className="text-xs text-gray-500">
                    {format(notification.timestamp, 'MMM d, h:mm a')}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{notification.message}</p>
              </div>
            ))}
            <div className="p-3 bg-gray-50 border-t">
              <button
                onClick={onClearAll}
                className="w-full text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Clear all notifications
              </button>
            </div>
          </>
        ) : (
          <div className="p-8 text-center text-gray-500">
            No new notifications
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default NotificationsPanel;
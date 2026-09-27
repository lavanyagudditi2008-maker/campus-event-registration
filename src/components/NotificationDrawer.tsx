import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Bell, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Info, 
  Check, 
  Calendar,
  Sparkles
} from 'lucide-react';

export const NotificationDrawer: React.FC = () => {
  const { 
    notifications, 
    isNotificationOpen, 
    setIsNotificationOpen, 
    markAsRead, 
    markAllAsRead, 
    currentUser,
    openEventDetails,
    events
  } = useApp();

  if (!isNotificationOpen) return null;

  // Filter for user or broadcast notifications
  const userNotifs = notifications.filter(n => 
    currentUser ? (n.userId === currentUser.id || n.userId === 'all') : true
  );

  const unreadCount = userNotifs.filter(n => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'confirmation':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />;
      case 'reminder':
        return <Clock className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />;
      case 'update':
        return <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />;
      case 'announcement':
      default:
        return <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />;
    }
  };

  const formatTimestamp = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="fixed inset-y-0 right-0 max-w-full flex pl-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col">
          
          {/* Drawer Header */}
          <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Campus Notifications</h3>
                <span className="text-xs text-slate-500 tabular-nums">
                  {unreadCount} unread alert{unreadCount === 1 ? '' : 's'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="px-2.5 py-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-md transition-colors flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Mark all read</span>
                </button>
              )}
              <button
                onClick={() => setIsNotificationOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2">
            {userNotifs.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <Bell className="w-10 h-10 mx-auto text-slate-300 mb-3" />
                <p className="text-sm font-semibold text-slate-600">No notifications yet</p>
                <p className="text-xs text-slate-400 mt-1">
                  Updates on your event registrations and schedules will appear here.
                </p>
              </div>
            ) : (
              userNotifs.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    if (!item.read) markAsRead(item.id);
                    if (item.eventId) {
                      const matched = events.find(e => e.id === item.eventId);
                      if (matched) {
                        setIsNotificationOpen(false);
                        openEventDetails(matched);
                      }
                    }
                  }}
                  className={`p-3.5 rounded-xl transition-all cursor-pointer ${
                    item.read 
                      ? 'hover:bg-slate-50 opacity-75' 
                      : 'bg-indigo-50/50 hover:bg-indigo-50 border border-indigo-100/80 shadow-2xs'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {getIcon(item.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {item.title}
                        </h4>
                        {!item.read && (
                          <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />
                        )}
                      </div>

                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {item.message}
                      </p>

                      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                        <span className="font-mono">{formatTimestamp(item.timestamp)}</span>
                        {item.eventId && (
                          <span className="text-indigo-600 hover:underline font-semibold flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            View Event
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-200 bg-slate-50 text-center text-xs text-slate-500">
            Automated alerts from University Student Affairs
          </div>

        </div>
      </div>
    </div>
  );
};

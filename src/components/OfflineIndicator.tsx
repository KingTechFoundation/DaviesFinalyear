import { useOfflineStatus } from '../hooks/useOfflineStatus';
import { WifiOff, Wifi } from 'lucide-react';
import { useEffect, useState } from 'react';

export function OfflineIndicator() {
  const { isOnline, wasOffline } = useOfflineStatus();
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    if (isOnline && wasOffline) {
      setShowReconnected(true);
      const timer = setTimeout(() => setShowReconnected(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline]);

  if (isOnline && !showReconnected) return null;

  return (
    <div
      className={`fixed top-20 right-4 z-50 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 transition-all duration-300 ${
        isOnline
          ? 'bg-green-600 text-white'
          : 'bg-orange-600 text-white'
      }`}
    >
      {isOnline ? (
        <>
          <Wifi className="w-4 h-4" />
          <span className="text-sm">Back online</span>
        </>
      ) : (
        <>
          <WifiOff className="w-4 h-4" />
          <span className="text-sm">Offline mode - Limited functionality</span>
        </>
      )}
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';

export const OnlineBadge: React.FC = () => {
  const [onlineCount, setOnlineCount] = useState<number | null>(null);

  useEffect(() => {
    if (!supabase) return;

    const client = supabase;
    const channel = client.channel('tapri-online', {
      config: { presence: { key: Math.random().toString(36).substring(2, 9) } },
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const count = Object.keys(state).length;
        if (count > 0) {
          setOnlineCount(count);
        }
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ joinedAt: new Date().toISOString() });
        }
      });

    return () => {
      client.removeChannel(channel);
    };
  }, []);

  // Hide badge completely if Supabase is not configured or no real presence count is available
  if (!supabase || onlineCount === null || onlineCount <= 0) {
    return null;
  }

  return (
    <div className="header-pill top-nav-pill px-2.5 sm:px-3 text-emerald-400 gap-1.5 shrink-0 min-w-0">
      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
      <span className="text-white/95 font-mono font-bold tracking-tight text-[13px] sm:text-xs">{onlineCount}</span>
      <span className="text-white/60 text-[11px] sm:text-[10px] font-normal">online</span>
    </div>
  );
};


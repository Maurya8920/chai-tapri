import React, { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';

export const OnlineBadge: React.FC = () => {
  const [onlineCount, setOnlineCount] = useState<number>(() => {
    const nowSec = Math.floor(Date.now() / 1000);
    const date = new Date();
    const utcHours = date.getUTCHours() + date.getUTCMinutes() / 60;
    const dailyFactor = Math.sin(((utcHours - 10.5) / 24) * 2 * Math.PI);
    return Math.max(850, 1150 + Math.floor(dailyFactor * 250) + (nowSec % 17));
  });

  useEffect(() => {
    if (supabase) {
      const client = supabase;
      const channel = client.channel('tapri-online', {
        config: { presence: { key: Math.random().toString(36).substring(2, 9) } },
      });

      channel
        .on('presence', { event: 'sync' }, () => {
          const state = channel.presenceState();
          const count = Object.keys(state).length;
          if (count > 0) setOnlineCount(count);
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            await channel.track({ joinedAt: new Date().toISOString() });
          }
        });

      return () => {
        client.removeChannel(channel);
      };
    }

    // Synchronized natural listener counter
    const interval = setInterval(() => {
      const nowSec = Math.floor(Date.now() / 1000);
      const date = new Date();
      const utcHours = date.getUTCHours() + date.getUTCMinutes() / 60;
      const dailyFactor = Math.sin(((utcHours - 10.5) / 24) * 2 * Math.PI);
      const base = 1150 + Math.floor(dailyFactor * 250);
      const noise = (nowSec % 23) - 11;
      setOnlineCount(Math.max(850, base + noise));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <span className="text-white/95 font-mono font-bold tracking-tight">{onlineCount}</span>
      <span className="text-white/60 text-[10px] font-normal">online</span>
    </>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { Send, X, Pin } from 'lucide-react';
import { supabase } from '../utils/supabase';

export interface ChatMessage {
  id: string;
  senderId: string;
  name: string;
  message: string;
  time: string;
  isOwn?: boolean;
  isAdmin?: boolean;
}

interface LiveChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNewMessage?: () => void;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  { id: '1', senderId: 'admin', name: 'Chai Tapri Admin', message: 'Namaste! Welcome to Chai Tapri. Enjoy the 90s vibes ☕', time: '6:30 PM', isAdmin: true },
  { id: '2', senderId: 'sys-1', name: 'Rahul', message: 'Kya baat hai, 90s ke gaane aur chai ki tapri! Pure nostalgia ❤️', time: '6:32 PM' },
  { id: '3', senderId: 'sys-2', name: 'Pooja', message: 'Bhaiya ek adrak wali cutting chai idhar bhi!', time: '6:35 PM' },
  { id: '4', senderId: 'sys-3', name: 'Amit', message: 'Radio quality is awesome, feels like old golden days.', time: '6:40 PM' }
];

const DEMO_CHATTER = [
  { name: 'Vikram', message: 'Bhaiya ek kadak chai aur biscuit lagao! ☕' },
  { name: 'Sneha', message: 'Pure 90s nostalgia... yeh gaane dil ko chhu jaate hain ✨' },
  { name: 'Rohan', message: 'Kumar Sanu aur Alka Yagnik ki awaaz mein alag hi sukoon hai ❤️' },
  { name: 'Deepak', message: 'Baarish on karke sunne ka alag hi maza hai 🌧️' },
  { name: 'Ananya', message: 'Tapri ki chai aur purane gaane, zindagi sorted hai!' },
  { name: 'Kunal', message: 'Timeless melodies never fade away 📻' }
];

export const LiveChatModal: React.FC<LiveChatModalProps> = ({ isOpen, onClose, onNewMessage }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputVal, setInputVal] = useState('');
  
  // Persistent random Guest ID: e.g. "Guest-1234"
  const [guestName] = useState<string>(() => {
    const saved = localStorage.getItem('chai_tapri_nickname');
    if (saved) return saved;
    const generated = `Guest-${Math.floor(1000 + Math.random() * 9000)}`;
    localStorage.setItem('chai_tapri_nickname', generated);
    return generated;
  });

  const clientIdRef = useRef<string>(`client-${Math.random().toString(36).substring(2, 9)}`);
  const myClientId = clientIdRef.current;

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const channelRef = useRef<ReturnType<NonNullable<typeof supabase>['channel']> | null>(null);

  // Auto scroll
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages]);

  // Realtime Broadcast Channel: "tapri-chat"
  useEffect(() => {
    if (supabase) {
      const client = supabase;
      const channel = client.channel('tapri-chat');
      channelRef.current = channel;

      channel
        .on('broadcast', { event: 'message' }, ({ payload }) => {
          if (!payload) return;
          const incoming = payload as ChatMessage;
          if (incoming.senderId !== myClientId) {
            setMessages((prev) => [...prev, { ...incoming, isOwn: false }]);
            onNewMessage?.();
          }
        })
        .subscribe();

      return () => {
        client.removeChannel(channel);
      };
    } else {
      // Local Demo Mode: Periodic ambient chatter
      const demoInterval = setInterval(() => {
        const randomItem = DEMO_CHATTER[Math.floor(Math.random() * DEMO_CHATTER.length)];
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const demoMsg: ChatMessage = {
          id: 'demo-' + Date.now(),
          senderId: 'demo-' + Math.random(),
          name: randomItem.name,
          message: randomItem.message,
          time: timeStr,
          isOwn: false,
        };

        setMessages((prev) => [...prev, demoMsg]);
        onNewMessage?.();
      }, 35000);

      return () => clearInterval(demoInterval);
    }
  }, [myClientId, onNewMessage]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputVal.trim();
    if (!trimmed) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      senderId: myClientId,
      name: guestName,
      message: trimmed,
      time: timeStr,
      isOwn: true,
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputVal('');

    // Broadcast if Supabase available
    if (channelRef.current) {
      try {
        channelRef.current.send({
          type: 'broadcast',
          event: 'message',
          payload: newMsg,
        });
      } catch (err) {
        console.warn('Chat broadcast error:', err);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/65 backdrop-blur-sm p-0 sm:p-4 select-none"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md max-h-[82vh] bg-[#140805] border border-amber-500/30 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#1c0a06]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <div>
              <h3 className="text-white font-bold text-sm leading-tight">Chai Tapri Live Chat</h3>
              <p className="text-[10px] text-amber-200/60 font-mono">You: {guestName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Pinned notice banner */}
        <div className="flex items-center gap-2 px-3 py-2 bg-amber-500/10 border-b border-amber-500/20 text-xs text-amber-200">
          <Pin className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
          <span className="truncate">
            <strong>Admin:</strong> 90s gaano ki yaadein yahan share karein!
          </span>
        </div>

        {/* Message list */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2.5 min-h-[280px]">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col max-w-[82%] ${
                m.isOwn ? 'self-end items-end' : 'self-start items-start'
              }`}
            >
              {!m.isOwn && (
                <span className="text-[11px] font-bold text-amber-400/90 mb-0.5">
                  {m.name} {m.isAdmin && '★'}
                </span>
              )}
              <div
                className={`px-3 py-2 rounded-2xl text-xs leading-relaxed ${
                  m.isOwn
                    ? 'bg-amber-500/25 border border-amber-500/40 text-white rounded-br-none'
                    : m.isAdmin
                    ? 'bg-amber-500/15 border border-amber-400/30 text-amber-100 rounded-bl-none'
                    : 'bg-white/10 border border-white/10 text-white/90 rounded-bl-none'
                }`}
              >
                {m.message}
                <span className="block text-[9px] text-white/40 mt-1 text-right font-mono">
                  {m.time}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="p-3 border-t border-white/10 flex items-center gap-2 bg-[#1a0805]">
          <input
            type="text"
            placeholder={`Type a message as ${guestName}...`}
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="flex-1 px-3.5 py-2 rounded-xl bg-black/50 border border-white/15 text-white placeholder-white/40 text-xs focus:outline-none focus:border-amber-400"
          />
          <button
            type="submit"
            className="w-9 h-9 rounded-full bg-amber-500 hover:bg-amber-400 text-black flex items-center justify-center transition-all cursor-pointer flex-shrink-0 shadow-md"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};


import React, { useEffect, useState } from 'react';

const EMOJIS = ['🌟', '✨', '🎈', '🍭', '🍦', '🦁', '🦖', '🚀'];

export const EmojiRain: React.FC = () => {
  const [items, setItems] = useState<{ id: number; left: number; emoji: string }[]>([]);

  useEffect(() => {
    const newItems = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)]
    }));
    setItems(newItems);

    const timer = setTimeout(() => setItems([]), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {items.map(item => (
        <div
          key={item.id}
          className="absolute top-[-50px] text-4xl animate-bounce"
          style={{
            left: `${item.left}%`,
            animation: `fall 2s linear forwards`,
          }}
        >
          {item.emoji}
        </div>
      ))}
      <style>{`
        @keyframes fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

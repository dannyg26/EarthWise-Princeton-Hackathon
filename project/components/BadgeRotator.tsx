'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Item = { icon: React.ReactNode; label: string };

export function BadgeRotator({
  items,
  className = '',
  intervalMs = 4200,
  floatY = 10,          // bob amount
  floatDuration = 9,    // bob speed
}: {
  items: Item[];
  className?: string;
  intervalMs?: number;
  floatY?: number;
  floatDuration?: number;
}) {
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % items.length), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs, items.length]);

  const current = items[i];

  return (
    <motion.div
      className={`floating-badge ${className}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <motion.div
        animate={{ y: [0, -floatY, 0] }}
        transition={{ duration: floatDuration, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="badge glassy">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.label}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="flex items-center"
            >
              {current.icon}
              <span className="ml-2 text-xs font-medium">{current.label}</span>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

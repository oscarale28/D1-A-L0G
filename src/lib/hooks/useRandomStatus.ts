import { useState, useEffect } from 'react';
import type { CharacterStatus } from '../types';


const STATUS_OPTIONS: CharacterStatus[] = [
  'online',
  'away',
  'busy',
  'offline',
];

const STATUS_COLORS: Record<CharacterStatus, string> = {
  'online': 'bg-green-400',
  'away': 'bg-yellow-400',
  'busy': 'bg-red-400',
  'offline': 'bg-gray-400',
};

const STATUS_TEXT_COLORS: Record<CharacterStatus, string> = {
  'online': 'text-green-400',
  'away': 'text-yellow-400',
  'busy': 'text-red-400',
  'offline': 'text-gray-400',
};


export const useRandomStatus = () => {
  const [status, setStatus] = useState<CharacterStatus>('online');

  useEffect(() => {
    const changeStatus = () => {
      const randomIndex = Math.floor(Math.random() * STATUS_OPTIONS.length);
      setStatus(STATUS_OPTIONS[randomIndex]);
    };

    const interval = setInterval(changeStatus, 15000);

    changeStatus();

    return () => clearInterval(interval);
  }, []);

  return {
    status,
    statusColor: STATUS_COLORS[status],
    statusTextColor: STATUS_TEXT_COLORS[status],
  };
}; 
import { useContext } from 'react';
import { Context } from '../context/Events';

export const EVENT_COLORS = ['red', 'green', 'blue'] as const;

export const useEvents = () => {
  const value = useContext(Context);
  if (!value) {
    throw new Error('useEvents must be used within an EventsProvider');
  }
  return value;
};

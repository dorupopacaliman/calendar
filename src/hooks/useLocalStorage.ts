import { useEffect, useState } from 'react';
import { Event } from '../context/Events';

const useLocalStorage = (key: string, initialValue: Event[]) => {
  const [value, setValue] = useState<Event[]>(() => {
    const item = localStorage.getItem(key);
    if (item == null) return initialValue;

    return (JSON.parse(item) as Event[]).map(event => {
      if (event.date instanceof Date) return event;
      return { ...event, date: new Date(event.date) };
    });
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
};

export default useLocalStorage;

import { createContext } from 'react';
import { EVENT_COLORS } from '../hooks/useEvent';
import useLocalStorage from '../hooks/useLocalStorage';
import { UnionOmit } from '../utils/types';

export type EventColor = (typeof EVENT_COLORS)[number];

export type Event = {
  id: string;
  name: string;
  color: EventColor;
  date: Date;
} & (
  | { allDay: false; startTime: string; endTime: string }
  | {
      allDay: true;
      startTime?: never;
      endTime?: never;
    }
);

type EventsContext = {
  events: Event[];
  addEvent: (event: UnionOmit<Event, 'id'>) => void;
  updateEvent: (id: string, event: UnionOmit<Event, 'id'>) => void;
  deleteEvent: (id: string) => void;
};

export const Context = createContext<EventsContext | null>(null);

type EventsProviderProps = {
  children: React.ReactNode;
};

const EventsProvider = ({ children }: EventsProviderProps) => {
  const [events, setEvents] = useLocalStorage('EVENTS', []);

  const addEvent = (eventDetails: UnionOmit<Event, 'id'>) => {
    setEvents(prevState => [...prevState, { ...eventDetails, id: crypto.randomUUID() }]);
  };

  const updateEvent = (id: string, eventDetails: UnionOmit<Event, 'id'>) => {
    setEvents(prevState => {
      return prevState.map(event => {
        if (event.id === id) {
          return { id, ...eventDetails };
        }
        return event;
      });
    });
  };

  const deleteEvent = (id: string) => {
    setEvents(prevState => prevState.filter(e => e.id !== id));
  };

  return <Context.Provider value={{ events, addEvent, updateEvent, deleteEvent }}>{children}</Context.Provider>;
};

export default EventsProvider;

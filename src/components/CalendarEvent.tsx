import clsx from 'clsx';
import { parse } from 'date-fns';
import { useState } from 'react';
import { Event } from '../context/Events';
import { useEvents } from '../hooks/useEvent';
import { formatDate } from '../utils/formatDate';
import EventFormModal from './EventFormModal';

const CalendarEvent = ({ event }: { event: Event }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { updateEvent, deleteEvent } = useEvents();

  return (
    <>
      <button className={clsx('event', event.color, { 'all-day-event': event.allDay })} onClick={() => setIsEditModalOpen(true)}>
        {event.allDay ? (
          <div className="event-name">{event.name}</div>
        ) : (
          <>
            <div className={clsx('color-dot', event.color)}></div>
            <div className="event-time">
              {formatDate(parse(event.startTime, 'HH:mm', event.date), { timeStyle: 'short' })}
            </div>
            <div className="event-name">{event.name}</div>
          </>
        )}
      </button>

      <EventFormModal
        event={event}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={e => updateEvent(event.id, e)}
        onDelete={() => deleteEvent(event.id)}
      />
    </>
  );
};

export default CalendarEvent;

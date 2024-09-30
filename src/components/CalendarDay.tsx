import clsx from 'clsx';

import { endOfDay, isBefore, isSameMonth, isToday } from 'date-fns';
import { useMemo, useState } from 'react';
import { Event } from '../context/Events';
import { useEvents } from '../hooks/useEvent';
import { formatDate } from '../utils/formatDate';
import CalendarEvent from './CalendarEvent';
import EventFormModal from './EventFormModal';
import OverflowContainer from './OverflowContainer';
import ViewMoreCalendarEventsModal from './ViewMoreCalendarEventsModal';

type CalendarDayProps = {
  day: Date;
  showWeekName: boolean;
  selectedMonth: Date;
  events: Event[];
};

const CalendarDay = ({ day, showWeekName, selectedMonth, events }: CalendarDayProps) => {
  const [isNewEventModalOpen, setIsNewEventModalOpen] = useState(false);
  const [isViewMoreEventsModalOpen, setIsViewMoreEventsModalOpen] = useState(false);
  const { addEvent } = useEvents();

  const sortedEvents = useMemo(() => {
    const timeToNumber = (time: string) => parseFloat(time.replace(':', '.'));

    return [...events].sort((a, b) => {
      if (a.allDay && b.allDay) {
        return 0;
      } else if (a.allDay) {
        return -1;
      } else if (b.allDay) {
        return 1;
      } else {
        return timeToNumber(a.startTime) - timeToNumber(b.startTime);
      }
    });
  }, [events]);

  return (
    <div
      className={clsx('day', {
        'non-month-day': !isSameMonth(day, selectedMonth),
        'old-month-day': isBefore(endOfDay(day), new Date()),
      })}
    >
      <div className="day-header">
        {showWeekName && <div className="week-name">{formatDate(day, { weekday: 'short' })}</div>}
        <div
          className={clsx('day-number', {
            today: isToday(day),
          })}
        >
          {formatDate(day, { day: 'numeric' })}
        </div>
        <button className="add-event-btn" onClick={() => setIsNewEventModalOpen(true)}>
          +
        </button>
      </div>
      {sortedEvents.length > 0 && (
        <div className="events">
          <OverflowContainer
            className="events"
            items={sortedEvents}
            getKey={event => event.id}
            renderItem={event => <CalendarEvent event={event} />}
            renderOverflow={overflowAmount => (
              <>
                <button className="events-view-more-btn" onClick={() => setIsViewMoreEventsModalOpen(true)}>
                  +{overflowAmount} More
                </button>
                <ViewMoreCalendarEventsModal
                  events={sortedEvents}
                  isOpen={isViewMoreEventsModalOpen}
                  onClose={() => setIsViewMoreEventsModalOpen(false)}
                />
              </>
            )}
          />
        </div>
      )}

      <EventFormModal
        date={day}
        isOpen={isNewEventModalOpen}
        onClose={() => setIsNewEventModalOpen(false)}
        onSubmit={addEvent}
      />
    </div>
  );
};

export default CalendarDay;

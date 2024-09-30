import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  isSameDay,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns';
import { useMemo, useState } from 'react';
import { useEvents } from '../hooks/useEvent';
import { formatDate } from '../utils/formatDate';
import CalendarDay from './CalendarDay';
const Calendar = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const { events } = useEvents();

  const calendarDays = useMemo(() => {
    const firstWeekStart = startOfWeek(startOfMonth(selectedMonth));
    const lastWeekEnd = endOfWeek(endOfMonth(selectedMonth));
    return eachDayOfInterval({ start: firstWeekStart, end: lastWeekEnd });
  }, [selectedMonth]);

  return (
    <div className="calendar">
      <div className="header">
        <button className="btn" onClick={() => setSelectedMonth(new Date())}>
          Today
        </button>
        <div>
          <button className="month-change-btn" onClick={() => setSelectedMonth(subMonths(selectedMonth, 1))}>
            &lt;
          </button>
          <button className="month-change-btn" onClick={() => setSelectedMonth(addMonths(selectedMonth, 1))}>
            &gt;
          </button>
        </div>
        <span className="month-title">{formatDate(selectedMonth, { month: 'long', year: 'numeric' })}</span>
      </div>
      <div className="days">
        {calendarDays.map((day, i) => (
          <CalendarDay
            key={day.getTime()}
            day={day}
            showWeekName={i < 7}
            selectedMonth={selectedMonth}
            events={events.filter(event => isSameDay(day, event.date))}
          />
        ))}
      </div>
    </div>
  );
};

export default Calendar;

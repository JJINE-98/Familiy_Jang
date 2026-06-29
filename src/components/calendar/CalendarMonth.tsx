import type { EnrichedEvent } from '../../types/database';
import { eventOccursOn, getMonthDays, toDateKey, todayKey } from '../../utils/date';

interface CalendarMonthProps {
  month: Date;
  events: EnrichedEvent[];
  onDateClick: (dateKey: string) => void;
  onEventClick: (event: EnrichedEvent) => void;
}

const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

export default function CalendarMonth({ month, events, onDateClick, onEventClick }: CalendarMonthProps) {
  const days = getMonthDays(month);
  const currentMonth = month.getMonth();
  const today = todayKey();

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-soft">
      <div className="calendar-grid hidden border-b border-slate-100 bg-slate-50 text-center text-xs font-bold text-slate-500 md:grid">
        {weekDays.map((day) => <div key={day} className="py-3">{day}</div>)}
      </div>
      <div className="calendar-grid grid">
        {days.map((day) => {
          const dateKey = toDateKey(day);
          const dayEvents = events.filter((event) => eventOccursOn(event, dateKey)).slice(0, 4);
          const isMuted = day.getMonth() !== currentMonth;

          return (
            <button
              key={dateKey}
              type="button"
              className={`min-h-28 border-b border-r border-slate-100 p-2 text-left transition hover:bg-indigo-50/60 md:min-h-32 ${isMuted ? 'bg-slate-50/60 text-slate-400' : 'bg-white text-slate-800'}`}
              onClick={() => onDateClick(dateKey)}
            >
              <div className="mb-2 flex items-center justify-between">
                <span className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold ${dateKey === today ? 'bg-indigo-600 text-white' : ''}`}>
                  {day.getDate()}
                </span>
                <span className="text-[11px] text-slate-400 md:hidden">{weekDays[day.getDay()]}</span>
              </div>
              <div className="space-y-1">
                {dayEvents.map((event) => (
                  <span
                    key={event.id}
                    role="button"
                    tabIndex={0}
                    className="block truncate rounded-lg px-2 py-1 text-xs font-semibold text-white"
                    style={{ background: event.group?.color ?? '#818CF8' }}
                    onClick={(clickEvent) => {
                      clickEvent.stopPropagation();
                      onEventClick(event);
                    }}
                  >
                    {event.event_type === 'birthday' ? '생일 ' : ''}{event.title}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

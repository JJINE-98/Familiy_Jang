import type { EnrichedEvent } from '../../types/database';
import { eventOccursOn, getMonthDays, toDateKey, todayKey } from '../../utils/date';

interface CalendarMonthProps {
  month: Date;
  events: EnrichedEvent[];
  onDateClick: (dateKey: string) => void;
  onEventClick: (event: EnrichedEvent) => void;
}

const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

const eventLabel = (event: EnrichedEvent) => {
  if (event.event_type === 'birthday') return `생일 ${event.title}`;
  if (event.is_important) return `중요 ${event.title}`;
  return event.title;
};

export default function CalendarMonth({ month, events, onDateClick, onEventClick }: CalendarMonthProps) {
  const days = getMonthDays(month);
  const currentMonth = month.getMonth();
  const today = todayKey();

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="calendar-grid grid border-b border-slate-200 bg-slate-50 text-center text-xs font-bold text-slate-500">
        {weekDays.map((day) => (
          <div key={day} className={`py-2.5 ${day === '일' ? 'text-rose-500' : ''} ${day === '토' ? 'text-indigo-500' : ''}`}>
            {day}
          </div>
        ))}
      </div>
      <div className="calendar-grid grid">
        {days.map((day) => {
          const dateKey = toDateKey(day);
          const dayEvents = events.filter((event) => eventOccursOn(event, dateKey));
          const visibleDayEvents = dayEvents.slice(0, 3);
          const isMuted = day.getMonth() !== currentMonth;
          const isToday = dateKey === today;

          return (
            <div
              key={dateKey}
              className={`min-h-[86px] border-b border-r border-slate-100 p-1.5 transition hover:bg-indigo-50/70 sm:min-h-32 sm:p-2.5 ${
                isMuted ? 'bg-slate-50/70 text-slate-400' : 'bg-white text-slate-800'
              }`}
            >
              <button
                type="button"
                className="mb-1.5 flex w-full items-center justify-between gap-1 text-left"
                onClick={() => onDateClick(dateKey)}
              >
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-extrabold sm:h-7 sm:w-7 sm:text-sm ${
                    isToday ? 'bg-indigo-600 text-white shadow-sm' : ''
                  }`}
                >
                  {day.getDate()}
                </span>
                {dayEvents.length > 0 && (
                  <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-500 sm:hidden">
                    {dayEvents.length}
                  </span>
                )}
              </button>

              <div className="flex gap-1 sm:hidden">
                {visibleDayEvents.map((event) => (
                  <button
                    type="button"
                    key={event.id}
                    aria-label={eventLabel(event)}
                    className="h-3 w-3 rounded-full"
                    style={{ background: event.group?.color ?? '#818CF8' }}
                    onClick={() => onEventClick(event)}
                  />
                ))}
              </div>

              <div className="hidden space-y-1 sm:block">
                {visibleDayEvents.map((event) => (
                  <button
                    type="button"
                    key={event.id}
                    className="flex w-full min-w-0 items-center gap-1.5 rounded-md px-1.5 py-1 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    onClick={() => onEventClick(event)}
                  >
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ background: event.group?.color ?? '#818CF8' }}
                    />
                    <span className="truncate">{eventLabel(event)}</span>
                  </button>
                ))}
                {dayEvents.length > visibleDayEvents.length && (
                  <span className="block px-1.5 text-[11px] font-bold text-slate-400">
                    +{dayEvents.length - visibleDayEvents.length}개 더
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

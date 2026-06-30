import type { EnrichedEvent } from '../../types/database';
import { eventOccursOn, getMonthDays, normalizeRepeatDate, toDateKey, todayKey } from '../../utils/date';

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

const isPeriodEvent = (event: EnrichedEvent) => Boolean(event.end_date && event.end_date !== event.start_date);

const periodSegment = (event: EnrichedEvent, day: Date, dateKey: string) => {
  const start = normalizeRepeatDate(event.start_date, event.repeat_type, day);
  const end = event.end_date ? normalizeRepeatDate(event.end_date, event.repeat_type, day) : start;
  return {
    starts: dateKey === start || day.getDay() === 0,
    ends: dateKey === end || day.getDay() === 6,
  };
};

export default function CalendarMonth({ month, events, onDateClick, onEventClick }: CalendarMonthProps) {
  const days = getMonthDays(month);
  const currentMonth = month.getMonth();
  const today = todayKey();

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="calendar-grid grid border-b border-slate-200 bg-slate-50 text-center text-[11px] font-bold text-slate-500">
        {weekDays.map((day) => (
          <div key={day} className={`py-2 ${day === '일' ? 'text-rose-500' : ''} ${day === '토' ? 'text-indigo-500' : ''}`}>
            {day}
          </div>
        ))}
      </div>
      <div className="calendar-grid grid">
        {days.map((day) => {
          const dateKey = toDateKey(day);
          const dayEvents = events.filter((event) => eventOccursOn(event, dateKey));
          const periodEvents = dayEvents.filter(isPeriodEvent).slice(0, 2);
          const pointEvents = dayEvents.filter((event) => !isPeriodEvent(event));
          const visiblePointEvents = pointEvents.slice(0, 2);
          const hiddenCount = Math.max(0, dayEvents.length - periodEvents.length - visiblePointEvents.length);
          const isMuted = day.getMonth() !== currentMonth;
          const isToday = dateKey === today;

          return (
            <div
              key={dateKey}
              className={`relative min-h-[72px] border-b border-r border-slate-100 p-1 pb-4 transition hover:bg-indigo-50/70 sm:min-h-[96px] sm:p-2 sm:pb-6 ${
                isMuted ? 'bg-slate-50/70 text-slate-400' : 'bg-white text-slate-800'
              }`}
            >
              <button
                type="button"
                className="mb-1 flex w-full items-center justify-between gap-1 text-left"
                onClick={() => onDateClick(dateKey)}
              >
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-extrabold sm:h-6 sm:w-6 sm:text-xs ${
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

              <div className="flex flex-wrap gap-1 sm:hidden">
                {visiblePointEvents.map((event) => (
                  <button
                    type="button"
                    key={event.id}
                    aria-label={eventLabel(event)}
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: event.group?.color ?? '#818CF8' }}
                    onClick={() => onEventClick(event)}
                  />
                ))}
              </div>

              <div className="hidden space-y-0.5 sm:block">
                {visiblePointEvents.map((event) => (
                  <button
                    type="button"
                    key={event.id}
                    className="flex w-full min-w-0 items-center gap-1.5 rounded-md px-1 py-0.5 text-left text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
                    onClick={() => onEventClick(event)}
                  >
                    <span
                      className="h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ background: event.group?.color ?? '#818CF8' }}
                    />
                    <span className="truncate">{eventLabel(event)}</span>
                  </button>
                ))}
                {hiddenCount > 0 && (
                  <span className="block px-1 text-[10px] font-bold text-slate-400">
                    +{hiddenCount}개 더
                  </span>
                )}
              </div>

              {periodEvents.map((event, index) => {
                const segment = periodSegment(event, day, dateKey);
                return (
                  <button
                    type="button"
                    key={`${event.id}-${dateKey}`}
                    aria-label={eventLabel(event)}
                    className={`absolute h-1.5 transition hover:h-2 ${
                      segment.starts ? 'left-1.5 rounded-l-full' : 'left-0'
                    } ${segment.ends ? 'right-1.5 rounded-r-full' : 'right-0'}`}
                    style={{
                      bottom: `${6 + index * 7}px`,
                      background: event.group?.color ?? '#818CF8',
                    }}
                    onClick={() => onEventClick(event)}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

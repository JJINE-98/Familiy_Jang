import type { FamilyEvent, RepeatType } from '../types/database';

const dateFormatter = new Intl.DateTimeFormat('ko-KR', {
  month: 'long',
  day: 'numeric',
  weekday: 'short',
});

export const toDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const todayKey = () => toDateKey(new Date());

export const parseDateKey = (dateKey: string) => {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day);
};

export const formatDate = (dateKey: string) => dateFormatter.format(parseDateKey(dateKey));

export const formatDateRange = (start: string, end?: string | null) => {
  if (!end || end === start) return formatDate(start);
  return `${formatDate(start)} - ${formatDate(end)}`;
};

export const getMonthDays = (baseDate: Date) => {
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();
  const first = new Date(year, month, 1);
  const start = new Date(first);
  start.setDate(first.getDate() - first.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return date;
  });
};

export const getWeekRange = () => {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay());
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return { start: toDateKey(start), end: toDateKey(end) };
};

const normalizeForYear = (dateKey: string, year: number) => {
  const [, month, day] = dateKey.split('-').map(Number);
  return toDateKey(new Date(year, month - 1, day));
};

const normalizeForMonth = (dateKey: string, year: number, month: number) => {
  const [, , day] = dateKey.split('-').map(Number);
  return toDateKey(new Date(year, month, day));
};

export const eventOccursOn = (event: FamilyEvent, dateKey: string) => {
  const date = parseDateKey(dateKey);
  const targetStart = normalizeRepeatDate(event.start_date, event.repeat_type, date);
  const targetEnd = event.end_date
    ? normalizeRepeatDate(event.end_date, event.repeat_type, date)
    : targetStart;
  return dateKey >= targetStart && dateKey <= targetEnd;
};

export const normalizeRepeatDate = (dateKey: string, repeat: RepeatType, target: Date) => {
  if (repeat === 'yearly') return normalizeForYear(dateKey, target.getFullYear());
  if (repeat === 'monthly') return normalizeForMonth(dateKey, target.getFullYear(), target.getMonth());
  return dateKey;
};

export const daysUntil = (dateKey: string) => {
  const today = parseDateKey(todayKey()).getTime();
  const target = parseDateKey(dateKey).getTime();
  return Math.ceil((target - today) / 86_400_000);
};

export const isWithin = (dateKey: string, start: string, end: string) => dateKey >= start && dateKey <= end;

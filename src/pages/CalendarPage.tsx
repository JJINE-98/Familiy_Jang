import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import Button from '../components/common/Button';
import ConfirmModal from '../components/common/ConfirmModal';
import Modal from '../components/common/Modal';
import CalendarMonth from '../components/calendar/CalendarMonth';
import EventDetailModal from '../components/events/EventDetailModal';
import EventForm from '../components/events/EventForm';
import { AuthContext } from '../App';
import { eventService } from '../services/eventService';
import { pollService } from '../services/pollService';
import { userService } from '../services/userService';
import type { AppLayoutOutletContext, HeaderMetric } from '../components/layout/AppLayout';
import type { EnrichedEvent, EnrichedPoll, EventInput, FamilyUser, UserGroup } from '../types/database';
import { eventOccursOn, getWeekRange, todayKey } from '../utils/date';

type FilterKey = 'all' | 'my-group' | 'important' | 'schedule' | 'anniversary' | 'birthday';

const filters: { key: FilterKey; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'my-group', label: '내 그룹' },
  { key: 'important', label: '중요' },
  { key: 'schedule', label: '일정' },
  { key: 'anniversary', label: '기념일' },
  { key: 'birthday', label: '생일' },
];

export default function CalendarPage() {
  const { currentUser } = useContext(AuthContext);
  const { setHeaderMetrics } = useOutletContext<AppLayoutOutletContext>();
  const [month, setMonth] = useState(new Date());
  const [events, setEvents] = useState<EnrichedEvent[]>([]);
  const [users, setUsers] = useState<FamilyUser[]>([]);
  const [groups, setGroups] = useState<UserGroup[]>([]);
  const [polls, setPolls] = useState<EnrichedPoll[]>([]);
  const [filter, setFilter] = useState<FilterKey>('all');
  const [selectedDate, setSelectedDate] = useState<string | undefined>();
  const [selectedEvent, setSelectedEvent] = useState<EnrichedEvent | null>(null);
  const [editingEvent, setEditingEvent] = useState<EnrichedEvent | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<EnrichedEvent | null>(null);

  const load = async () => {
    const [eventData, userData, groupData, pollData] = await Promise.all([
      eventService.getEvents(),
      userService.getUsers(),
      userService.getGroups(),
      pollService.getPolls(),
    ]);
    setEvents(eventData);
    setUsers(userData);
    setGroups(groupData);
    setPolls(pollData);
  };

  useEffect(() => {
    load();
  }, []);

  const birthdayEvents = useMemo<EnrichedEvent[]>(() => users.map((user) => ({
    id: `birthday-${user.id}`,
    title: `${user.name}`,
    memo: '사용자 정보에 등록된 생일입니다.',
    event_type: 'birthday',
    start_date: user.birth_date,
    end_date: user.birth_date,
    repeat_type: 'yearly',
    is_important: false,
    group_id: user.group_id,
    created_by: user.id,
    created_at: user.created_at,
    updated_at: user.created_at,
    creator: user,
    group: groups.find((group) => group.id === user.group_id) ?? null,
  })), [users, groups]);

  const allEvents = [...events, ...birthdayEvents];
  const visibleEvents = allEvents.filter((event) => {
    if (filter === 'my-group') return event.group_id === currentUser?.group_id;
    if (filter === 'important') return event.is_important;
    if (filter === 'schedule') return event.event_type === 'schedule';
    if (filter === 'anniversary') return event.event_type === 'anniversary';
    if (filter === 'birthday') return event.event_type === 'birthday';
    return true;
  });

  const week = getWeekRange();
  const today = todayKey();
  const importantCount = visibleEvents.filter((event) => event.is_important).length;
  const todayCount = visibleEvents.filter((event) => eventOccursOn(event, today)).length;
  const weekCount = visibleEvents.filter((event) => {
    for (let d = new Date(week.start); d <= new Date(week.end); d.setDate(d.getDate() + 1)) {
      if (eventOccursOn(event, d.toISOString().slice(0, 10))) return true;
    }
    return false;
  }).length;
  const urgentPolls = polls.filter((poll) => {
    const days = Math.ceil((new Date(poll.deadline_date).getTime() - new Date(today).getTime()) / 86_400_000);
    return days >= 0 && days <= 2 && !poll.votes.some((vote) => vote.user_id === currentUser?.id);
  });

  const headerMetrics = useMemo<HeaderMetric[]>(() => [
    { label: '중요', value: importantCount, tone: 'amber' },
    { label: '오늘', value: todayCount, tone: 'indigo' },
    { label: '이번주', value: weekCount, tone: 'emerald' },
    { label: '투표임박', value: urgentPolls.length, tone: 'rose' },
  ], [importantCount, todayCount, urgentPolls.length, weekCount]);

  useEffect(() => {
    setHeaderMetrics(headerMetrics);
    return () => setHeaderMetrics([]);
  }, [headerMetrics, setHeaderMetrics]);

  const saveEvent = async (input: EventInput, id?: string) => {
    await eventService.saveEvent(input, id);
    setSelectedDate(undefined);
    setEditingEvent(null);
    await load();
  };

  return (
    <div className="space-y-4">
      <section className="rounded-2xl bg-white p-3 shadow-soft sm:p-4">
        <div className="mb-3 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center justify-between gap-2 sm:justify-start">
            <Button variant="ghost" className="h-10 w-10 px-0" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}>
              <ChevronLeft size={18} />
            </Button>
            <h1 className="min-w-36 text-center text-xl font-extrabold text-slate-900">
              {month.getFullYear()}년 {month.getMonth() + 1}월
            </h1>
            <Button variant="ghost" className="h-10 w-10 px-0" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}>
              <ChevronRight size={18} />
            </Button>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {filters.map((item) => (
              <Button
                key={item.key}
                variant={filter === item.key ? 'primary' : 'secondary'}
                className="shrink-0 px-3"
                onClick={() => setFilter(item.key)}
              >
                {item.label}
              </Button>
            ))}
            <Button icon={<Plus size={16} />} className="shrink-0" onClick={() => setSelectedDate(today)}>일정 추가</Button>
          </div>
        </div>
        <CalendarMonth month={month} events={visibleEvents} onDateClick={setSelectedDate} onEventClick={setSelectedEvent} />
      </section>

      <Modal title={editingEvent ? '일정 수정' : '일정 추가'} isOpen={Boolean(selectedDate || editingEvent)} onClose={() => { setSelectedDate(undefined); setEditingEvent(null); }}>
        <EventForm groups={groups} selectedDate={selectedDate} event={editingEvent} onCancel={() => { setSelectedDate(undefined); setEditingEvent(null); }} onSave={saveEvent} />
      </Modal>
      <EventDetailModal
        event={selectedEvent}
        currentUser={currentUser}
        onClose={() => setSelectedEvent(null)}
        onEdit={() => { setEditingEvent(selectedEvent); setSelectedEvent(null); }}
        onDelete={() => { setDeleteTarget(selectedEvent); setSelectedEvent(null); }}
      />
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="일정을 삭제할까요?"
        message="삭제한 일정은 되돌릴 수 없습니다."
        onCancel={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (deleteTarget) await eventService.deleteEvent(deleteTarget.id);
          setDeleteTarget(null);
          await load();
        }}
      />
    </div>
  );
}

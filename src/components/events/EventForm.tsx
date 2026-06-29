import { useContext, useState, type FormEvent } from 'react';
import Button from '../common/Button';
import type { EnrichedEvent, EventInput, EventType, RepeatType, UserGroup } from '../../types/database';
import { AuthContext } from '../../App';
import { todayKey } from '../../utils/date';

interface EventFormProps {
  groups: UserGroup[];
  selectedDate?: string;
  event?: EnrichedEvent | null;
  onCancel: () => void;
  onSave: (input: EventInput, eventId?: string) => Promise<void>;
}

export default function EventForm({ groups, selectedDate, event, onCancel, onSave }: EventFormProps) {
  const { currentUser } = useContext(AuthContext);
  const [startDate, setStartDate] = useState(event?.start_date ?? selectedDate ?? todayKey());
  const [endDate, setEndDate] = useState(event?.end_date ?? event?.start_date ?? selectedDate ?? todayKey());
  const [title, setTitle] = useState(event?.title ?? '');
  const [eventType, setEventType] = useState<EventType>(event?.event_type ?? 'schedule');
  const [repeatType, setRepeatType] = useState<RepeatType>(event?.repeat_type ?? 'none');
  const [isImportant, setImportant] = useState(event?.is_important ?? false);
  const [memo, setMemo] = useState(event?.memo ?? '');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (formEvent: FormEvent) => {
    formEvent.preventDefault();
    if (!currentUser) return;
    setSaving(true);
    await onSave(
      {
        title,
        memo,
        event_type: eventType,
        start_date: startDate,
        end_date: endDate || startDate,
        repeat_type: repeatType,
        is_important: isImportant,
        group_id: currentUser.group_id,
        created_by: event?.created_by ?? currentUser.id,
      },
      event?.id,
    );
    setSaving(false);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1 text-sm font-semibold text-slate-700">
          시작일
          <input className="w-full rounded-xl border border-slate-200 px-3 py-2" type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} required />
        </label>
        <label className="space-y-1 text-sm font-semibold text-slate-700">
          종료일
          <input className="w-full rounded-xl border border-slate-200 px-3 py-2" type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} min={startDate} />
        </label>
      </div>
      <label className="space-y-1 text-sm font-semibold text-slate-700">
        제목
        <input className="w-full rounded-xl border border-slate-200 px-3 py-2" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="예: 가족 저녁 모임" required />
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1 text-sm font-semibold text-slate-700">
          종류
          <select className="w-full rounded-xl border border-slate-200 px-3 py-2" value={eventType} onChange={(event) => setEventType(event.target.value as EventType)}>
            <option value="schedule">일정</option>
            <option value="anniversary">기념일</option>
            <option value="birthday">생일</option>
          </select>
        </label>
        <label className="space-y-1 text-sm font-semibold text-slate-700">
          반복
          <select className="w-full rounded-xl border border-slate-200 px-3 py-2" value={repeatType} onChange={(event) => setRepeatType(event.target.value as RepeatType)}>
            <option value="none">없음</option>
            <option value="yearly">매년</option>
            <option value="monthly">매월</option>
          </select>
        </label>
      </div>
      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
        <input type="checkbox" checked={isImportant} onChange={(event) => setImportant(event.target.checked)} />
        중요한 일정
      </label>
      <label className="space-y-1 text-sm font-semibold text-slate-700">
        메모
        <textarea className="min-h-24 w-full rounded-xl border border-slate-200 px-3 py-2" value={memo} onChange={(event) => setMemo(event.target.value)} placeholder="가족이 함께 볼 메모를 남겨주세요." />
      </label>
      <div className="flex justify-end gap-2">
        <Button variant="ghost" type="button" onClick={onCancel}>취소</Button>
        <Button type="submit" disabled={saving}>{saving ? '저장 중' : '저장'}</Button>
      </div>
    </form>
  );
}

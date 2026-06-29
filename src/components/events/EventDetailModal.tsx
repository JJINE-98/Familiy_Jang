import { Edit3, Trash2 } from 'lucide-react';
import Button from '../common/Button';
import Modal from '../common/Modal';
import type { EnrichedEvent, FamilyUser } from '../../types/database';
import { formatDateRange } from '../../utils/date';

const eventTypeLabel = {
  schedule: '일정',
  anniversary: '기념일',
  birthday: '생일',
};

const repeatLabel = {
  none: '없음',
  yearly: '매년',
  monthly: '매월',
};

interface EventDetailModalProps {
  event: EnrichedEvent | null;
  currentUser: FamilyUser | null;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function EventDetailModal({ event, currentUser, onClose, onEdit, onDelete }: EventDetailModalProps) {
  if (!event) return null;
  const canManage = currentUser?.is_admin || currentUser?.id === event.created_by;

  return (
    <Modal title="일정 상세" isOpen={Boolean(event)} onClose={onClose}>
      <div className="space-y-4">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="h-3 w-3 rounded-full" style={{ background: event.group?.color ?? '#818CF8' }} />
            <span className="text-xs font-semibold text-slate-500">{event.group?.name ?? '공통'}</span>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900">{event.title}</h3>
        </div>
        <dl className="grid gap-3 rounded-2xl bg-slate-50 p-4 text-sm sm:grid-cols-2">
          <div><dt className="font-semibold text-slate-500">날짜</dt><dd>{formatDateRange(event.start_date, event.end_date)}</dd></div>
          <div><dt className="font-semibold text-slate-500">종류</dt><dd>{eventTypeLabel[event.event_type]}</dd></div>
          <div><dt className="font-semibold text-slate-500">반복</dt><dd>{repeatLabel[event.repeat_type]}</dd></div>
          <div><dt className="font-semibold text-slate-500">중요</dt><dd>{event.is_important ? '중요 일정' : '일반 일정'}</dd></div>
          <div><dt className="font-semibold text-slate-500">등록자</dt><dd>{event.creator?.name ?? '알 수 없음'}</dd></div>
        </dl>
        {event.memo && <p className="rounded-2xl bg-indigo-50 p-4 text-sm leading-6 text-slate-700">{event.memo}</p>}
        {canManage && (
          <div className="flex justify-end gap-2">
            <Button variant="secondary" icon={<Edit3 size={16} />} onClick={onEdit}>수정</Button>
            <Button variant="danger" icon={<Trash2 size={16} />} onClick={onDelete}>삭제</Button>
          </div>
        )}
      </div>
    </Modal>
  );
}

import { useContext, useState, type FormEvent } from 'react';
import Button from '../common/Button';
import { AuthContext } from '../../App';
import type { PollInput } from '../../types/database';
import { todayKey } from '../../utils/date';

export default function PollForm({ onCancel, onSave }: { onCancel: () => void; onSave: (input: PollInput) => Promise<void> }) {
  const { currentUser } = useContext(AuthContext);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [deadline, setDeadline] = useState(todayKey());
  const [anonymous, setAnonymous] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!currentUser) return;
    setSaving(true);
    await onSave({
      title,
      content,
      deadline_date: deadline,
      is_anonymous: anonymous,
      created_by: currentUser.id,
    });
    setSaving(false);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <label className="space-y-1 text-sm font-semibold text-slate-700">
        제목
        <input className="w-full rounded-xl border border-slate-200 px-3 py-2" value={title} onChange={(event) => setTitle(event.target.value)} required />
      </label>
      <label className="space-y-1 text-sm font-semibold text-slate-700">
        내용
        <textarea className="min-h-28 w-full rounded-xl border border-slate-200 px-3 py-2" value={content} onChange={(event) => setContent(event.target.value)} />
      </label>
      <label className="space-y-1 text-sm font-semibold text-slate-700">
        기한일자
        <input className="w-full rounded-xl border border-slate-200 px-3 py-2" type="date" value={deadline} onChange={(event) => setDeadline(event.target.value)} required />
      </label>
      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
        <input type="checkbox" checked={anonymous} onChange={(event) => setAnonymous(event.target.checked)} />
        익명 투표
      </label>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onCancel}>취소</Button>
        <Button type="submit" disabled={saving}>{saving ? '등록 중' : '등록'}</Button>
      </div>
    </form>
  );
}

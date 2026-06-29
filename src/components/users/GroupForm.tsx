import { useState } from 'react';
import Button from '../common/Button';
import type { GroupInput, UserGroup } from '../../types/database';

export default function GroupForm({ group, onSave }: { group?: UserGroup; onSave: (input: GroupInput, id?: string) => Promise<void> }) {
  const [name, setName] = useState(group?.name ?? '');
  const [color, setColor] = useState(group?.color ?? '#818CF8');
  const [sortOrder, setSortOrder] = useState(group?.sort_order ?? 1);

  return (
    <form
      className="grid gap-3 md:grid-cols-[1fr_110px_100px_auto]"
      onSubmit={async (event) => {
        event.preventDefault();
        await onSave({ name, color, sort_order: sortOrder }, group?.id);
        if (!group) setName('');
      }}
    >
      <input className="rounded-xl border border-slate-200 px-3 py-2" value={name} onChange={(event) => setName(event.target.value)} placeholder="그룹명" required />
      <input className="h-11 w-full rounded-xl border border-slate-200 p-1" type="color" value={color} onChange={(event) => setColor(event.target.value)} />
      <input className="rounded-xl border border-slate-200 px-3 py-2" type="number" value={sortOrder} onChange={(event) => setSortOrder(Number(event.target.value))} />
      <Button type="submit">{group ? '수정' : '추가'}</Button>
    </form>
  );
}

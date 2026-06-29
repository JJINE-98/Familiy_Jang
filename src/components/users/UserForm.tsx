import { useState } from 'react';
import Button from '../common/Button';
import type { FamilyUser, UserGroup, UserInput } from '../../types/database';

export default function UserForm({ user, groups, onSave }: { user?: FamilyUser; groups: UserGroup[]; onSave: (input: UserInput, id?: string) => Promise<void> }) {
  const [name, setName] = useState(user?.name ?? '');
  const [birthDate, setBirthDate] = useState(user?.birth_date ?? '');
  const [groupId, setGroupId] = useState(user?.group_id ?? groups[0]?.id ?? '');
  const [isAdmin, setAdmin] = useState(user?.is_admin ?? false);
  const [active, setActive] = useState(user?.active ?? true);

  return (
    <form
      className="grid gap-3 lg:grid-cols-[1fr_150px_150px_auto_auto_auto]"
      onSubmit={async (event) => {
        event.preventDefault();
        await onSave({ name, birth_date: birthDate, group_id: groupId, is_admin: isAdmin, active }, user?.id);
        if (!user) {
          setName('');
          setBirthDate('');
        }
      }}
    >
      <input className="rounded-xl border border-slate-200 px-3 py-2" value={name} onChange={(event) => setName(event.target.value)} placeholder="이름" required />
      <input className="rounded-xl border border-slate-200 px-3 py-2" type="date" value={birthDate} onChange={(event) => setBirthDate(event.target.value)} required />
      <select className="rounded-xl border border-slate-200 px-3 py-2" value={groupId} onChange={(event) => setGroupId(event.target.value)}>
        {groups.map((group) => <option key={group.id} value={group.id}>{group.name}</option>)}
      </select>
      <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={isAdmin} onChange={(event) => setAdmin(event.target.checked)} /> 관리자</label>
      <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={active} onChange={(event) => setActive(event.target.checked)} /> 활성</label>
      <Button type="submit">{user ? '수정' : '추가'}</Button>
    </form>
  );
}

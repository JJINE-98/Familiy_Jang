import { useEffect, useState } from 'react';
import Card from '../components/common/Card';
import GroupForm from '../components/users/GroupForm';
import UserForm from '../components/users/UserForm';
import { userService } from '../services/userService';
import type { FamilyUser, GroupInput, UserGroup, UserInput } from '../types/database';

export default function UserManagePage() {
  const [groups, setGroups] = useState<UserGroup[]>([]);
  const [users, setUsers] = useState<FamilyUser[]>([]);

  const load = async () => {
    const [groupData, userData] = await Promise.all([userService.getGroups(), userService.getUsers(true)]);
    setGroups(groupData);
    setUsers(userData);
  };

  useEffect(() => {
    load();
  }, []);

  const saveGroup = async (input: GroupInput, id?: string) => {
    await userService.saveGroup(input, id);
    await load();
  };

  const saveUser = async (input: UserInput, id?: string) => {
    await userService.saveUser(input, id);
    await load();
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">사용자 관리</h1>
        <p className="mt-1 text-sm text-slate-500">가족 그룹과 구성원을 관리합니다. 삭제 대신 비활성으로 보관해요.</p>
      </div>
      <Card className="space-y-4">
        <h2 className="text-lg font-extrabold">그룹 관리</h2>
        <GroupForm onSave={saveGroup} />
        <div className="space-y-3">
          {groups.map((group) => (
            <div key={group.id} className="rounded-2xl bg-slate-50 p-3">
              <GroupForm group={group} onSave={saveGroup} />
            </div>
          ))}
        </div>
      </Card>
      <Card className="space-y-4">
        <h2 className="text-lg font-extrabold">사용자 관리</h2>
        <UserForm groups={groups} onSave={saveUser} />
        <div className="space-y-3">
          {users.map((user) => (
            <div key={user.id} className={`rounded-2xl p-3 ${user.active ? 'bg-slate-50' : 'bg-rose-50'}`}>
              <UserForm user={user} groups={groups} onSave={saveUser} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

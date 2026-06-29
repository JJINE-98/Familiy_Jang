import { useContext, useEffect, useState } from 'react';
import Card from '../components/common/Card';
import { AuthContext } from '../App';
import { userService } from '../services/userService';
import type { UserGroup } from '../types/database';
import { formatDate } from '../utils/date';

export default function ProfilePage() {
  const { currentUser } = useContext(AuthContext);
  const [groups, setGroups] = useState<UserGroup[]>([]);

  useEffect(() => {
    userService.getGroups().then(setGroups);
  }, []);

  const group = groups.find((item) => item.id === currentUser?.group_id);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">내 정보</h1>
        <p className="mt-1 text-sm text-slate-500">로그인된 가족 구성원 정보를 확인합니다.</p>
      </div>
      <Card>
        <div className="mb-5 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl text-xl font-extrabold text-white" style={{ background: group?.color ?? '#818CF8' }}>
            {currentUser?.name.slice(0, 1)}
          </div>
          <div>
            <h2 className="text-2xl font-extrabold">{currentUser?.name}</h2>
            <p className="text-sm font-semibold text-slate-500">{currentUser?.is_admin ? '관리자' : '일반 사용자'}</p>
          </div>
        </div>
        <dl className="grid gap-3 rounded-2xl bg-slate-50 p-4 sm:grid-cols-2">
          <div><dt className="text-sm font-bold text-slate-500">생년월일</dt><dd className="font-semibold">{currentUser?.birth_date ? formatDate(currentUser.birth_date) : '-'}</dd></div>
          <div><dt className="text-sm font-bold text-slate-500">그룹</dt><dd className="font-semibold">{group?.name ?? '미지정'}</dd></div>
          <div><dt className="text-sm font-bold text-slate-500">상태</dt><dd className="font-semibold">{currentUser?.active ? '활성' : '비활성'}</dd></div>
        </dl>
      </Card>
    </div>
  );
}

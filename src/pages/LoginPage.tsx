import { useContext, useEffect, useState, type FormEvent } from 'react';
import { Navigate } from 'react-router-dom';
import { CalendarHeart } from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { AuthContext } from '../App';
import { userService } from '../services/userService';
import type { FamilyUser } from '../types/database';

export default function LoginPage() {
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const [users, setUsers] = useState<FamilyUser[]>([]);
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    userService.getUsers().then((data) => {
      setUsers(data);
      setName(data[0]?.name ?? '');
    });
  }, []);

  if (currentUser) return <Navigate to="/calendar" replace />;

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    const user = await userService.login(name, birthDate);
    if (!user) {
      setError('이름과 생년월일이 일치하는 가족 구성원을 찾지 못했어요.');
      return;
    }
    setCurrentUser(user);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-family-bg p-4">
      <Card className="w-full max-w-md p-7">
        <div className="mb-7 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700">
            <CalendarHeart size={28} />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Jang Family</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">이름과 생년월일로 간단히 들어와 가족 일정을 함께 확인해요.</p>
        </div>
        <form className="space-y-4" onSubmit={handleLogin}>
          <label className="space-y-1 text-sm font-semibold text-slate-700">
            이름
            <select className="w-full rounded-xl border border-slate-200 px-3 py-2" value={name} onChange={(event) => setName(event.target.value)}>
              {users.map((user) => <option key={user.id} value={user.name}>{user.name}</option>)}
            </select>
          </label>
          <label className="space-y-1 text-sm font-semibold text-slate-700">
            생년월일
            <input className="w-full rounded-xl border border-slate-200 px-3 py-2" type="date" value={birthDate} onChange={(event) => setBirthDate(event.target.value)} required />
          </label>
          {error && <p className="rounded-xl bg-rose-50 p-3 text-sm font-semibold text-rose-600">{error}</p>}
          <Button className="w-full" type="submit">로그인</Button>
        </form>
        <p className="mt-5 rounded-2xl bg-indigo-50 p-4 text-xs leading-5 text-indigo-700">
          Supabase 설정 전에는 샘플 가족 데이터가 표시됩니다. 예: 장민수 / 1965-05-12
        </p>
      </Card>
    </main>
  );
}

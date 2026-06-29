import { CalendarDays, Menu, UserRound, UsersRound, Vote } from 'lucide-react';
import { Outlet, NavLink } from 'react-router-dom';
import { useContext, useState } from 'react';
import Button from '../common/Button';
import { AuthContext } from '../../App';
import { isSupabaseConfigured } from '../../services/supabase';

const navItems = [
  { to: '/calendar', label: '일정', icon: CalendarDays },
  { to: '/polls', label: '투표', icon: Vote },
  { to: '/users', label: '사용자 관리', icon: UsersRound, adminOnly: true },
  { to: '/profile', label: '내 정보', icon: UserRound },
];

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { currentUser, logout } = useContext(AuthContext);
  const visibleItems = navItems.filter((item) => !item.adminOnly || currentUser?.is_admin);

  return (
    <div className="min-h-screen bg-family-bg pb-20 text-family-ink md:pb-0">
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="hidden h-10 w-10 px-0 md:inline-flex" onClick={() => setCollapsed((value) => !value)}>
              <Menu size={19} />
            </Button>
            <div>
              <p className="text-base font-extrabold text-indigo-700">Jang Family</p>
              <p className="hidden text-xs text-slate-500 sm:block">
                {isSupabaseConfigured ? 'Supabase 연결됨' : '샘플 모드로 확인 중'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm font-medium text-slate-600 sm:inline">
              {currentUser?.name}님으로 로그인 중
            </span>
            <Button variant="secondary" onClick={logout}>로그아웃</Button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 md:px-6">
        <aside className={`sticky top-24 hidden h-[calc(100vh-6rem)] shrink-0 rounded-2xl bg-white p-3 shadow-soft md:block ${collapsed ? 'w-20' : 'w-56'}`}>
          <nav className="space-y-2">
            {visibleItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${
                    isActive ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-700'
                  }`
                }
              >
                <item.icon size={20} />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-40 grid border-t border-slate-200 bg-white md:hidden" style={{ gridTemplateColumns: `repeat(${visibleItems.length}, minmax(0, 1fr))` }}>
        {visibleItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-2 py-3 text-xs font-semibold ${isActive ? 'text-indigo-700' : 'text-slate-500'}`
            }
          >
            <item.icon size={20} />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { createContext, useEffect, useMemo, useState } from 'react';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './pages/LoginPage';
import CalendarPage from './pages/CalendarPage';
import PollListPage from './pages/PollListPage';
import PollDetailPage from './pages/PollDetailPage';
import UserManagePage from './pages/UserManagePage';
import ProfilePage from './pages/ProfilePage';
import { clearStoredUser, getStoredUser, storeUser } from './utils/auth';
import type { FamilyUser } from './types/database';

interface AuthContextValue {
  currentUser: FamilyUser | null;
  setCurrentUser: (user: FamilyUser) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue>({
  currentUser: null,
  setCurrentUser: () => undefined,
  logout: () => undefined,
});

function App() {
  const [currentUser, setUser] = useState<FamilyUser | null>(null);

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  const auth = useMemo<AuthContextValue>(
    () => ({
      currentUser,
      setCurrentUser: (user) => {
        storeUser(user);
        setUser(user);
      },
      logout: () => {
        clearStoredUser();
        setUser(null);
      },
    }),
    [currentUser],
  );

  return (
    <AuthContext.Provider value={auth}>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={currentUser ? <AppLayout /> : <Navigate to="/login" replace />}
          >
            <Route index element={<Navigate to="/calendar" replace />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="polls" element={<PollListPage />} />
            <Route path="polls/:pollId" element={<PollDetailPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route
              path="users"
              element={currentUser?.is_admin ? <UserManagePage /> : <Navigate to="/calendar" replace />}
            />
          </Route>
        </Routes>
      </HashRouter>
    </AuthContext.Provider>
  );
}

export default App;

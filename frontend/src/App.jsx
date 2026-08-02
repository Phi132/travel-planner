import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useThemeStore } from '@/store/useThemeStore';
import { useBootstrapAuth } from '@/hooks/useBootstrapAuth';

import { AppLayout } from '@/layouts/AppLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import { ProtectedRoute, GuestRoute } from '@/components/common/RouteGuards';

import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import DashboardPage from '@/pages/DashboardPage';
import TripsListPage from '@/pages/trips/TripsListPage';
import TripDetailPage from '@/pages/trips/TripDetailPage';
import JournalPage from '@/pages/journal/JournalPage';
import ExpensesPage from '@/pages/expenses/ExpensesPage';
import FavoritesPage from '@/pages/favorites/FavoritesPage';
import PlacesPage from '@/pages/places/PlacesPage';
import PlaceDetailPage from '@/pages/places/PlaceDetailPage';
import StatisticsPage from '@/pages/statistics/StatisticsPage';
import ProfilePage from '@/pages/profile/ProfilePage';
import NotFoundPage from '@/pages/NotFoundPage';

export default function App() {
  const initTheme = useThemeStore((s) => s.initTheme);

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  useBootstrapAuth();

  return (
    <Routes>
      {/* Nhóm route công khai — tự chuyển về "/" nếu đã đăng nhập */}
      <Route element={<GuestRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Route>

      {/* Nhóm route cần đăng nhập */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/trips" element={<TripsListPage />} />
          <Route path="/trips/:id" element={<TripDetailPage />} />
          <Route path="/journal" element={<JournalPage />} />
          <Route path="/expenses" element={<ExpensesPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/places" element={<PlacesPage />} />
          <Route path="/places/:id" element={<PlaceDetailPage />} />
          <Route path="/statistics" element={<StatisticsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

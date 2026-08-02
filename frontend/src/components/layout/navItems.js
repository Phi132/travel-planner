import { Home, Map, NotebookPen, Wallet, Heart, Compass, UserRound, BarChart3 } from 'lucide-react';

export const NAV_ITEMS = [
  { to: '/', label: 'Trang chủ', icon: Home, end: true },
  { to: '/trips', label: 'Chuyến đi', icon: Map },
  { to: '/journal', label: 'Nhật ký', icon: NotebookPen },
  { to: '/expenses', label: 'Chi phí', icon: Wallet },
  { to: '/favorites', label: 'Yêu thích', icon: Heart },
  { to: '/places', label: 'Địa điểm', icon: Compass },
  { to: '/statistics', label: 'Thống kê', icon: BarChart3 },
  { to: '/profile', label: 'Hồ sơ', icon: UserRound }
];

// Bottom nav mobile chỉ hiển thị tối đa 5 mục theo chuẩn iOS Human Interface Guidelines
export const MOBILE_NAV_ITEMS = [
  NAV_ITEMS[0],
  NAV_ITEMS[1],
  NAV_ITEMS[2],
  NAV_ITEMS[4],
  NAV_ITEMS[7]
];

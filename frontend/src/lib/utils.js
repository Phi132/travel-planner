import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Kết hợp className theo chuẩn shadcn/ui, tự động xử lý xung đột Tailwind.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Định dạng số tiền theo chuẩn Việt Nam (VNĐ).
 */
export function formatCurrency(amount) {
  if (amount === null || amount === undefined || Number.isNaN(Number(amount))) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(amount));
}

/**
 * Định dạng ngày theo chuẩn Việt Nam (dd/MM/yyyy).
 */
export function formatDate(date, options = {}) {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    ...options
  }).format(d);
}

/**
 * Cắt chuỗi và thêm dấu ba chấm nếu vượt quá độ dài cho phép.
 */
export function truncate(str, length = 80) {
  if (!str) return '';
  return str.length > length ? `${str.slice(0, length).trim()}…` : str;
}

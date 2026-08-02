import { useEffect, useState } from 'react';

/**
 * Trả về giá trị đã "trễ" (debounce) sau `delay` ms kể từ lần thay đổi cuối
 * cùng — dùng cho ô tìm kiếm để tránh gọi API liên tục khi người dùng gõ.
 */
export function useDebouncedValue(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

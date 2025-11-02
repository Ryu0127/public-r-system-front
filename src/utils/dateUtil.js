
export function getYearMonthDefaultNow($yearmonth) {
  return $yearmonth ?? new Date().toISOString().slice(0, 7);
}

export function getDateDefaultNow($date) {
  return $date ?? new Date().toISOString().slice(0, 10);
}

export function formatDateTime(dateTime, format) {
  return dateTime.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo', ...format });
}

export function toTimeString(date) {
  return date.toLocaleTimeString('ja-JP', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false
  });
}

/**
 * yyyy-mm形式の日付文字列をyyyymm形式に変換する
 * @param {string} yearMonth - yyyy-mm形式の日付文字列
 * @returns {string} yyyymm形式の日付文字列
 */
export function convertYearMonthToYYYYMM(yearMonth) {
  if (!yearMonth) return '';
  return yearMonth.replace(/-/g, '');
}
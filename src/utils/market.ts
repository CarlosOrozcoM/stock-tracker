/**
 * Checks if the US Stock Market is currently open.
 * US Market Hours: 9:30 AM - 4:00 PM Eastern Time, Monday through Friday.
 */
export function isMarketOpen(): { isOpen: boolean; reason?: string } {
  const now = new Date();
  
  // Convert to New York time
  const nyTime = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
    weekday: 'short',
  }).formatToParts(now);

  const getPart = (type: string) => nyTime.find(p => p.type === type)?.value;
  
  const weekday = getPart('weekday'); // e.g., "Mon"
  const hour = parseInt(getPart('hour') || '0', 10);
  const minute = parseInt(getPart('minute') || '0', 10);

  const isWeekend = weekday === 'Sat' || weekday === 'Sun';
  if (isWeekend) {
    return { isOpen: false, reason: 'Market is closed on weekends.' };
  }

  const timeInMinutes = hour * 60 + minute;
  const openTime = 9 * 60 + 30; // 9:30 AM
  const closeTime = 16 * 60;    // 4:00 PM

  if (timeInMinutes < openTime || timeInMinutes >= closeTime) {
    return { isOpen: false, reason: 'Market is closed (outside 9:30 AM - 4:00 PM ET).' };
  }

  return { isOpen: true };
}

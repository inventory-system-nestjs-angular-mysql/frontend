/**
 * Date utility for API payloads.
 * Sends only date (YYYY-MM-DD) to avoid ISO datetime issues with backend/database.
 */
export class DateUtil {
  /**
   * Converts a date to YYYY-MM-DD string for API. Returns null for empty/invalid.
   */
  static toDateOnlyString(
    date: Date | string | null | undefined
  ): string | null {
    if (date == null || (typeof date === 'string' && date.trim() === '')) {
      return null;
    }
    const d = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(d.getTime())) return null;
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }
}

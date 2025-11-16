import { DayOfMonth, RecurrenceFrequency } from '../types';

export function calculateNextDate(
  frequency: RecurrenceFrequency,
  dayOfMonth: DayOfMonth,
  fromDate: Date = new Date()
): Date {
  const nextDate = new Date(fromDate);

  // Move to next period
  switch (frequency) {
    case 'monthly':
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
    case 'quarterly':
      nextDate.setMonth(nextDate.getMonth() + 3);
      break;
    case 'yearly':
      nextDate.setFullYear(nextDate.getFullYear() + 1);
      break;
  }

  // Set the day of month
  if (dayOfMonth === 'last') {
    // Get last day of the month
    nextDate.setMonth(nextDate.getMonth() + 1, 0);
  } else if (dayOfMonth === 'first') {
    nextDate.setDate(1);
  } else {
    // Set specific day, but handle month overflow
    const maxDay = new Date(nextDate.getFullYear(), nextDate.getMonth() + 1, 0).getDate();
    nextDate.setDate(Math.min(dayOfMonth, maxDay));
  }

  return nextDate;
}

export function getNextGenerationDate(
  frequency: RecurrenceFrequency,
  dayOfMonth: DayOfMonth
): string {
  const nextDate = calculateNextDate(frequency, dayOfMonth);
  return nextDate.toISOString().split('T')[0];
}

export function shouldGenerateInvoice(
  nextGenerationDate: string,
  today: Date = new Date()
): boolean {
  const targetDate = new Date(nextGenerationDate);
  const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return targetDate <= todayDate;
}

export function formatDayOfMonth(dayOfMonth: DayOfMonth): string {
  if (dayOfMonth === 'last') return 'Last day';
  if (dayOfMonth === 'first') return '1st';
  if (dayOfMonth === 1) return '1st';
  if (dayOfMonth === 2) return '2nd';
  if (dayOfMonth === 3) return '3rd';
  return `${dayOfMonth}th`;
}

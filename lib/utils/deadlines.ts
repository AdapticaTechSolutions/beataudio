// Deadline calculation utilities
// Calculates payment deadlines based on event date

/**
 * Calculate payment deadlines for a booking
 * - 50% downpayment due 1 month before event
 * - Remaining balance due on event day
 */
export function calculateDeadlines(eventDate: Date | string): {
  downpaymentDeadline: Date;
  finalPaymentDeadline: Date;
} {
  const event = typeof eventDate === 'string' ? new Date(eventDate + 'T00:00:00') : new Date(eventDate);
  event.setHours(0, 0, 0, 0);

  // 50% downpayment due 1 month before event
  const downpaymentDeadline = new Date(event);
  downpaymentDeadline.setMonth(downpaymentDeadline.getMonth() - 1);
  downpaymentDeadline.setHours(0, 0, 0, 0);

  // Remaining balance due on event day
  const finalPaymentDeadline = new Date(event);
  finalPaymentDeadline.setHours(0, 0, 0, 0);

  return {
    downpaymentDeadline,
    finalPaymentDeadline,
  };
}

/**
 * Check if a deadline has passed
 */
export function isDeadlinePassed(deadline: Date): boolean {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return deadline < now;
}

/**
 * Get days until deadline
 */
export function getDaysUntilDeadline(deadline: Date): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const diff = deadline.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/**
 * Format deadline status
 */
export function formatDeadlineStatus(deadline: Date): {
  status: 'upcoming' | 'due-soon' | 'overdue';
  days: number;
  label: string;
} {
  const days = getDaysUntilDeadline(deadline);
  
  if (days < 0) {
    return {
      status: 'overdue',
      days: Math.abs(days),
      label: `${Math.abs(days)} day${Math.abs(days) !== 1 ? 's' : ''} overdue`,
    };
  } else if (days <= 7) {
    return {
      status: 'due-soon',
      days,
      label: `Due in ${days} day${days !== 1 ? 's' : ''}`,
    };
  } else {
    return {
      status: 'upcoming',
      days,
      label: `Due in ${days} day${days !== 1 ? 's' : ''}`,
    };
  }
}


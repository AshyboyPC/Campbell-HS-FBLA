// Event deadlines organized by month (0-11 for Jan-Dec)
export const EVENT_DEADLINES = [
  // January (0)
  [
    {
      id: 'jan-0',
      text: '📅 FBLA Chapter Meeting - January 7, 3:35 PM - 4:35 PM',
      date: '2026-01-07',
      type: 'event',
      isRecurring: '1st Wednesday'
    },
    {
      id: 'jan-1',
      text: '📝 Competition Bootcamp Registration Opens - January 2',
      date: '2026-01-02',
      type: 'training'
    },
    {
      id: 'jan-2',
      text: '📈 Spring Stock Market Game Registration - January 2',
      date: '2026-01-02',
      type: 'competition'
    },
    {
      id: 'jan-3',
      text: '📅 FBLA Chapter Meeting - January 15, 3:35 PM - 4:35 PM',
      date: '2026-01-15',
      type: 'event',
      isRecurring: '3rd Wednesday'
    }
  ],
  // February (1)
  [
    {
      id: 'feb-0',
      text: '📅 FBLA Chapter Meeting - February 4, 3:35 PM - 4:35 PM',
      date: '2026-02-04',
      type: 'event',
      isRecurring: '1st Wednesday'
    },
    {
      id: 'feb-1',
      text: '🏆 Spring Stock Market Game Begins - February 2',
      date: '2026-02-02',
      type: 'competition'
    },
    {
      id: 'feb-2',
      text: '🏛️ State Leadership Conference Registration - February 17',
      date: '2026-02-17',
      type: 'conference'
    },
    {
      id: 'feb-1a',
      text: '📅 FBLA Chapter Meeting - February 19, 3:35 PM - 4:35 PM',
      date: '2026-02-19',
      type: 'event',
      isRecurring: '3rd Wednesday'
    },
    {
      id: 'feb-3',
      text: '📅 Spring Stock Market Game Registration Deadline - February 20',
      date: '2026-02-20',
      type: 'deadline'
    }
  ],
  // March (2)
  [
    {
      id: 'mar-0',
      text: '📅 FBLA Chapter Meeting - March 4, 3:35 PM - 4:35 PM',
      date: '2026-03-04',
      type: 'event',
      isRecurring: '1st Wednesday'
    },
    {
      id: 'mar-1',
      text: '💰 National Dues Payment Deadline - March 1',
      date: '2026-03-01',
      type: 'deadline'
    },
    {
      id: 'mar-2',
      text: '🏨 Hotel Rooming List Deadline - March 3',
      date: '2026-03-03',
      type: 'deadline'
    },
    {
      id: 'mar-3',
      text: '📝 State Registration Closes - March 6',
      date: '2026-03-06',
      type: 'deadline'
    },
    {
      id: 'mar-1a',
      text: '📅 FBLA Chapter Meeting - March 19, 3:35 PM - 4:35 PM',
      date: '2026-03-19',
      type: 'event',
      isRecurring: '3rd Wednesday'
    },
    {
      id: 'mar-4',
      text: '🏆 Georgia State Leadership Conference - March 27-29',
      date: '2026-03-27',
      type: 'conference'
    }
  ],
  // April (3)
  [
    {
      id: 'apr-0',
      text: '📅 FBLA Chapter Meeting - April 1, 3:35 PM - 4:35 PM',
      date: '2026-04-01',
      type: 'event',
      isRecurring: '1st Wednesday'
    },
    {
      id: 'apr-1',
      text: '📜 National Bylaws Amendment Deadline - April 1',
      date: '2026-04-01',
      type: 'deadline'
    },
    {
      id: 'apr-2',
      text: '📊 Spring Stock Market Game Ends - April 10',
      date: '2026-04-10',
      type: 'competition'
    },
    {
      id: 'apr-3',
      text: '📅 FBLA Chapter Meeting - April 16, 3:35 PM - 4:35 PM',
      date: '2026-04-16',
      type: 'event',
      isRecurring: '3rd Wednesday'
    }
  ],
  // May (4)
  [
    {
      id: 'may-0',
      text: '📅 FBLA Chapter Meeting - May 6, 3:35 PM - 4:35 PM',
      date: '2026-05-06',
      type: 'event',
      isRecurring: '1st Wednesday'
    },
    {
      id: 'may-1',
      text: '🏆 Excellence Award Submission - May 1',
      date: '2026-05-01',
      type: 'deadline'
    },
    {
      id: 'may-2',
      text: '📅 FBLA Chapter Meeting - May 21, 3:35 PM - 4:35 PM',
      date: '2026-05-21',
      type: 'event',
      isRecurring: '3rd Wednesday'
    }
  ],
  // June (5)
  [
    {
      id: 'jun-1',
      text: '🎓 Collegiate NLC in Las Vegas - June 6-8',
      date: '2026-06-06',
      type: 'conference'
    }
  ],
  // July (6)
  [],
  // August (7) - Current Month
  [
    { 
      id: 'aug-1',
      text: '📋 Membership Registration Opens - August 1',
      date: '2025-08-01',
      type: 'membership',
      isOngoing: true
    },
    { 
      id: 'aug-2',
      text: '🎓 Dressed to Impress Scholarship Opens - August 1',
      date: '2025-08-01',
      type: 'scholarship',
      isOngoing: true
    },
    {
      id: 'aug-4',
      text: '📅 FBLA Chapter Meeting & Interest Meeting - August 27, 3:30 PM - 4:35 PM in Mrs. Anthony\'s Room',
      date: '2025-08-27',
      type: 'event',
      isRecurring: '3rd Wednesday'
    }
  ],
  // September (8)
  [
    {
      id: 'sep-1a',
      text: '📅 FBLA Chapter Meeting - September 3, 3:35 PM - 4:35 PM',
      date: '2025-09-03',
      type: 'event',
      isRecurring: '1st Wednesday'
    },
    { 
      id: 'sep-1',
      text: '📈 Fall Stock Market Game Registration - September 2',
      date: '2025-09-02',
      type: 'competition'
    },
    { 
      id: 'sep-1b',
      text: '💰 Club Dues Deadline - September 26',
      date: '2025-09-26',
      type: 'deadline',
      isImportant: true
    },
    {
      id: 'sep-motivational',
      text: '🎉 Fall Motivational Rally Registration - Due September 9',
      description: 'Field trip to GA National Fair in Perry, GA on October 9. Cost: $100',
      date: '2025-09-09',
      type: 'event',
      isImportant: true
    },
    { 
      id: 'sep-2',
      text: '👨‍🏫 Adviser Bootcamp Virtual - September 18',
      date: '2025-09-18',
      type: 'training'
    },
    {
      id: 'sep-3',
      text: '📅 FBLA Chapter Meeting - September 17, 3:35 PM - 4:35 PM',
      date: '2025-09-17',
      type: 'event',
      isRecurring: '3rd Wednesday'
    }
  ],
  // October (9)
  [
    {
      id: 'oct-0',
      text: '📅 FBLA Chapter Meeting - October 1, 3:35 PM - 4:35 PM',
      date: '2025-10-01',
      type: 'event',
      isRecurring: '1st Wednesday'
    },
    {
      id: 'oct-1',
      text: '📊 Fall Stock Market Game Begins - October 6',
      date: '2025-10-06',
      type: 'competition'
    },
    {
      id: 'oct-2',
      text: '🎓 Dressed to Impress Scholarship Deadline - October 15',
      date: '2025-10-15',
      type: 'deadline'
    },
    {
      id: 'oct-1a',
      text: '📅 FBLA Chapter Meeting - October 15, 3:35 PM - 4:35 PM',
      date: '2025-10-15',
      type: 'event',
      isRecurring: '3rd Wednesday'
    },
    {
      id: 'oct-3',
      text: '🏛️ Officer Leadership Summit - October 18',
      date: '2025-10-18',
      type: 'event'
    }
  ],
  // November (10)
  [
    {
      id: 'nov-0',
      text: '📅 FBLA Chapter Meeting - November 5, 3:35 PM - 4:35 PM',
      date: '2025-11-05',
      type: 'event',
      isRecurring: '1st Wednesday'
    },
    {
      id: 'nov-1',
      text: '🏆 Georgia Fall Leadership Conference - November 14-15',
      date: '2025-11-14',
      type: 'conference'
    },
    {
      id: 'nov-2',
      text: '🎓 Dressed to Impress Scholarship Final Deadline - November 15',
      date: '2025-11-15',
      type: 'deadline'
    },
    {
      id: 'nov-1a',
      text: '📅 FBLA Chapter Meeting - November 19, 3:35 PM - 4:35 PM',
      date: '2025-11-19',
      type: 'event',
      isRecurring: '3rd Wednesday'
    },
    {
      id: 'nov-3',
      text: '📉 Fall Stock Market Game Ends - November 30',
      date: '2025-11-30',
      type: 'competition'
    }
  ],
  // December (11)
  [
    {
      id: 'dec-1',
      text: '📅 FBLA Chapter Meeting - December 3, 3:35 PM - 4:35 PM',
      date: '2025-12-03',
      type: 'event',
      isRecurring: '1st Wednesday'
    },
    {
      id: 'dec-2',
      text: '📅 FBLA Chapter Meeting - December 17, 3:35 PM - 4:35 PM',
      date: '2025-12-17',
      type: 'event',
      isRecurring: '3rd Wednesday'
    }
  ]
];

// Get current month's deadlines (0-11)
export function getCurrentDeadlines() {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  // Get all events for current month
  const currentMonthEvents = EVENT_DEADLINES[currentMonth] || [];
  
  // For August 2025, show all events without date filtering
  if (currentMonth === 7 && currentYear === 2025) {
    return currentMonthEvents;
  }
  
  // For other months, use normal filtering
  return currentMonthEvents.filter(deadline => {
    if (deadline.isOngoing) return true;
    
    const eventDate = new Date(deadline.date);
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    return eventDate >= startOfToday && 
           eventDate.getMonth() === currentMonth && 
           eventDate.getFullYear() === currentYear;
  });
}

// Only show current month's deadlines
export function getUpcomingDeadlines() {
  return []; // We only want current month's events
}

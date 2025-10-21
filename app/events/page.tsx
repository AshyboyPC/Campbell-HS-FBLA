'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';

const eventsByMonth = [
  {
    month: 'AUGUST',
    events: [
      {
        date: 'August 1',
        title: 'Membership Registration Opens',
        description: 'Register for the 2025-2026 FBLA year',
        type: 'membership'
      },
      {
        date: 'August 1',
        title: 'Dressed to Impress Scholarship Application Opens',
        description: 'Apply for the Dressed to Impress scholarship',
        type: 'scholarship'
      },
      {
        date: 'August 27',
        title: 'FBLA Chapter Meeting',
        description: 'Monthly chapter meeting (3:35 PM - 4:35 PM)',
        type: 'event',
        recurring: '3rd Wednesday'
      }
    ]
  },
  {
    month: 'SEPTEMBER',
    events: [
      {
        date: 'September 3',
        title: 'FBLA Chapter Meeting',
        description: 'Monthly chapter meeting (3:35 PM - 4:35 PM)',
        type: 'event',
        recurring: '1st Wednesday'
      },
      {
        date: 'September 2',
        title: 'Fall Stock Market Game Registration Opens',
        description: 'Register for the Fall Stock Market Game',
        type: 'competition'
      },
      {
        date: 'September 26',
        title: 'Club Dues Deadline',
        description: 'Last day to pay club dues for the 2025-2026 school year',
        type: 'deadline'
      },
      {
        date: 'September 9',
        title: 'Fall Motivational Rally Registration Due',
        description: 'Field trip to GA National Fair in Perry, GA on October 9. Cost: $100 (Registration & Payment due)',
        type: 'event',
        isImportant: true
      },
      {
        date: 'September 17',
        title: 'FBLA Chapter Meeting',
        description: 'Monthly chapter meeting (3:35 PM - 4:35 PM)',
        type: 'event',
        recurring: '3rd Wednesday'
      },
      {
        date: 'September 18',
        title: 'Adviser Bootcamp Virtual',
        description: 'Virtual training for FBLA advisers',
        type: 'training'
      }
    ]
  },
  {
    month: 'OCTOBER',
    events: [
      {
        date: 'October 1',
        title: 'FBLA Chapter Meeting',
        description: 'Monthly chapter meeting (3:35 PM - 4:35 PM)',
        type: 'event',
        recurring: '1st Wednesday'
      },
      {
        date: 'October 6',
        title: 'Fall Stock Market Game Begins',
        description: 'Fall Stock Market Game competition period starts',
        type: 'competition'
      },
      {
        date: 'October 15',
        title: 'FBLA Chapter Meeting',
        description: 'Monthly chapter meeting (3:35 PM - 4:35 PM)',
        type: 'event',
        recurring: '3rd Wednesday'
      },
      {
        date: 'October 15',
        title: 'ACTE Outstanding Business Education Student Award Application Deadline',
        description: 'Deadline for ACTE award applications',
        type: 'deadline'
      },
      {
        date: 'October 15',
        title: 'Dressed to Impress Scholarship Application Deadline',
        description: 'First deadline for Dressed to Impress scholarship',
        type: 'deadline'
      },
      {
        date: 'October 18',
        title: 'Officer Leadership Summit',
        description: 'Hosted by National Officers',
        type: 'event'
      },
      {
        date: 'October 27',
        title: 'Fall Stock Market Game Registration Deadline',
        description: 'Last day to register for Fall Stock Market Game',
        type: 'deadline'
      }
    ]
  },
  {
    month: 'NOVEMBER',
    events: [
      {
        date: 'November 5',
        title: 'FBLA Chapter Meeting',
        description: 'Monthly chapter meeting (3:35 PM - 4:35 PM)',
        type: 'event',
        recurring: '1st Wednesday'
      },
      {
        date: 'November 14-15',
        title: 'Georgia Fall Leadership Conference',
        description: 'Annual leadership conference for all FBLA members',
        type: 'conference'
      },
      {
        date: 'November 19',
        title: 'FBLA Chapter Meeting',
        description: 'Monthly chapter meeting (3:35 PM - 4:35 PM)',
        type: 'event',
        recurring: '3rd Wednesday'
      },
      {
        date: 'November 15',
        title: 'American Enterprise Day',
        description: 'Celebrating free enterprise',
        type: 'event'
      },
      {
        date: 'November 15',
        title: 'Dressed to Impress Scholarship Application Deadline',
        description: 'Second deadline for Dressed to Impress scholarship',
        type: 'deadline'
      }
    ]
  },
  {
    month: 'DECEMBER',
    events: [
      {
        date: 'December 3',
        title: 'FBLA Chapter Meeting',
        description: 'Monthly chapter meeting (3:35 PM - 4:35 PM)',
        type: 'event',
        recurring: '1st Wednesday'
      },
      {
        date: 'December 12',
        title: 'Fall Stock Market Game Ends',
        description: 'Fall Stock Market Game competition period ends',
        type: 'competition'
      },
      {
        date: 'December 17',
        title: 'FBLA Chapter Meeting',
        description: 'Monthly chapter meeting (3:35 PM - 4:35 PM)',
        type: 'event',
        recurring: '3rd Wednesday'
      }
    ]
  },
  {
    month: 'JANUARY',
    events: [
      {
        date: 'January 7',
        title: 'FBLA Chapter Meeting',
        description: 'Monthly chapter meeting (3:35 PM - 4:35 PM)',
        type: 'event',
        recurring: '1st Wednesday'
      },
      {
        date: 'January 2',
        title: 'Spring Stock Market Game Registration Opens',
        description: 'Register for the Spring Stock Market Game',
        type: 'competition'
      },
      {
        date: 'January 15',
        title: 'FBLA Chapter Meeting',
        description: 'Monthly chapter meeting (3:35 PM - 4:35 PM)',
        type: 'event',
        recurring: '3rd Wednesday'
      },
      {
        date: 'January 2',
        title: 'Competition Bootcamp Registration Opens',
        description: 'Register for Competition Bootcamp',
        type: 'training'
      },
      {
        date: 'January 17-18',
        title: 'Region Leadership Conference',
        description: 'Regional conference for FBLA members (Location TBD)',
        type: 'conference'
      }
    ]
  },
  {
    month: 'FEBRUARY',
    events: [
      {
        date: 'February 4',
        title: 'FBLA Chapter Meeting',
        description: 'Monthly chapter meeting (3:35 PM - 4:35 PM)',
        type: 'event',
        recurring: '1st Wednesday'
      },
      {
        date: 'February 27 - March 1',
        title: 'State Leadership Conference',
        description: 'Annual state conference in Atlanta, GA',
        type: 'conference'
      },
      {
        date: 'February 19',
        title: 'FBLA Chapter Meeting',
        description: 'Monthly chapter meeting (3:35 PM - 4:35 PM)',
        type: 'event',
        recurring: '3rd Wednesday'
      },
      {
        date: 'February 1-28',
        title: 'National Career and Technical Education Month',
        description: 'Celebrating CTE programs nationwide',
        type: 'event'
      },
      {
        date: 'February 2',
        title: 'Spring Stock Market Game Begins',
        description: 'Spring Stock Market Game competition period starts',
        type: 'competition'
      },
      {
        date: 'February 12',
        title: 'Competition Bootcamp at CGTC-Warner Robins',
        description: 'In-person bootcamp for competition preparation',
        type: 'training'
      },
      {
        date: 'February 8-14',
        title: 'FBLA Week',
        description: 'Celebrating Future Business Leaders of America',
        type: 'event'
      },
      {
        date: 'February 17',
        title: 'Georgia State Leadership Conference Registration Opens',
        description: 'Register for the State Leadership Conference',
        type: 'conference'
      },
      {
        date: 'February 20',
        title: 'Spring Stock Market Game Registration Deadline',
        description: 'Last day to register for Spring Stock Market Game',
        type: 'deadline'
      },
      {
        date: 'February 21',
        title: 'Officer Leadership Summit',
        description: 'Hosted by National Officers',
        type: 'event'
      }
    ]
  },
  {
    month: 'MARCH',
    events: [
      {
        date: 'March 4',
        title: 'FBLA Chapter Meeting',
        description: 'Monthly chapter meeting (3:35 PM - 4:35 PM)',
        type: 'event',
        recurring: '1st Wednesday'
      },
      {
        date: 'March 1',
        title: 'National Dues Payment Deadline',
        description: 'For NLC Competitors, National Officer Candidates, and Voting Delegates',
        type: 'deadline'
      },
      {
        date: 'March 19',
        title: 'FBLA Chapter Meeting',
        description: 'Monthly chapter meeting (3:35 PM - 4:35 PM)',
        type: 'event',
        recurring: '3rd Wednesday'
      },
      {
        date: 'March 3',
        title: 'Hotel Rooming List Deadline',
        description: 'For State Leadership Conference',
        type: 'deadline'
      },
      {
        date: 'March 6',
        title: 'State Registration Closes',
        description: 'Includes: State Officer Candidate packets, Production tests, Foundation Scholarship',
        type: 'deadline'
      },
      {
        date: 'March 8',
        title: 'Spring Stock Market Game Registration Deadline',
        description: 'Final deadline for Spring Stock Market Game',
        type: 'deadline'
      },
      {
        date: 'March 20',
        title: 'NLC Scholarship Application Deadline',
        description: 'Deadline for National Leadership Conference scholarships',
        type: 'deadline'
      },
      {
        date: 'March 20',
        title: 'Distinguished Business Leader Scholarship Application Deadline',
        description: 'Deadline for DBL scholarship applications',
        type: 'deadline'
      },
      {
        date: 'March 27-29',
        title: 'Georgia State Leadership Conference',
        description: 'Annual state conference and competition',
        type: 'conference'
      }
    ]
  },
  {
    month: 'APRIL',
    events: [
      {
        date: 'April 1',
        title: 'FBLA Chapter Meeting',
        description: 'Monthly chapter meeting (3:35 PM - 4:35 PM)',
        type: 'event',
        recurring: '1st Wednesday'
      },
      {
        date: 'April 1',
        title: 'National Bylaws Amendment Proposal Submission Deadline',
        description: 'Deadline for bylaw amendment proposals',
        type: 'deadline'
      },
      {
        date: 'April 16',
        title: 'FBLA Chapter Meeting',
        description: 'Monthly chapter meeting (3:35 PM - 4:35 PM)',
        type: 'event',
        recurring: '3rd Wednesday'
      },
      {
        date: 'April 10',
        title: 'Spring Stock Market Game Ends',
        description: 'Spring Stock Market Game competition period ends',
        type: 'competition'
      },
      {
        date: 'April 11',
        title: 'National Officer Candidate Application Submission Deadline',
        description: 'Deadline for National Officer applications',
        type: 'deadline'
      }
    ]
  },
  {
    month: 'MAY',
    events: [
      {
        date: 'May 6',
        title: 'FBLA Chapter Meeting',
        description: 'Monthly chapter meeting (3:35 PM - 4:35 PM)',
        type: 'event',
        recurring: '1st Wednesday'
      },
      {
        date: 'May 1',
        title: 'Excellence Award Submission Deadline',
        description: 'For NLC Recognition',
        type: 'deadline'
      },
      {
        date: 'May 21',
        title: 'FBLA Chapter Meeting',
        description: 'Monthly chapter meeting (3:35 PM - 4:35 PM)',
        type: 'event',
        recurring: '3rd Wednesday'
      },
      {
        date: 'May 1',
        title: 'Outstanding Chapter Award Submission Deadline',
        description: 'For NLC Recognition',
        type: 'deadline'
      }
    ]
  },
  {
    month: 'JUNE',
    events: [
      {
        date: 'June 6-8',
        title: 'Collegiate NLC in Las Vegas, NV',
        description: 'Collegiate National Leadership Conference',
        type: 'conference'
      },
      {
        date: 'June 23-26',
        title: 'National Leadership Conference',
        description: 'FBLA National Leadership Conference in San Antonio, TX',
        type: 'conference'
      }
    ]
  }
];

const eventTypeColors = {
  competition: 'bg-blue-100 text-blue-800',
  conference: 'bg-purple-100 text-purple-800',
  deadline: 'bg-red-100 text-red-800',
  training: 'bg-green-100 text-green-800',
  scholarship: 'bg-yellow-100 text-yellow-800',
  membership: 'bg-indigo-100 text-indigo-800',
  event: 'bg-pink-100 text-pink-800'
};

const eventTypeIcons = {
  competition: 'mdi:trophy',
  conference: 'mdi:account-group',
  deadline: 'mdi:calendar-clock',
  training: 'mdi:school',
  scholarship: 'mdi:certificate',
  membership: 'mdi:account-plus',
  event: 'mdi:calendar-star'
};

export default function EventsPage() {
  const [activeMonth, setActiveMonth] = useState(eventsByMonth[0].month);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const eventTypes = Array.from(
    new Set(
      eventsByMonth.flatMap(month => 
        month.events.map(event => event.type)
      )
    )
  ) as string[];

  const filteredMonths = eventsByMonth.map(month => ({
    ...month,
    events: month.events.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(event.type);
      return matchesSearch && matchesType;
    })
  })).filter(month => month.events.length > 0);

  const toggleEventType = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type) 
        : [...prev, type]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#002D72] to-[#0056b3] text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4">2025-2026 Events Calendar</h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Stay updated with all FBLA events, competitions, and important deadlines
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <motion.div 
        className="bg-white shadow-sm sticky top-0 z-10 border-b"
        initial={{ opacity: 1, y: 0 }}
        animate={{ 
          opacity: isScrolled ? 0 : 1,
          y: isScrolled ? -20 : 0,
          pointerEvents: isScrolled ? 'none' : 'auto'
        }}
        transition={{ duration: 0.2 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-2xl">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon icon="mdi:magnify" className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search events..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {eventTypes.map(type => (
                <button
                  key={type}
                  onClick={() => toggleEventType(type)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedTypes.includes(type)
                      ? `${eventTypeColors[type as keyof typeof eventTypeColors]} ring-2 ring-offset-1 ring-blue-500`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon 
                      icon={eventTypeIcons[type as keyof typeof eventTypeIcons]} 
                      className="h-4 w-4" 
                    />
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Timeline Navigation */}
      <motion.div 
        className="bg-white shadow-sm border-b sticky top-[60px] z-10"
        initial={{ opacity: 1, y: 0 }}
        animate={{ 
          opacity: isScrolled ? 0 : 1,
          y: isScrolled ? -20 : 0,
          pointerEvents: isScrolled ? 'none' : 'auto'
        }}
        transition={{ duration: 0.2 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex space-x-2 py-2 overflow-x-auto pb-3">
            <div className="flex space-x-2 min-w-max">
            {eventsByMonth.map(({ month }) => (
              <button
                key={month}
                onClick={() => {
                  const element = document.getElementById(month);
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    setActiveMonth(month);
                  }
                }}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                  activeMonth === month
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {month}
              </button>
            ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Events Timeline */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-12">
        {filteredMonths.length > 0 ? (
          <div className="space-y-16">
            {filteredMonths.map(({ month, events }) => (
              <section key={month} id={month} className="scroll-mt-24">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '0px 0px -100px 0px' }}
                  className="mb-12"
                >
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 flex items-center">
                    <span className="w-1.5 h-8 bg-blue-600 rounded-full mr-3"></span>
                    {month}
                  </h2>
                  
                  <div className="space-y-5">
                    {events.map((event, index) => (
                      <motion.div
                        key={`${month}-${index}`}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.03 }}
                        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200"
                      >
                        <div className="p-5 sm:p-6">
                          <div className="flex flex-col sm:flex-row sm:items-start gap-5">
                            <div className="flex-shrink-0 w-24">
                              <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                eventTypeColors[event.type as keyof typeof eventTypeColors]
                              }`}>
                                <Icon 
                                  icon={eventTypeIcons[event.type as keyof typeof eventTypeIcons]} 
                                  className="h-4 w-4 mr-1" 
                                />
                                {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                              </div>
                              <div className="mt-2 text-lg font-semibold text-gray-900">
                                {event.date}
                              </div>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-gray-900 mb-1">
                                {event.title}
                              </h3>
                              <p className="text-gray-600">
                                {event.description}
                              </p>
                              {event.description.includes(' in ') && (
                                <div className="mt-2 flex items-center text-sm text-gray-500">
                                  <Icon icon="mdi:map-marker" className="h-4 w-4 mr-1" />
                                  {event.description.split(' in ').pop()}
                                </div>
                              )}
                            </div>
                            <div className="flex-shrink-0">
                              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                Details
                                <Icon icon="mdi:chevron-right" className="ml-1 h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </section>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Icon icon="mdi:calendar-remove" className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No events found</h3>
            <p className="mt-1 text-gray-500">Try adjusting your search or filter criteria.</p>
            <div className="mt-6">
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedTypes([]);
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Icon icon="mdi:filter-remove" className="mr-2 h-4 w-4" />
                Clear all filters
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Back to top button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: window.scrollY > 300 ? 1 : 0,
          y: window.scrollY > 300 ? 0 : 20
        }}
        transition={{ duration: 0.3 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 bg-white p-3 rounded-full shadow-lg text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 z-20"
        aria-label="Back to top"
      >
        <Icon icon="mdi:arrow-up" className="h-6 w-6" />
      </motion.button>
    </div>
  );
}
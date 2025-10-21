'use client';

import { motion } from 'framer-motion';
import { ShinyButton } from '@/components/ui/shiny-button';
import { useAuth } from '@/app/contexts/AuthContext';
import { useRouter } from 'next/navigation';

const pointCategories = [
  {
    title: 'Membership & Participation',
    points: [
      { amount: '50', description: 'Join & Pay Dues (by Oct. 1st)' },
      { amount: '5', description: 'Attend Chapter Meeting' },
      { amount: '3', description: 'Attend FBLA Social Event' },
      { amount: '3', description: 'Attend FBLA Workshop' },
      { amount: '3', description: 'Attend Competitive Event Study Session' },
    ]
  },
  {
    title: 'BAA Program',
    points: [
      { amount: '5', description: 'BAA Contributor Level' },
      { amount: '8', description: 'BAA Leader Level' },
      { amount: '10', description: 'BAA Advocate Level' },
      { amount: '15', description: 'BAA Capstone Level' },
    ]
  },
  {
    title: 'Conferences & Competitions',
    points: [
      { amount: '10', description: 'Attend Callis Foundation Workshop/Event (2pts/hr)' },
      { amount: '10', description: 'Attend Motivational Rally, RLC, or SLOTS' },
      { amount: '10', description: 'Attend FLC or State Leadership Conference' },
      { amount: '15', description: 'Compete at FLC, RLC, SLC, or NLC' },
      { amount: '3', description: 'Top 10 at RLC' },
      { amount: '5', description: 'Advance to SLC' },
      { amount: '8', description: 'Top 10 at SLC' },
      { amount: '10', description: 'Advance to NLC' },
      { amount: '15', description: 'Top 10 at NLC' },
      { amount: '20', description: 'Attend National Leadership Conference' },
    ]
  },
  {
    title: 'Service & Leadership',
    points: [
      { amount: '10', description: 'Participate in School/Community Service Project/Fundraiser (max)' },
      { amount: '3', description: 'Recruitment Referrals' },
      { amount: '2', description: 'Submit Officer Application' },
      { amount: '3', description: 'Other duties as assigned by Advisers' },
    ]
  }
];

const graduationRequirements = [
  { year: 'Class of 2026', points: 125 },
  { year: 'Class of 2027', points: 250 },
  { year: 'Class of 2028', points: 375 },
  { year: 'Class of 2029+', points: 500 },
];

export default function PointsSection() {
  const { isAuthenticated, signIn, loading } = useAuth();
  const router = useRouter();

  const handleTrackPoints = () => {
    if (isAuthenticated) {
      router.push('/points/dashboard');
    } else {
      router.push('/login');
    }
  };

  return (
    <section id="point-system" className="mx-auto max-w-6xl px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#00205B] mb-2">FBLA Points System</h2>
          <p className="text-lg text-[#003DA5]">
            <span className="font-subtitle">2025 - 2026</span> Academic Year
          </p>
        </div>

        {/* Graduation Cord Info */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-[#003DA5]/15 p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-[#00205B] mb-4">Graduation Cord Criteria</h3>
          <p className="text-[#00205B] mb-6">
            Members are responsible for tracking their own FBLA points. To receive a graduation cord, FBLA members must earn the required points based on their graduation year. All point sheets must be submitted to Mrs. Anthony or Coach Simes by the last day of school for review.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {/* Points Categories */}
            <div>
              <h4 className="font-medium text-[#00205B] mb-4 border-b pb-2">Points Needed by Graduation Year</h4>
              <div className="space-y-3">
                {graduationRequirements.map((item, index) => {
                  const [prefix, year] = item.year.split(' ');
                  return (
                    <div key={index} className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="font-medium">
                        {prefix} <span className="font-subtitle">{year}</span>
                      </span>
                      <span className="bg-[#003DA5] text-white px-3 py-1 rounded-full text-sm font-medium">
                        {item.points} points
                      </span>
                    </div>
                  );
                })}
              </div>
              <p className="text-sm text-gray-600 mt-4">
                * Points must be earned by May 1st of each school year
              </p>
            </div>

            {/* Quick Info */}
            <div className="bg-blue-50 p-6 rounded-xl">
              <h4 className="font-medium text-[#00205B] mb-4">Important Notes</h4>
              <ul className="space-y-3 text-sm text-[#00205B]">
                <li className="flex items-start">
                  <span className="text-[#003DA5] mr-2">•</span>
                  <span>Minimum 125 points required per year</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#003DA5] mr-2">•</span>
                  <span>Points accumulate each year toward your total</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#003DA5] mr-2">•</span>
                  <span>Document all activities with dates and details</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#003DA5] mr-2">•</span>
                  <span>Submit verification for all claimed points</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Points Categories */}
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold text-[#00205B] mt-12 mb-6">Earn Points Through</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pointCategories.map((category, index) => (
              <div key={index} className="bg-white/70 backdrop-blur-md rounded-2xl border border-[#003DA5]/15 p-6 shadow-sm">
                <h4 className="text-lg font-semibold text-[#00205B] mb-4 pb-2 border-b">{category.title}</h4>
                <div className="space-y-3">
                  {category.points.map((point, idx) => (
                    <div key={idx} className="flex items-start">
                      <span className="bg-[#003DA5] text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1 mr-3">
                        {point.amount}
                      </span>
                      <span className="text-[#00205B]">{point.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <button onClick={handleTrackPoints} disabled={loading}>
              <ShinyButton>
                {loading ? 'Loading...' : 'Track Your Points'}
              </ShinyButton>
            </button>
          </div>
        </div>

      </motion.div>
    </section>
  );
}
'use client';

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import GlassmorphismProfileCard from "@/components/ui/glassmorphism-profile-card";
import MemberModal from "@/components/ui/MemberModal";
import { Member, loadMembers } from "@/lib/parseMembers";

const leaders = [
  // Executive Team
  { 
    name: "Sawani DeSilva", 
    role: "Chapter President", 
    img: "https://i.pravatar.cc/600?u=fbla-president-sawani",
    email: "sawani.d@example.com",
    status: "Active",
    glowText: "Chapter President",
    description: "Sawani leads our FBLA chapter with vision and dedication, overseeing all chapter activities and representing our school at regional and state levels.",
    achievements: [
      "Led chapter to record membership growth",
      "Established new community partnerships",
      "Enhanced chapter communication systems"
    ]
  },
  { 
    name: "Ashwindh Ramesh", 
    role: "Chapter Vice President", 
    img: "https://i.pravatar.cc/600?u=fbla-vp-ashwindh",
    email: "ashwindh.r@example.com",
    status: "Active",
    glowText: "VP of Operations",
    description: "Ashwindh supports the president in chapter operations and leads key initiatives to engage members and strengthen our chapter's impact.",
    achievements: [
      "Developed new member engagement program",
      "Coordinated successful chapter events",
      "Improved operational efficiency"
    ]
  },
  { 
    name: "Ash Allen", 
    role: "Chapter Secretary", 
    img: "https://i.pravatar.cc/600?u=fbla-secretary-ash",
    email: "ash.a@example.com",
    status: "Active",
    glowText: "Head Secretary",
    description: "Ash maintains organized records and ensures smooth communication within the chapter, keeping everyone informed and connected.",
    achievements: [
      "Implemented new documentation system",
      "Improved meeting efficiency",
      "Enhanced member communication"
    ]
  },
  { 
    name: "Harshad Premkumar", 
    role: "Chapter Treasurer", 
    img: "https://i.pravatar.cc/600?u=fbla-treasurer-harshad",
    email: "harshad.p@example.com",
    status: "Active",
    glowText: "Finance Lead",
    description: "Harshad manages the chapter's finances with precision, ensuring responsible budgeting and financial planning for all activities.",
    achievements: [
      "Optimized budget allocation",
      "Secured new funding sources",
      "Improved financial transparency"
    ]
  },

  // Officer Team
  { 
    name: "M. Xavier Thomas", 
    role: "Historian", 
    img: "https://i.pravatar.cc/600?u=fbla-historian-xavier",
    email: "xavier.t@example.com",
    status: "Active",
    glowText: "Chapter Historian",
    description: "Xavier documents our chapter's journey, capturing memorable moments and maintaining our historical records.",
    achievements: [
      "Created chapter photo archive",
      "Developed digital yearbook",
      "Enhanced social media presence"
    ]
  },
  { 
    name: "Alonzo Ford", 
    role: "Parliamentarian", 
    img: "https://i.pravatar.cc/600?u=fbla-parliamentarian-alonzo",
    email: "alonzo.f@example.com",
    status: "Active",
    glowText: "Rules Expert",
    description: "Alonzo ensures all chapter proceedings follow proper parliamentary procedure and FBLA guidelines.",
    achievements: [
      "Trained officers in Robert's Rules",
      "Streamlined meeting procedures",
      "Ensured compliance with FBLA bylaws"
    ]
  },
  { 
    name: "Mei Kumaran", 
    role: "VP of Public Relations", 
    img: "https://i.pravatar.cc/600?u=fbla-pr-mei",
    email: "mei.k@example.com",
    status: "Active",
    glowText: "PR Co-Director",
    description: "Mei helps shape our chapter's public image and communications, working to increase our visibility in the community.",
    achievements: [
      "Increased social media engagement",
      "Developed PR campaigns",
      "Strengthened school partnerships"
    ]
  },
  { 
    name: "Grace Yan", 
    role: "VP of Public Relations", 
    img: "https://i.pravatar.cc/600?u=fbla-pr-grace",
    email: "grace.y@example.com",
    status: "Active",
    glowText: "PR Co-Director",
    description: "Grace works alongside Mei to manage our chapter's communications and public relations efforts.",
    achievements: [
      "Created newsletter system",
      "Managed press releases",
      "Coordinated media coverage"
    ]
  },
  { 
    name: "Veera Sharma", 
    role: "VP of Competitions/Fundraising", 
    img: "https://i.pravatar.cc/600?u=fbla-competitions-veera",
    email: "veera.s@example.com",
    status: "Active",
    glowText: "Competitions Lead",
    description: "Veera coordinates our chapter's competition participation and leads fundraising initiatives to support our activities.",
    achievements: [
      "Increased competition participation",
      "Developed new fundraising strategies",
      "Organized training workshops"
    ]
  },
  { 
    name: "Leia Sanders", 
    role: "Activities Director", 
    img: "https://i.pravatar.cc/600?u=fbla-activities-leia",
    email: "leia.s@example.com",
    status: "Active",
    glowText: "Events Coordinator",
    description: "Leia plans and coordinates chapter activities, ensuring engaging and well-organized events for all members.",
    achievements: [
      "Expanded event offerings",
      "Improved event attendance",
      "Enhanced member engagement"
    ]
  },
  { 
    name: "Corina Vacarasu", 
    role: "Community Service Chair", 
    img: "https://i.pravatar.cc/600?u=fbla-service-corina",
    email: "corina.v@example.com",
    status: "Active",
    glowText: "Service Leader",
    description: "Corina leads our community service initiatives, organizing impactful projects that benefit our local community.",
    achievements: [
      "Increased volunteer hours",
      "Established new service partnerships",
      "Organized successful service projects"
    ]
  },
  { 
    name: "Maddox Lewis", 
    role: "Social Events Chair", 
    img: "https://i.pravatar.cc/600?u=fbla-social-maddox",
    email: "maddox.l@example.com",
    status: "Active",
    glowText: "Social Director",
    description: "Maddox organizes social events that build camaraderie and school spirit among FBLA members.",
    achievements: [
      "Increased event attendance",
      "Created new social traditions",
      "Enhanced member connections"
    ]
  },
];

const advisors = [
  { 
    name: "Mrs. Anthony", 
    role: "Lead Advisor",
    initials: "MA"
  },
  { 
    name: "Coach Sims", 
    role: "Co-Advisor",
    initials: "CS"
  },
  { 
    name: "Ms. Flemming", 
    role: "Co-Advisor",
    initials: "MF"
  }
];

// Animation variants
import type { Variants } from 'framer-motion';

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring" as const,
      damping: 10,
      stiffness: 100
    }
  },
  hover: {
    y: -5,
    boxShadow: "0 10px 25px -5px rgba(0, 45, 158, 0.1), 0 10px 10px -5px rgba(0, 45, 158, 0.04)",
    transition: { duration: 0.2 }
  }
};

export default function AboutPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const membersData = await loadMembers();
        setMembers(membersData);
      } catch (error) {
        console.error('Error loading members:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const handleMemberClick = (member: Member) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl text-[#00205B]">About Us</motion.h1>
      <div className="mt-6 grid md:grid-cols-2 gap-8">
        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-xl bg-[#F5F5F5] p-6 border border-[#003DA5]/15">
          <h2 className="text-xl text-[#00205B]">Chapter History</h2>
          <p className="mt-2 text-sm text-[#00205B]/80">Campbell High School FBLA has a proud tradition of excellence, fostering future-ready skills and earning recognition at regional, state, and national levels. After a period of inactivity, we successfully rebooted the club in the 2024-2025 school year. The 2025-2026 school year marks our second year since the reboot, and we're excited to continue building on our strong foundation. Our members collaborate with local partners, host events, and develop leadership through service.</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-xl bg-[#F5F5F5] p-6 border border-[#003DA5]/15">
          <h2 className="text-xl text-[#00205B]">Mission & Vision</h2>
          <p className="mt-2 text-sm text-[#00205B]/80">FBLA inspires and prepares students to become community-minded business leaders in a global society through relevant career preparation and leadership experiences.</p>
        </motion.div>
      </div>

      <section className="mt-16 mb-20">
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl md:text-3xl font-bold text-[#00205B] mb-10 text-center"
        >
          Meet Our <span className="text-yellow-500">Leadership</span>
        </motion.h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-8 px-4">
          {leaders.map((leader, index) => (
            <GlassmorphismProfileCard
              key={leader.name}
              name={leader.name}
              role={leader.role}
              initials={`${leader.name.split(' ').map(n => n[0]).join('')}`}
              className="hover:scale-105 transition-transform"
              statusColor={index % 2 === 0 ? 'bg-blue-500' : 'bg-yellow-400'}
              glowText={leader.role}
              description={leader.description}
              achievements={leader.achievements}
            />
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl text-[#00205B] mb-3">Achievements & Awards</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[
            "Multiple State qualifiers",
            "National Finalists in Entrepreneurship",
            "Top Fundraising Chapter",
            "Outstanding Chapter Recognition",
            "Community Service Excellence",
            "Leadership Development Honors",
          ].map((t) => (
            <div key={t} className="rounded-xl bg-[#003DA5]/5 border border-[#003DA5]/20 p-4 text-sm text-[#00205B]">{t}</div>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl md:text-3xl font-bold text-[#00205B] mb-10 text-center"
        >
          Our <span className="text-yellow-500">Committees</span>
        </motion.h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* Community Service Committee */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl p-6 shadow-md border border-[#003DA5]/10 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-lg font-semibold text-[#00205B] mb-2">Community Service Committee</h3>
            <p className="text-sm text-[#00205B]/80 mb-3">Led by Corina Vacarasu</p>
            <p className="text-sm text-[#00205B]/80">Members plan and participate in service projects, volunteer opportunities, and outreach activities that give back to the school and local community.</p>
          </motion.div>

          {/* Fundraising Committee */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="bg-white rounded-xl p-6 shadow-md border border-[#003DA5]/10 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-lg font-semibold text-[#00205B] mb-2">Fundraising Committee</h3>
            <p className="text-sm text-[#00205B]/80 mb-3">Led by Harshad Premkumar & Veera Sharma</p>
            <p className="text-sm text-[#00205B]/80">Members create and run fundraising events to support chapter activities, conferences, and community projects, while learning real-world business skills.</p>
          </motion.div>

          {/* Social Events Committee */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-200px" }}
            className="bg-white rounded-xl p-6 shadow-md border border-[#003DA5]/10 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-lg font-semibold text-[#00205B] mb-2">Social Events Committee</h3>
            <p className="text-sm text-[#00205B]/80 mb-3">Led by Maddox Lewis</p>
            <p className="text-sm text-[#00205B]/80">This team organizes fun chapter activities, celebrations, and bonding events to build connections and strengthen chapter spirit.</p>
          </motion.div>
        </div>
      </section>

      {/* Members Section */}
      <section className="mt-16 mb-20">
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl md:text-3xl font-bold text-[#00205B] mb-10 text-center"
        >
          Our <span className="text-yellow-500">Members</span>
        </motion.h2>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00205B]"></div>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4 px-4"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {members.map((member, index) => (
              <motion.div
                key={`${member.firstName}-${member.lastName}-${index}`}
                className="flex flex-col items-center cursor-pointer group"
                variants={item}
                whileHover="hover"
                onClick={() => handleMemberClick(member)}
              >
                <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-[#00205B] to-[#003DA5] flex items-center justify-center text-white text-xl font-bold mb-2 group-hover:scale-110 transition-transform">
                  {member.firstName[0]}{member.lastName[0]}
                </div>
                <span className="text-sm font-medium text-center text-[#00205B] group-hover:text-[#003DA5] transition-colors">
                  {member.firstName}
                </span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* Advisors Section */}
      <section className="mt-20 bg-gradient-to-r from-[#00205B] to-[#003DA5] rounded-2xl p-8 text-white">
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl md:text-3xl font-bold text-white mb-8 text-center"
        >
          Our <span className="text-yellow-400">Advisors</span>
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {advisors.map((advisor, index) => (
            <motion.div
              key={advisor.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/20 transition-colors"
            >
              <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-4xl font-bold text-white border-4 border-white/20 mb-4">
                {advisor.initials}
              </div>
              <h3 className="text-xl font-semibold">{advisor.name}</h3>
              <p className="text-yellow-300">{advisor.role}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Member Modal */}
      <MemberModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        member={selectedMember}
      />

      {/* Achievements & Awards Section */}
      <section className="mt-20">
        <motion.h2 
          initial={{ opacity: 0, y: 10 }} 
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl font-bold text-[#00205B] mb-8 text-center"
        >
          Achievements & Awards
        </motion.h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[
            "Multiple State qualifiers",
            "National Finalists in Entrepreneurship",
            "Top Fundraising Chapter",
            "Outstanding Chapter Recognition",
            "Community Service Excellence",
            "Leadership Development Honors",
          ].map((t) => (
            <motion.div 
              key={t} 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
              className="rounded-xl bg-[#003DA5]/5 border border-[#003DA5]/20 p-4 text-sm text-[#00205B]"
            >
              {t}
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
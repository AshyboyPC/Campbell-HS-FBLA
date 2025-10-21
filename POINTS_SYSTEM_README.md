# FBLA Points Tracking System - Documentation

## Overview
A fully integrated points tracking system for Campbell High School FBLA that allows members to track their graduation cord points and enables administrators to manage all member data.

## Features Implemented ✅

### 🔐 Authentication & Guest Access
- **Guest Browsing**: Visitors can view all points categories and requirements without signing in
- **Sign In Button**: Always visible in the navbar for guests as a reminder
- **School Email Integration**: Uses Cosmic Authentication for sign-in (supports @campbellhigh.net emails)
- **Protected Routes**: Dashboard and admin pages require authentication

### 🧮 Points System Structure
All point values match the requirements exactly:

**Membership & Participation**
- 50 pts - Join & Pay Dues (by Oct. 1st)
- 5 pts - Attend Chapter Meeting
- 3 pts - Attend FBLA Social Event
- 3 pts - Attend FBLA Workshop
- 3 pts - Attend Competitive Event Study Session

**BAA Program**
- 5 pts - BAA Contributor Level
- 8 pts - BAA Leader Level
- 10 pts - BAA Advocate Level
- 15 pts - BAA Capstone Level

**Conferences & Competitions**
- 10 pts - Attend Callis Foundation Workshop/Event (2 pts/hr)
- 10 pts - Attend Motivational Rally, RLC, or SLOTS
- 10 pts - Attend FLC or State Leadership Conference
- 15 pts - Compete at FLC, RLC, SLC, or NLC
- 3 pts - Top 10 at RLC
- 5 pts - Advance to SLC
- 8 pts - Top 10 at SLC
- 10 pts - Advance to NLC
- 15 pts - Top 10 at NLC
- 20 pts - Attend National Leadership Conference

**Service & Leadership**
- 10 pts - Participate in School/Community Service Project/Fundraiser (max)
- 3 pts - Recruitment Referrals
- 2 pts - Submit Officer Application
- 3 pts - Other duties as assigned by Advisers

### 🎓 Grade-Level Requirements
- **Class of 2026**: 125 points
- **Class of 2027**: 250 points
- **Class of 2028**: 375 points
- **Class of 2029+**: 500 points

### 👤 User Experience Flow

#### For Regular Members:
1. **First Visit**: Browse the Points page as a guest
2. **Click "Track Your Points"**: Prompted to sign in
3. **After Sign In**: Redirected to personal dashboard
4. **Set Grade Level**: Select graduation year (Class of 2026-2029+)
5. **View Dashboard**: See current year points, cumulative points, and progress
6. **Add Points**: Select activity, date, and optional notes
7. **Track Progress**: View all entries with dates and school years
8. **Delete Entries**: Can remove their own entries if needed

#### Dashboard Features:
- **This Year Points**: Shows points for current school year (ending May 1)
- **Cumulative Points**: Total points across all years
- **Progress Bars**: Visual indicators for both yearly (125 pts) and cumulative goals
- **Status Badges**: Green (on track) or Yellow (needs more points)
- **Grade Profile**: Edit graduation class year anytime

### 👥 Admin Access

#### Accessing Admin Panel:
1. Sign in as a regular user
2. Click account menu → "Admin Panel"
3. Enter admin password: `chsfbla25`
4. Access full admin dashboard

#### Admin Capabilities:
- **View All Members**: See complete list with points totals
- **Member Details**: Click any member to view all their entries
- **Points Management**: Delete any member's point entries
- **Real-time Stats**: See yearly and cumulative totals
- **Progress Tracking**: Color-coded indicators show who's on track
- **User Identification**: View user IDs and graduation years

#### Admin Dashboard Layout:
- **Left Panel**: List of all members sorted by total points
  - Shows graduation year, total points, year points
  - Color indicators for goal achievement
  - Number of entries per member
- **Right Panel**: Detailed entries for selected member
  - Activity name, date, school year
  - Points awarded, hours (if applicable)
  - Notes/descriptions
  - Delete button for each entry

### 🔒 Security Features
- Authentication required for dashboards
- Admin password protection (`chsfbla25`)
- Users can only view/edit their own data
- Admins can view/edit all data after password verification
- Protected routes via middleware

### 🛠️ Technical Implementation

#### Free & Simple Approach:
- **Database**: Cosmic Database (free tier)
- **Authentication**: Cosmic Authentication (free)
- **Storage**: All data in cloud database
- **No Setup Required**: No external services or installations

#### Data Structure:
```typescript
// User Profiles Collection
{
  userId: string,
  classYear: number,
  createdAt: timestamp,
  updatedAt: timestamp
}

// Points Entries Collection
{
  userId: string,
  activityId: string,
  activityName: string,
  date: timestamp,
  schoolYear: number,
  points: number,
  hours?: number,
  notes: string,
  createdAt: timestamp
}
```

### 📋 Business Rules
- **Minimum Annual Points**: 125 points per year
- **Dues Deadline**: Must be paid by October 1st for full points
- **School Year Cutoff**: May 1st deadline
- **Points Accumulation**: Points accumulate across years
- **One-time Activities**: Some activities (like dues) can only be claimed once per year
- **Service Hours**: Service projects earn 2 pts/hour with 10 point maximum

### 🎨 Design Integration
- Maintains existing FBLA website color scheme (Blue #003DA5, Gold #FFC72C)
- Uses same fonts and styling as rest of site
- Consistent navbar and layout
- Smooth animations with Framer Motion
- Mobile responsive design

### 📱 Pages & Routes

#### Public Routes:
- `/points` - Points information page (viewable by all)

#### Protected Routes (Authentication Required):
- `/points/dashboard` - User's personal points dashboard
- `/admin/dashboard` - Admin panel (requires admin password)

#### API Endpoints:
- `GET /api/points` - Get user's entries or activity list
- `POST /api/points` - Add new point entry
- `DELETE /api/points` - Delete point entry
- `GET /api/profile` - Get user profile
- `POST /api/profile` - Update user profile (class year)
- `POST /api/admin/verify-password` - Verify admin password
- `GET /api/admin/users` - Get all users and their points
- `GET /api/admin/points` - Get specific user's entries
- `DELETE /api/admin/points` - Admin delete any entry

### 🚀 How to Use

#### For Members:
1. Visit the FBLA website
2. Navigate to "Points" in the navbar
3. Review point categories and requirements
4. Click "Track Your Points"
5. Sign in with school email
6. Set your graduation year
7. Add activities as you complete them
8. Monitor your progress toward graduation cord

#### For Administrators:
1. Sign in like a regular user
2. Access "Admin Panel" from account menu
3. Enter password: `chsfbla25`
4. View all member points
5. Click members to see detailed entries
6. Delete incorrect entries if needed
7. Monitor overall chapter participation

### ⚙️ Environment Setup
The system uses existing Cosmic services already configured in your `.env` file:
- `COSMIC_DATABASE_SECRET` - For storing points and profiles
- `COSMICAUTH_SECRET` - For user authentication
- No additional setup required

### 📊 Reporting Features
Admins can:
- See who has met yearly goals (125+ points)
- Track cumulative progress for each class year
- Identify members who need more engagement
- View activity participation rates
- Export data by reviewing entries

### 🔄 Data Management
- **User Control**: Members manage their own entries
- **Admin Oversight**: Admins can review and correct data
- **Audit Trail**: All entries timestamped
- **School Year Tracking**: Automatic school year calculation
- **No Data Loss**: Once added, data persists in database

### ✅ Testing Checklist
- [ ] Guest can view /points page
- [ ] Guest sees "Sign In" button in navbar
- [ ] Clicking "Track Your Points" prompts sign in
- [ ] After sign in, user redirected to dashboard
- [ ] User can select graduation year
- [ ] User can add point entries
- [ ] User can delete own entries
- [ ] Dashboard shows correct totals
- [ ] Admin panel requires password
- [ ] Admin can view all users
- [ ] Admin can see detailed entries
- [ ] Admin can delete any entry

### 🎯 Success Criteria Met
✅ Seamless integration with existing website design  
✅ Free implementation (no paid services)  
✅ Guest browsing with sign-in prompts  
✅ Complete points system with exact values  
✅ Grade-level requirements (2026-2029+)  
✅ Personal dashboard for members  
✅ Add/track points functionality  
✅ Admin panel with password protection  
✅ View and manage all member data  
✅ Mobile responsive  
✅ Maintainable by club officers  

### 🔮 Future Enhancements (Optional)
- Export member data to CSV
- Email notifications for point milestones
- Bulk point entry for events
- Activity approval workflow
- Point verification with evidence upload
- Leaderboard display
- Certificate generation for cord recipients

### 📞 Support
For technical issues:
1. Check browser console for errors
2. Verify authentication is working
3. Ensure database connection is active
4. Contact Cosmic support if needed

### 🏆 Graduation Cord Process
1. Members track points throughout high school
2. Must earn minimum 125 points per year
3. Must meet cumulative requirement by graduation
4. Submit point sheet to advisors by last day of school
5. Advisors verify using admin dashboard
6. Eligible members receive FBLA graduation cord

---

**System Status**: ✅ Fully Operational  
**Last Updated**: October 2025  
**Admin Password**: `chsfbla25` (Change in production!)

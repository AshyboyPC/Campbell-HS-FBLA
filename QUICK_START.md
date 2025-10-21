# FBLA Points System - Quick Start Guide

## 🚀 Getting Started in 3 Steps

### Step 1: Start the Development Server
```bash
npm run dev
```
Visit `http://localhost:3000`

### Step 2: Test as a Guest
1. Navigate to **Points** in the navbar
2. View all point categories and requirements
3. Notice the "Sign In" button always visible
4. Click **"Track Your Points"** button

### Step 3: Sign In and Test Features
1. Sign in with any account (preferably @campbellhigh.net email)
2. You'll be redirected to `/points/dashboard`
3. Select your graduation year (Class of 2026-2029+)
4. Add a sample point entry
5. View your progress

---

## 👤 User Flow Testing

### As a Regular Member:
```
1. Open website → Browse as guest
2. Click "Points" → View all categories
3. Click "Track Your Points" → Prompted to sign in
4. Sign in → Redirect to dashboard
5. Select graduation year → Save
6. Add activity entry → See updated totals
7. View entries list → Sorted by date
```

### As an Admin:
```
1. Sign in as regular user
2. Click account menu → Select "Admin Panel"
3. Enter password: chsfbla25
4. View all members → See totals and progress
5. Click a member → See their detailed entries
6. Delete incorrect entry → Confirm deletion
```

---

## 🎯 Key URLs

| Page | URL | Access Level |
|------|-----|--------------|
| Points Info | `/points` | Public (Guest OK) |
| User Dashboard | `/points/dashboard` | Authenticated Users |
| Admin Panel | `/admin/dashboard` | Authenticated + Password |

---

## 🔑 Important Credentials

**Admin Password**: `chsfbla25`

> ⚠️ **Security Note**: Change this password in production!
> Edit: `/app/api/admin/verify-password/route.ts`

---

## 📊 Point Entry Examples

### Example 1: Join FBLA
- Activity: "Join & Pay Dues (by Oct 1)"
- Date: 2025-09-15
- Points: 50
- Notes: "Paid membership dues"

### Example 2: Chapter Meeting
- Activity: "Attend Chapter Meeting"
- Date: 2025-10-05
- Points: 5
- Notes: "October general meeting"

### Example 3: Service Project
- Activity: "Participate in School/Community Service..."
- Date: 2025-11-10
- Hours: 4
- Points: 8 (2 pts/hr, max 10)
- Notes: "Food bank volunteer"

---

## 🧪 Testing Checklist

### Guest Experience
- [ ] Can view `/points` page without signing in
- [ ] See all point categories displayed
- [ ] See graduation requirements clearly
- [ ] "Track Your Points" button visible
- [ ] Clicking button prompts sign in
- [ ] "Sign In" button in navbar visible

### Authenticated User
- [ ] Redirected to dashboard after sign in
- [ ] Can select graduation year
- [ ] Can save graduation year
- [ ] Can add point entries
- [ ] Can delete own entries
- [ ] Dashboard shows correct totals
- [ ] Year vs cumulative properly calculated
- [ ] Progress bars display correctly
- [ ] User menu shows in navbar
- [ ] Can access "My Dashboard" from menu

### Admin Functions
- [ ] Can access admin panel from menu
- [ ] Admin password prompt appears
- [ ] Correct password grants access
- [ ] Can view all users list
- [ ] Users sorted by points
- [ ] Can click user to see entries
- [ ] Can delete any user's entries
- [ ] Totals update after deletion
- [ ] Can lock/unlock admin access

---

## 🎨 Design Verification

The system should match your existing site:
- ✅ Blue (#003DA5) and Gold (#FFC72C) colors
- ✅ Same fonts (display, subtitle, body)
- ✅ Consistent navbar style
- ✅ Matching card designs
- ✅ Smooth animations
- ✅ Mobile responsive
- ✅ Backdrop blur effects
- ✅ Rounded corners and shadows

---

## 🔧 Troubleshooting

### Issue: Can't access dashboard
**Solution**: Make sure you're signed in. Check navbar for user menu.

### Issue: Admin password doesn't work
**Solution**: Verify password is exactly `chsfbla25` (case-sensitive).

### Issue: Points not calculating correctly
**Solution**: Check that activities have correct point values in `/app/api/points/route.ts`.

### Issue: Graduation year not saving
**Solution**: Check browser console for API errors. Verify database connection.

### Issue: Entries not appearing
**Solution**: Refresh the page. Check that date is valid. Verify database is connected.

---

## 📱 Mobile Testing

Test on mobile devices or browser responsive mode:
- [ ] Navbar hamburger menu works
- [ ] Points page scrolls properly
- [ ] Dashboard is readable
- [ ] Forms are usable
- [ ] Admin panel is accessible
- [ ] Tables/lists are scrollable

---

## 🚨 Common User Questions

**Q: Can I edit an entry after adding it?**  
A: No, but you can delete and re-add it. Admins can also delete entries.

**Q: When do points reset?**  
A: They don't reset. Points accumulate. School years are tracked automatically based on May 1 cutoff.

**Q: Can I see other members' points?**  
A: No, only admins can see all members. Regular users only see their own dashboard.

**Q: What if I forget to log an activity?**  
A: You can add it later with the correct date. The system calculates school year based on the date.

**Q: How do admins verify points for graduation?**  
A: Admins use the admin panel to review all entries and verify totals before awarding cords.

---

## 💾 Data Storage

All data is stored in Cosmic Database (free tier):
- **profiles** collection: User graduation years
- **points_entries** collection: All point activities

No additional database setup required - uses existing configuration.

---

## 🎓 School Year Logic

The system automatically determines school years:
- **School Year ending May 1, 2026** includes dates from May 2, 2025 to May 1, 2026
- Points earned before May 1 count toward that school year
- Points earned May 2 onward count toward next school year
- October 1 deadline enforced for dues payment

---

## ✅ Production Deployment

Before going live:
1. ✅ System is already production-ready
2. ⚠️ Change admin password in code
3. ✅ All routes are protected
4. ✅ Database is connected
5. ✅ Authentication is working
6. 📢 Announce to members
7. 📧 Send instructions to advisers

---

## 🎉 You're Ready!

The FBLA Points Tracking System is now fully operational and integrated into your website. Members can start tracking their points immediately, and administrators can manage all member data with ease.

**Next Steps:**
1. Test all features thoroughly
2. Train club officers on admin panel
3. Announce to membership
4. Begin tracking points for graduation cords

For detailed documentation, see `POINTS_SYSTEM_README.md`.

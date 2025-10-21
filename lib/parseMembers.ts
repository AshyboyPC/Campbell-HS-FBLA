export interface Member {
  firstName: string;
  lastName: string;
  grade: string;
  email: string;
  phone: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  tshirtSize: string;
  previousParticipation: string;
  interests: string[];
  meetingDays: string[];
}

export const parseMembersFromHTML = (html: string): Member[] => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const rows = doc.querySelectorAll('tr');
  const members: Member[] = [];
  
  // Skip header row and process each member row
  for (let i = 1; i < rows.length; i++) {
    const cells = rows[i].querySelectorAll('td');
    if (cells.length < 30) continue; // Skip rows that don't have enough cells

    try {
      const meetingDays: string[] = [];
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
      
      // Check which meeting days are selected (columns 14-18)
      for (let d = 0; d < 5; d++) {
        if (cells[14 + d]?.textContent?.trim()) {
          meetingDays.push(days[d]);
        }
      }

      // Extract interests (columns 20-29)
      const interests: string[] = [];
      for (let j = 20; j < 30; j++) {
        const interest = cells[j]?.textContent?.trim();
        if (interest) interests.push(interest);
      }

      const member: Member = {
        firstName: cells[1]?.textContent?.trim() || 'Unknown',
        lastName: cells[2]?.textContent?.trim() || 'Member',
        grade: cells[3]?.textContent?.trim() || '',
        email: cells[4]?.textContent?.trim() || '',
        phone: cells[5]?.textContent?.trim() || '',
        parentName: cells[6]?.textContent?.trim() || '',
        parentEmail: cells[7]?.textContent?.trim() || '',
        parentPhone: cells[8]?.textContent?.trim() || '',
        tshirtSize: cells[9]?.textContent?.trim() || '',
        previousParticipation: cells[19]?.textContent?.trim() || 'No',
        interests,
        meetingDays
      };

      // Only add if we have at least a first name
      if (member.firstName !== 'Unknown') {
        members.push(member);
      }
    } catch (error) {
      console.error('Error parsing member data:', error);
    }
  }

  return members;
};

// This function will be used in a useEffect to load the HTML file
export const loadMembers = async (): Promise<Member[]> => {
  try {
    const response = await fetch('/Form Responses 1.html');
    const html = await response.text();
    return parseMembersFromHTML(html);
  } catch (error) {
    console.error('Failed to load members:', error);
    return [];
  }
};

export function CampbellSeal() {
  return <svg viewBox="0 0 160 160" role="img" aria-label="Campbell FBLA 2026–27">
    <defs><path id="seal-ring" d="M80 80m-57 0a57 57 0 1 1 114 0a57 57 0 1 1-114 0" /></defs>
    <circle cx="80" cy="80" r="76" fill="#b9dfff" />
    <text fill="#061a4e" fontSize="13" fontWeight="700" letterSpacing="3.4"><textPath href="#seal-ring" startOffset="3%">CAMPBELL • FBLA • CAMPBELL • FBLA •</textPath></text>
    <path d="M80 49c5 17 9 21 27 26-18 5-22 9-27 27-5-18-9-22-27-27 18-5 22-9 27-26Z" fill="#ffc72c" />
  </svg>;
}

export function ArrowIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export function MeetingOrbit({ time, room }) {
  return <svg viewBox="0 0 180 180" role="img" aria-label={`Meetings Wednesdays at ${time} in ${room}`}>
    <defs><path id="meeting-orbit-path" d="M90 90m-64 0a64 64 0 1 1 128 0a64 64 0 1 1-128 0" /></defs>
    <circle cx="90" cy="90" r="79" fill="#061a4e" />
    <g className="bio-orbit-copy"><text fill="#fff" fontSize="10.5" fontWeight="700" letterSpacing="2.25"><textPath href="#meeting-orbit-path" startOffset="1%">WEDNESDAYS • {time} • {room} • WEDNESDAYS • </textPath></text></g>
    <circle className="meeting-orbit-marker" cx="90" cy="26" r="5" fill="#58c9ff" stroke="#061a4e" strokeWidth="2" />
    <rect x="61" y="61" width="58" height="58" rx="17" fill="#ffc72c" />
    <path d="M72 70v10h36V70M72 87h36" fill="none" stroke="#061a4e" strokeWidth="5" strokeLinecap="round" />
    <text x="90" y="106" fill="#061a4e" fontFamily="Arial, sans-serif" fontSize="17" fontWeight="800" textAnchor="middle">WED</text>
  </svg>;
}

import Link from "next/link";
import Image from "next/image";
import { chapter } from "@/data/chapter";
import {NucleoInstagram} from "@/components/chapter/nucleo-instagram";

const footerLinks = [
  { initial: "T", label: "Take Part", href: "/get-involved", group: "Get involved" },
  { initial: "O", label: "Overview", href: "/about", group: "About" },
  { initial: "G", label: "Gallery", href: "/gallery", group: "Gallery" },
  { initial: "E", label: "Events", href: "/events", group: "Events" },
  { initial: "T", label: "Test", href: "/compete", group: "Compete" },
  { initial: "H", label: "Home", href: "/", group: "Home" },
  { initial: "E", label: "Essentials", href: "/resources", group: "Resources" },
  { initial: "R", label: "Reach Out", href: "/contact", group: "Contact" },
];

export default function Footer() {
  return (
    <footer className="chapter-footer">
      <div className="footer-feature">
        <div className="footer-invite">
          <svg className="footer-story-svg footer-invite-story" viewBox="0 0 320 120" aria-hidden="true">
            <path className="footer-story-line" pathLength="1" d="M-20 98C110 135 162-20 87 24S132 137 340-5" />
          </svg>
          <h2>Make your<br />next move<br />matter.</h2>
          <p>Compete. Lead. Serve. Create. There’s a place for you at Campbell FBLA.</p>
          <Link className="footer-action" href="/get-involved"><span>Get involved</span><b aria-hidden="true">↗</b></Link>
        </div>
        <div className="footer-feature-art">
          <span className="footer-edition">CAMPBELL HIGH SCHOOL / {chapter.yearLabel}</span>
          <div className="footer-art-mark"><Image src="/FBLA-Symbol.png" alt="" width={160} height={160} /><p>More than<br />a club.</p></div>
          <span className="footer-art-caption">Student-led. Campbell proud.</span>
          <svg className="footer-story-svg footer-orbit-story" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <g fill="none" stroke="currentColor" strokeWidth="3">
              <ellipse className="footer-orbit footer-orbit-one" pathLength="1" cx="600" cy="370" rx="420" ry="210" transform="rotate(-38 600 370)" />
              <ellipse className="footer-orbit footer-orbit-two" pathLength="1" cx="730" cy="260" rx="330" ry="150" transform="rotate(-38 730 260)" />
            </g>
          </svg>
        </div>
      </div>

      <div className="footer-base">
        <svg className="footer-loop footer-story-svg" viewBox="0 0 500 600" aria-hidden="true">
          <path className="footer-story-line" pathLength="1" d="M10 630C400 490 190 290 325 164S550 165 425 280S200 107 470-55" />
        </svg>
        <div className="footer-top-grid">
          <div className="footer-intro">
            <h2>Big ideas.<br />Real impact.<br />Our chapter.</h2>
            <div className="footer-contact">
              <span className="footer-label">CONTACT</span>
              <a href={`mailto:${chapter.email}`}>{chapter.email}</a>
              <p>{chapter.school}<br />{chapter.address}</p>
            </div>
          </div>

          <div className="footer-link-groups">
            <span className="footer-label">TOGETHER — EXPLORE THE CHAPTER</span>
            <nav className="footer-strip-card" aria-label="Footer navigation">
              {footerLinks.map(({ initial, label, href, group }) => (
                <Link className="footer-strip" key={href} href={href} aria-label={`${label} — ${group}`}>
                  <span className="footer-strip-initial" aria-hidden="true">{initial}</span>
                  <span className="footer-strip-word" aria-hidden="true">
                    {Array.from(label.toUpperCase()).map((letter, index) => (
                      <i className={letter === " " ? "is-space" : undefined} key={`${letter}-${index}`}>{letter === " " ? "\u00A0" : letter}</i>
                    ))}
                  </span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="footer-socials">
            <span className="footer-label">FOLLOW US</span>
            {chapter.socials.map((social) => (
              <a key={social.href} href={social.href} target="_blank" rel="noreferrer" aria-label={social.label}>
                {social.label === "Instagram" ? <NucleoInstagram width={18} height={18} aria-hidden="true"/> : <span aria-hidden="true">♪</span>}
              </a>
            ))}
          </div>
        </div>

        <div className="footer-bottom-grid">
          <Link className="footer-mega-brand" href="/" aria-label="Campbell FBLA home"><Image src="/FBLA-Symbol.png" alt="" width={110} height={110} /><span>Campbell<span>FBLA.</span></span></Link>
          <aside className="footer-updates"><h3>Stay in the loop.</h3><p>Current members use BAND for chapter announcements, meeting reminders, and updates.</p><Link className="footer-action" href="/contact"><span>Connect with us</span><b aria-hidden="true">↗</b></Link></aside>
        </div>
        <div className="footer-legal"><span>© {chapter.year.split("–")[0]} CAMPBELL FBLA</span><span>FUTURE BUSINESS LEADERS OF AMERICA</span><span className="footer-icon-credit">Icons by <a href="https://lucide.dev" target="_blank" rel="noreferrer">Lucide</a> + <a href="https://iconscout.com/unicons" target="_blank" rel="noreferrer">IconScout Unicons</a> + <a href="https://nucleoapp.com" target="_blank" rel="noreferrer">Nucleo</a></span></div>
      </div>
    </footer>
  );
}

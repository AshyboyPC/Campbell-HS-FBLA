import "./globals.css";
import "./chapter.css";
import "./home-v2.css";
import "./footer.css";
import type { Metadata } from "next";
import { displayFont, subtitleFont } from "./fonts";
import Navigation from "@/components/chapter/navigation";
import Footer from "@/components/chapter/footer";
import FooterVisibility from "@/components/chapter/footer-visibility";
import PageMotion from "@/components/chapter/page-motion";
import SectionRail from "@/components/chapter/section-rail";
export const metadata: Metadata = {
 title: { default:"Campbell High School FBLA | 2026–2027", template:"%s | Campbell FBLA" },
 description:"Student-led. Competition-ready. Community-minded. Explore Campbell High School FBLA, Wednesday meetings, competitions, service, and membership for 2026–2027."
};
export default function RootLayout({children}:{children:React.ReactNode}) {
 return <html lang="en" className={`${displayFont.variable} ${subtitleFont.variable}`}><body suppressHydrationWarning><a className="skip-link" href="#main">Skip to content</a><PageMotion/><Navigation/><SectionRail/><main id="main">{children}</main><Footer/><FooterVisibility/></body></html>;
}

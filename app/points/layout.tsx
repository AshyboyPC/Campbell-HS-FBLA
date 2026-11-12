import { PortalMotion } from "@/components/points/portal-motion";
import "./portal.css";

export default function PointsLayout({ children }: { children: React.ReactNode }) {
  return <div className="points-root"><PortalMotion>{children}</PortalMotion></div>;
}

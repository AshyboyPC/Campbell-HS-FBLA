import type {SVGProps} from "react";
import {HugeiconsIcon} from "@hugeicons/react";
import {
  ArrowDown01Icon, ArrowLeft01Icon, ArrowRight01Icon, ArrowUpRightIcon, BarChartIcon,
  CalendarCheckIn01Icon, Calendar01Icon, CalendarSyncIcon, Tick02Icon,
  CheckmarkCircle02Icon, ClipboardCheckIcon, Clock03Icon, Download01Icon, ExternalLinkIcon,
  ClockIcon, GaugeIcon, DashboardSquare01Icon, Loading03Icon, LockKeyholeIcon, Logout03Icon,
  Mail01Icon, Medal01Icon, PlusSignIcon, RefreshIcon, RotateLeftIcon, Search01Icon, SentIcon,
  Settings02Icon, GoogleSheetIcon, ShieldCheckIcon, TrophyIcon, UserIcon, UserGroupIcon,
  WorkflowCircle01Icon, Cancel01Icon,
  Archive01Icon, BadgeCheckIcon, BookOpenTextIcon, CalendarClockIcon,
  ChartNoAxesCombinedIcon, HelpCircleIcon, CodeIcon, FileSearchIcon, FileStackIcon,
  FolderOpenIcon, GitCompareIcon, GraduationCapIcon, IdCardIcon, Image01Icon,
  InformationCircleIcon, GridIcon, LifebuoyIcon, Link01Icon, ListViewIcon, MapIcon,
  Megaphone01Icon, Message01Icon, HierarchyIcon,
  Presentation01Icon, Rocket01Icon, Route01Icon, UniversityIcon, ShapesIcon,
  Road01Icon, Target01Icon, UserCheck01Icon,
} from "@hugeicons/core-free-icons";

type Props = SVGProps<SVGSVGElement> & {size?: number | string; strokeWidth?: number; absoluteStrokeWidth?: boolean};
const icon = (data: typeof ArrowDown01Icon) => function Icon({size = 24, strokeWidth = 1.8, ...props}: Props) {
  return <HugeiconsIcon icon={data} size={size} strokeWidth={strokeWidth} color="currentColor" {...props}/>;
};

export const ArrowDown = icon(ArrowDown01Icon);
export const ArrowLeft = icon(ArrowLeft01Icon);
export const ArrowRight = icon(ArrowRight01Icon);
export const ArrowUpRight = icon(ArrowUpRightIcon);
export const BarChart3 = icon(BarChartIcon);
export const CalendarCheck2 = icon(CalendarCheckIn01Icon);
export const CalendarDays = icon(Calendar01Icon);
export const CalendarSync = icon(CalendarSyncIcon);
export const Check = icon(Tick02Icon);
export const CheckCircle2 = icon(CheckmarkCircle02Icon);
export const ChevronDown = icon(ArrowDown01Icon);
export const ChevronRight = icon(ArrowRight01Icon);
export const CircleAlert = icon(ExternalLinkIcon);
export const ClipboardCheck = icon(ClipboardCheckIcon);
export const Clock3 = icon(Clock03Icon);
export const Download = icon(Download01Icon);
export const ExternalLink = icon(ExternalLinkIcon);
export const FileClock = icon(ClockIcon);
export const Gauge = icon(GaugeIcon);
export const LayoutDashboard = icon(DashboardSquare01Icon);
export const LoaderCircle = icon(Loading03Icon);
export const LockKeyhole = icon(LockKeyholeIcon);
export const LogOut = icon(Logout03Icon);
export const Mail = icon(Mail01Icon);
export const Medal = icon(Medal01Icon);
export const Plus = icon(PlusSignIcon);
export const RefreshCw = icon(RefreshIcon);
export const RotateCcw = icon(RotateLeftIcon);
export const Search = icon(Search01Icon);
export const Send = icon(SentIcon);
export const Settings2 = icon(Settings02Icon);
export const Sheet = icon(GoogleSheetIcon);
export const ShieldCheck = icon(ShieldCheckIcon);
export const Trophy = icon(TrophyIcon);
export const UserRound = icon(UserIcon);
export const Users = icon(UserGroupIcon);
export const Workflow = icon(WorkflowCircle01Icon);
export const X = icon(Cancel01Icon);
export const Archive = icon(Archive01Icon);
export const BadgeCheck = icon(BadgeCheckIcon);
export const BookOpenText = icon(BookOpenTextIcon);
export const CalendarClock = icon(CalendarClockIcon);
export const ChartNoAxesCombined = icon(ChartNoAxesCombinedIcon);
export const CircleHelp = icon(HelpCircleIcon);
export const CodeXml = icon(CodeIcon);
export const FileSearch2 = icon(FileSearchIcon);
export const Files = icon(FileStackIcon);
export const FolderOpen = icon(FolderOpenIcon);
export const GitCompareArrows = icon(GitCompareIcon);
export const GraduationCap = icon(GraduationCapIcon);
export const IdCard = icon(IdCardIcon);
export const Images = icon(Image01Icon);
export const Info = icon(InformationCircleIcon);
export const LayoutGrid = icon(GridIcon);
export const LifeBuoy = icon(LifebuoyIcon);
export const Link2 = icon(Link01Icon);
export const ListChecks = icon(ListViewIcon);
export const Map = icon(MapIcon);
export const Megaphone = icon(Megaphone01Icon);
export const MessageCircle = icon(Message01Icon);
export const MoveRight = icon(ArrowRight01Icon);
export const Network = icon(HierarchyIcon);
export const Presentation = icon(Presentation01Icon);
export const Rocket = icon(Rocket01Icon);
export const Route = icon(Route01Icon);
export const School = icon(UniversityIcon);
export const Shapes = icon(ShapesIcon);
export const Signpost = icon(Road01Icon);
export const Target = icon(Target01Icon);
export const UserRoundCheck = icon(UserCheck01Icon);
export const UsersRound = icon(UserGroupIcon);
export type LucideIcon = (props: Props) => React.JSX.Element;

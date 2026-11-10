import type {SVGProps} from "react";
import {HugeiconsIcon} from "@hugeicons/react";
import {
  Analytics01Icon, AppStoreIcon, Archive01Icon, Award01Icon, BadgeCheckIcon,
  BookOpen01Icon, BookOpen02Icon, Briefcase01Icon, Calendar01Icon, Calendar03Icon,
  ChartLineData01Icon, ClipboardIcon, Clock01Icon, Coins01Icon, MessageMultiple01Icon,
  GitCompareIcon, Home01Icon, File01Icon, FileCheckIcon, FileSearchIcon,
  FileStackIcon, Target01Icon, FolderOpenIcon, GraduationCapIcon, HeartIcon,
  Image01Icon, InformationCircleIcon, LaptopIcon, LifebuoyIcon, LightbulbIcon,
  Link01Icon, ListViewIcon, Location01Icon, MapIcon, Medal01Icon, Megaphone01Icon,
  Money01Icon, PathfinderCropIcon, PodiumIcon, Presentation01Icon, HelpCircleIcon,
  Rocket01Icon, ShieldCheckIcon, Road01Icon, ArrowRight01Icon, HierarchyIcon,
  StarIcon, Luggage01Icon, TrophyIcon, UniversityIcon, UserCheck01Icon,
  UserSquareIcon, UserGroupIcon, GridIcon,
} from "@hugeicons/core-free-icons";

const icons = {
  analytics: Analytics01Icon, apps: AppStoreIcon, archive: Archive01Icon, award: Award01Icon,
  badge: BadgeCheckIcon, book: BookOpen01Icon, books: BookOpen02Icon, briefcase: Briefcase01Icon,
  calendar: Calendar01Icon, "calendar-alt": Calendar03Icon, growth: ChartLineData01Icon,
  clipboard: ClipboardIcon, clock: Clock01Icon, coins: Coins01Icon, comments: MessageMultiple01Icon,
  compare: GitCompareIcon, chapter: Home01Icon, file: File01Icon, "file-check": FileCheckIcon,
  "file-search": FileSearchIcon, documents: FileStackIcon, target: Target01Icon,
  folder: FolderOpenIcon, graduation: GraduationCapIcon, heart: HeartIcon, images: Image01Icon,
  info: InformationCircleIcon, laptop: LaptopIcon, help: LifebuoyIcon, idea: LightbulbIcon,
  link: Link01Icon, checklist: ListViewIcon, location: Location01Icon, map: MapIcon,
  medal: Medal01Icon, megaphone: Megaphone01Icon, money: Money01Icon, pathway: PathfinderCropIcon,
  podium: PodiumIcon, presentation: Presentation01Icon, question: HelpCircleIcon,
  rocket: Rocket01Icon, verified: ShieldCheckIcon, sign: Road01Icon,
  next: ArrowRight01Icon, network: HierarchyIcon, star: StarIcon, dress: Luggage01Icon,
  trophy: TrophyIcon, school: UniversityIcon, adviser: UserCheck01Icon, member: UserSquareIcon,
  people: UserGroupIcon, formats: GridIcon,
} as const;

export type SiteIconName = keyof typeof icons;
type SiteIconProps = Omit<SVGProps<SVGSVGElement>, "name" | "size" | "strokeWidth"> & {name: SiteIconName; size?: string | number; strokeWidth?: number};

export function SiteIcon({name, size = 24, ...props}: SiteIconProps) {
  return <HugeiconsIcon icon={icons[name]} size={size} color="currentColor" {...props}/>;
}

import {
  Activity,
  Ambulance,
  Calendar,
  Clock,
  Eye,
  EyeOff,
  FileText,
  FlaskConical,
  HeartPulse,
  Mail,
  MapPin,
  Menu,
  MessageSquare,
  Phone,
  Pill,
  ShieldCheck,
  Star,
  Stethoscope,
  User,
  Video,
  X,
  type LucideIcon,
} from "lucide-react";

export const iconMap = {
  activity: Activity,
  ambulance: Ambulance,
  calendar: Calendar,
  clock: Clock,
  eye: Eye,
  "eye-off": EyeOff,
  "file-text": FileText,
  flask: FlaskConical,
  "heart-pulse": HeartPulse,
  mail: Mail,
  "map-pin": MapPin,
  menu: Menu,
  message: MessageSquare,
  phone: Phone,
  pill: Pill,
  "shield-check": ShieldCheck,
  star: Star,
  stethoscope: Stethoscope,
  user: User,
  video: Video,
  x: X,
} as const satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof iconMap;

interface IconProps {
  name: IconName;
  className?: string;
  size?: number;
  "aria-hidden"?: boolean;
}

export function Icon({
  name,
  className = "h-5 w-5",
  size,
  "aria-hidden": ariaHidden = true,
}: IconProps) {
  const LucideComponent = iconMap[name];
  return (
    <LucideComponent
      className={className}
      size={size}
      aria-hidden={ariaHidden}
    />
  );
}

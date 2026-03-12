import {
  Settings2, Server, Brain, Users, Target, MessageSquare,
  Zap, TrendingUp, Mail, MapPin, Globe, BookOpen, Lock,
  Shield, Layers, BarChart3, FileText, Paperclip, UserCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const iconMap: Record<string, LucideIcon> = {
  Settings2, Server, Brain, Users, Target, MessageSquare,
  Zap, TrendingUp, Mail, MapPin, Globe, BookOpen, Lock,
  Shield, Layers, BarChart3, FileText, Paperclip, UserCheck,
};

export function getIcon(name: string): LucideIcon {
  return iconMap[name] ?? Settings2;
}

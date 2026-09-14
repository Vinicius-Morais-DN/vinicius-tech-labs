import {
  Network, Terminal, Router, Shield, Lock, Code, Server, Folder,
  Database, Globe, Cpu, Cloud, Bug, Wifi, Key, FileCode, Monitor, GitBranch,
} from "lucide-react";

const iconMap = {
  network: Network,
  terminal: Terminal,
  router: Router,
  shield: Shield,
  lock: Lock,
  code: Code,
  server: Server,
  folder: Folder,
  database: Database,
  globe: Globe,
  cpu: Cpu,
  cloud: Cloud,
  bug: Bug,
  wifi: Wifi,
  key: Key,
  filecode: FileCode,
  monitor: Monitor,
  git: GitBranch,
};

export const ICON_OPTIONS = Object.keys(iconMap);

export function DynIcon({ name, className = "w-5 h-5" }) {
  const Icon = iconMap[name] || Folder;
  return <Icon className={className} />;
}

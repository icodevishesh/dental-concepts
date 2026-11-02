"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Newspaper, BookOpen, CalendarDays, Inbox, FolderOpen, Settings, LogOut } from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin/cases", label: "Cases", icon: FolderOpen },
  { href: "/admin/leads", label: "Leads", icon: Inbox },
  { href: "/admin/articles", label: "Articles", icon: Newspaper },
  { href: "/admin/guides", label: "Guides", icon: BookOpen },
  { href: "/admin/events", label: "Events", icon: CalendarDays },  
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
    } finally {
      router.push("/admin/login");
      router.refresh();
    }
  }

  return (
    <aside
      className="w-60 shrink-0 h-screen sticky top-0 overflow-y-auto bg-navy-card border-r border-white/10 flex flex-col text-white"
      style={{ color: "#ffffff" }}
    >
      <div className="px-5 py-5 border-b border-white/10">
        <span className="text-white font-semibold text-sm">Dental Concepts</span>
        <div className="text-[11px] text-muted-dark mt-0.5">Admin panel</div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors !text-white ${
                active ? "bg-blue-default" : "hover:bg-white/10"
              }`}
              style={{ color: "#ffffff" }}
            >
              <Icon className="w-4 h-4 shrink-0 !text-white" style={{ color: "#ffffff" }} />
              <span className="!text-white" style={{ color: "#ffffff" }}>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium !text-white/80 hover:!text-white hover:bg-white/10 transition-colors disabled:opacity-50 cursor-pointer border-none bg-transparent"
          style={{ color: "rgba(255, 255, 255, 0.85)" }}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>{loggingOut ? "Logging out…" : "Log out"}</span>
        </button>
      </div>
    </aside>
  );
}

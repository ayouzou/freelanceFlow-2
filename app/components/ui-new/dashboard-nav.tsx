"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Briefcase, Users, Clock, FileText, BarChart, Settings } from "lucide-react"

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
}

export function DashboardNav() {
  const pathname = usePathname()

  const navItems: NavItem[] = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
    },
    {
      title: "Projects",
      href: "/dashboard/projects",
      icon: <Briefcase className="mr-2 h-4 w-4" />,
    },
    {
      title: "Clients",
      href: "/dashboard/clients",
      icon: <Users className="mr-2 h-4 w-4" />,
    },
    {
      title: "Time Tracking",
      href: "/dashboard/time",
      icon: <Clock className="mr-2 h-4 w-4" />,
    },
    {
      title: "Invoices",
      href: "/dashboard/invoices",
      icon: <FileText className="mr-2 h-4 w-4" />,
    },
    {
      title: "Reports",
      href: "/dashboard/reports",
      icon: <BarChart className="mr-2 h-4 w-4" />,
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: <Settings className="mr-2 h-4 w-4" />,
    },
  ]

  return (
    <nav className="space-y-1">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-disabled={item.href === "/dashboard/reports"}
          className={cn(
            "flex items-center rounded-md px-3 py-2 text-sm font-medium",
            item.href === "/dashboard/reports" && "pointer-events-none opacity-50", // Disable link
            pathname === item.href
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          {item.icon}
          {item.title}
        </Link>
      ))}
    </nav>
  )
}


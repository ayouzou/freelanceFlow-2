"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { LayoutDashboard, Briefcase, Users, Clock, FileText, BarChart, Settings, Menu } from "lucide-react"

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
}

export function MobileNav() {
  const [open, setOpen] = useState(false)
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
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <div className="flex h-16 items-center border-b px-4">
          <div className="flex items-center gap-2 font-bold text-xl">
            <span className="text-primary">FreelanceFlow</span>
          </div>
        </div>
        <nav className="grid gap-1 p-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium",
                pathname === item.href
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {item.icon}
              {item.title}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}


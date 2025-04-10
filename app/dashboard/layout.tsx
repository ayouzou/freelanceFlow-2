import type { ReactNode } from "react"
import { MobileNav } from "../components/ui/mobile-nav"
import { UserNav } from "../components/ui/user-nav"
import { DashboardNav } from "../components/ui/dashboard-nav"


export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky  top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className=" flex h-16 items-center justify-between px-10">
          <div className="flex items-center gap-2 font-bold text-xl md:hidden">
            <span className="text-primary">FF</span>
          </div>
          <div className="hidden md:flex items-center gap-2 font-bold text-xl">
            <span className="text-primary">FreelanceFlow</span>
          </div>
          <MobileNav />
          <div className="flex items-center gap-4">
            <UserNav />
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="hidden md:flex w-64 flex-col border-r bg-muted/40 px-4 py-6">
          <DashboardNav />
        </aside>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
"use client"


import { LogOut, Loader2 } from "lucide-react"
import { useLogout } from "@/lib/react-query/auth-hooks"
import { Button } from "components/ui/button"

interface LogoutButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function LogoutButton({ variant = "ghost", size = "default", className }: LogoutButtonProps) {
  const logout = useLogout()

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={() => logout.mutate()}
      disabled={logout.isPending}
    >
      {logout.isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          <LogOut className="h-4 w-4 mr-2" />
          <span>Logout</span>
        </>
      )}
    </Button>
  )
}


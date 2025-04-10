import Link from "next/link"
import type { Metadata } from "next"
// import { ForgotPasswordForm } from "../components/auth/forgot-password-form"

export const metadata: Metadata = {
  title: "Forgot Password | FreelanceFlow",
  description: "Reset your FreelanceFlow password",
}

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Link href="/" className="flex justify-center">
            <span className="text-primary text-2xl font-bold">FreelanceFlow</span>
          </Link>
          <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight">Reset your password</h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Remember your password?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-card px-6 py-8 shadow sm:rounded-lg sm:px-8">
            {/* <ForgotPasswordForm /> */}
          </div>
        </div>
      </div>
    </div>
  )
}
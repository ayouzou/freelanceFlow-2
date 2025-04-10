import Link from "next/link"
import type { Metadata } from "next"
import { LoginForm } from "../components/auth/login-form"
// import { LoginForm } from "../components/auth/login-form"

export const metadata: Metadata = {
  title: "Login | FreelanceFlow",
  description: "Login to your FreelanceFlow account",
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Link href="/" className="flex justify-center">
            <span className="text-primary text-2xl font-bold">FreelanceFlow</span>
          </Link>
          <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight">Sign in to your account</h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/register" className="font-medium text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-card px-6 py-8 shadow sm:rounded-lg sm:px-8">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  )
}

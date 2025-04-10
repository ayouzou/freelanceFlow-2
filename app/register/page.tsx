import Link from "next/link"
import type { Metadata } from "next"
import { RegisterForm } from "../components/auth/register-form"
// import { RegisterForm } from "../components/auth/register-form"


export const metadata: Metadata = {
  title: "Register | FreelanceFlow",
  description: "Create a new FreelanceFlow account",
}

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Link href="/" className="flex justify-center">
            <span className="text-primary text-2xl font-bold">FreelanceFlow</span>
          </Link>
          <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight">Create a new account</h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-card px-6 py-8 shadow sm:rounded-lg sm:px-8">
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  )
}

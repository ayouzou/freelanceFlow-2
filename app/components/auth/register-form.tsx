'use client'
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRegister } from "@/lib/react-query/auth-hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const registerSchema = z
    .object({
        name: z.string().min(2, { message: "Name must be at least 2 characters" }),
        email: z.string().email({ message: "Please enter a valid email address" }),
        password: z.string().min(8, { message: "Password must be at least 8 characters" }),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    })

type RegisterFormValues = z.infer<typeof registerSchema>

export function RegisterForm() {
    const register = useRegister()
  
    const {
      register: registerField,
      handleSubmit,
      formState: { errors },
    } = useForm<RegisterFormValues>({
      resolver: zodResolver(registerSchema),
      defaultValues: {
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      },
    })
  
    async function onSubmit(data: RegisterFormValues) {
      register.mutate({
        name: data.name,
        email: data.email,
        password: data.password,
      })
    }
  
    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {register.isError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{register.error?.message || "An error occurred during registration"}</AlertDescription>
          </Alert>
        )}
  
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" type="text" placeholder="John Doe" {...registerField("name")} disabled={register.isPending} />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>
  
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            {...registerField("email")}
            disabled={register.isPending}
          />
          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>
  
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            {...registerField("password")}
            disabled={register.isPending}
          />
          {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
        </div>
  
        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirm password</Label>
          <Input
            id="confirm-password"
            type="password"
            placeholder="••••••••"
            {...registerField("confirmPassword")}
            disabled={register.isPending}
          />
          {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
        </div>
  
        <Button type="submit" className="w-full" disabled={register.isPending}>
          {register.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
            </>
          ) : (
            "Create account"
          )}
        </Button>
      </form>
    )
  }
  
  
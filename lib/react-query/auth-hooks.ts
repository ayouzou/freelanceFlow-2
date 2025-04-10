
"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"






interface LoginCredentials {
    email: string
    password: string
    rememberMe?: boolean
}

interface RegisterData {
    name: string
    email: string
    password: string
}

interface ForgotPasswordData {
    email: string
}

interface ResetPasswordData {
    token: string
    password: string
}
async function registerUser(data: RegisterData) {
    const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify(data)
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message)
    }
    return response.json()
}

export function useRegister() {
    const router = useRouter()
    return useMutation({
        mutationFn: registerUser,
        onSuccess: () => {
            router.push("/login?registered=true")
        },
    })
}


async function loginUser(credentials: LoginCredentials) {
    const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to login")
    }

    return response.json()
}
export function useLogin() {
    const router = useRouter()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: loginUser,
        onSuccess: (data) => {
            queryClient.setQueryData(["user"], data.user)
            router.push("/dashboard")
            router.refresh()
        },
    })
}

async function logoutUser() {
    const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to logout")
    }

    return response.json()
}
export function useLogout() {
    const router = useRouter()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: logoutUser,
        onSuccess: () => {
            queryClient.clear()
            router.push("/login")
            router.refresh()
        },
    })
}
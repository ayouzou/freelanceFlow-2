import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import prisma from "@/lib/db"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json()
        if (!email || !password) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }
        const user = await prisma.user.findUnique({
            where: { email },
        })

        if (!user) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
        }
        const token = jwt.sign({
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
        }, JWT_SECRET, { expiresIn: "1h" })
        const cookieStore = await cookies()
        cookieStore.set("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60, 
            path: "/",
        })
        const { password: _, ...userData } = user

        return NextResponse.json({
            message: "Login successful",
            user: userData,
        })
    } catch (error) {
        console.error("Login error:", error)
        return NextResponse.json({ error: "Failed to login user" }, { status: 500 })
    }
}
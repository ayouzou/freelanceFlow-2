import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import prisma from "@/lib/db"


export async function POST(request: Request) {
    try {
        const { name, email, password } = await request.json()
        if (!name || !email || !password) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const user =  prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
            },
        })
        if (!user) {
            return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
        }
        return NextResponse.json(
            {
                message: "User registered successfully",
                user,
            },
            { status: 201 },
        )
    }
    catch (error) {
        console.error("Registration error:", error)
        return NextResponse.json({ error: "Failed to register user" }, { status: 500 })
    }
}
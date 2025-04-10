import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { jwtVerify } from "jose";
import type { NextRequest } from "next/server"
import prisma from "@/lib/db"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key");

export interface UserJwtPayload {
    id: string
    email: string
    name: string
    role: string
    iat: number
    exp: number
} 

export async function getAuthUser() {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get("auth_token")?.value

        if (!token) {
            return null
        }

        const { payload } = await jwtVerify(token, JWT_SECRET);
        const decoded = payload as unknown as UserJwtPayload;


        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            },
        })

        return user
    } catch (error) {
        console.error("Auth error:", error)
        return null
    }
}

export async function verifyAuth(request: NextRequest) {
    try {
        const token = request.cookies.get("auth_token")?.value

        if (!token) {
            return null
        }

        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload as unknown as UserJwtPayload;
    } catch (error) {
        console.error("Auth verification error:", error)
        return null
    }
}

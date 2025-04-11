import { getAuthUser } from "@/lib/auth";
import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";



const clientSchema = z.object({
    name: z.string().min(2, "Company name must be at least 2 characters"),
    contactName: z.string().min(2, "Contact name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().optional(),
    website: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
    address: z.string().optional(),
    status: z.enum(["active", "inactive", "lead"]),
    description: z.string().optional(),
})

export async function GET(request: NextRequest) {
    try {
        const user = await getAuthUser()
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        const { searchParams } = new URL(request.url)
        const status = searchParams.get("status")
        const search = searchParams.get("search")
        const where: any = {}
        if (status) {
            where.status = status
        }
        if (search) {
            where.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { contactName: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
            ]
        }
        const clients = await prisma.client.findMany({
            where,
            include: {
                _count: {
                    select: {
                        projects: true,
                        invoices: true,
                    },
                },
                interactions: {
                    orderBy: {
                        date: "desc",
                    },
                    take: 1,
                },
                invoices: {
                    select: {
                        total: true,
                    },
                },
            },
            orderBy: {
                updatedAt: "desc",
            },
        })
        const formattedClients = clients.map((client) => {
            const totalBilled = client.invoices.reduce((sum, invoice) => sum + invoice.total, 0)
            const lastInteraction = client.interactions[0]?.date
                ? new Date(client.interactions[0].date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                })
                : "No interactions yet"

            return {
                id: client.id,
                name: client.name,
                contactName: client.contactName,
                email: client.email,
                phone: client.phone || "",
                address: client.address || "",
                website: client.website || "",
                status: client.status,
                description: client.description || "",
                projects: client._count.projects,
                totalBilled,
                lastInteraction,
                avatar: client.avatar || `/placeholder.svg?height=100&width=100&text=${client.name.charAt(0)}`,
            }
        })
        return NextResponse.json(formattedClients)
    }
    catch (error) {
        console.error("Error fetching clients:", error)
        return NextResponse.json({ error: "Failed to fetch clients" }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const user = await getAuthUser()
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        const body = await request.json()
        const validationResult = clientSchema.safeParse(body)
        if (!validationResult.success) {
            const errors = validationResult.error.format()
            return NextResponse.json({ error: "Validation failed", details: errors }, { status: 400 })
        }
        const { name, contactName, email, phone, website, address, status, description } = validationResult.data
        const existingClient = await prisma.client.findFirst({
            where: { email },
        })
        if (existingClient) {
            return NextResponse.json({ error: "A client with this email already exists" }, { status: 409 })
        }
        const client = await prisma.client.create({
            data: {
                name,
                contactName,
                email,
                phone: phone || null,
                website: website || null,
                address: address || null,
                status,
                description: description || null,
                avatar: `/placeholder.svg?height=100&width=100&text=${name.charAt(0)}`,
            },
        })
        return NextResponse.json(client, { status: 201 })
    } catch (error) {
        console.error("Error creating client:", error)
        return NextResponse.json({ error: "Failed to create client" }, { status: 500 })
    }
}

export { };
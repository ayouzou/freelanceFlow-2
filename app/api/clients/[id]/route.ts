import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"
import { z } from "zod"
import { getAuthUser } from "@/lib/auth"

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
        const id = request.nextUrl.pathname.split("/")[3]
        const client = await prisma.client.findUnique({
            where: { id },
            include: {
                projects: {
                    select: {
                        id: true,
                        name: true,
                        status: true,
                        progress: true,
                        deadline: true,
                        _count: {
                            select: {
                                tasks: true,
                            },
                        },
                    },
                },
                invoices: {
                    select: {
                        id: true,
                        number: true,
                        status: true,
                        date: true,
                        dueDate: true,
                        total: true,
                        project: {
                            select: {
                                name: true,
                            },
                        },
                    },
                    orderBy: {
                        date: "desc",
                    },
                },
                interactions: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                    orderBy: {
                        date: "desc",
                    },
                },
                notes: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                },
                _count: {
                    select: {
                        projects: true,
                        invoices: true,
                    },
                },
            },
        })
        if (!client) {
            return NextResponse.json({ error: "Client not found" }, { status: 404 })
        }
        const totalBilled = client.invoices.reduce((sum, invoice) => sum + invoice.total, 0)
        const lastInteraction = client.interactions[0]?.date
            ? new Date(client.interactions[0].date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
            })
            : "No interactions yet"
        const formattedClient = {
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
            projectsList: client.projects.map((project) => ({
                id: project.id,
                name: project.name,
                status: project.status,
                progress: project.progress,
                deadline: project.deadline ? new Date(project.deadline).toISOString() : null,
                tasks: project._count.tasks,
            })),
            invoicesList: client.invoices.map((invoice) => ({
                id: invoice.id,
                number: invoice.number,
                status: invoice.status,
                date: new Date(invoice.date).toISOString(),
                dueDate: new Date(invoice.dueDate).toISOString(),
                total: invoice.total,
                project: invoice.project?.name || "No project",
            })),
            interactionsList: client.interactions.map((interaction) => ({
                id: interaction.id,
                type: interaction.type,
                summary: interaction.summary,
                notes: interaction.notes || "",
                date: new Date(interaction.date).toISOString(),
                user: {
                    id: interaction.user.id,
                    name: interaction.user.name,
                    email: interaction.user.email,
                },
            })),
            notesList: client.notes.map((note) => ({
                id: note.id,
                content: note.content,
                createdAt: new Date(note.createdAt).toISOString(),
                user: {
                    id: note.user.id,
                    name: note.user.name,
                    email: note.user.email,
                },
            })),
        }
        return NextResponse.json(formattedClient)
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Failed to fetch client" }, { status: 500 })

    }
}

export async function PUT(request: NextRequest) {
    try {
        const user = await getAuthUser()
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        const id = request.nextUrl.pathname.split("/")[3]
        const existingClient = await prisma.client.findUnique({
            where: { id },
        })
        if (!existingClient) {
            return NextResponse.json({ error: "Client not found" }, { status: 404 })
        }
        const body = await request.json()
        const validationResult = clientSchema.safeParse(body)
        if (!validationResult.success) {
            const errors = validationResult.error.format()
            return NextResponse.json({ error: "Validation failed", details: errors }, { status: 400 })
        }
        const { name, contactName, email, phone, website, address, status, description } = validationResult.data
        if (existingClient.email !== email) {
            const emailExists = await prisma.client.findFirst({
                where: {
                    email,
                    id: { not: id },
                },
            })
            if (emailExists) {
                return NextResponse.json({ error: "Email already exists" }, { status: 400 })
            }
        }
        const updatedClient = await prisma.client.update({
            where: { id },
            data: {
                name,
                contactName,
                email,
                phone: phone || null,
                website: website || null,
                address: address || null,
                status,
                description: description || null,
            },
        })
        return NextResponse.json(updatedClient)
    } catch (error) {
        console.error("Error updating client:", error)
        return NextResponse.json({ error: "Failed to update client" }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const user = await getAuthUser()
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        const id = request.nextUrl.pathname.split("/")[3]
        const existingClient = await prisma.client.findUnique({
            where: { id },
            include: {
                projects: true,
                invoices: true,
            },
        })
        if (!existingClient) {
            return NextResponse.json({ error: "Client not found" }, { status: 404 })
        }
        if (existingClient.projects.length > 0 || existingClient.invoices.length > 0) {
            return NextResponse.json(
                {
                    error: "Cannot delete client with associated projects or invoices",
                    details: {
                        projects: existingClient.projects.length,
                        invoices: existingClient.invoices.length,
                    },
                },
                { status: 400 })
        }
        await prisma.clientInteraction.deleteMany({
            where: { clientId: id },
        })

        await prisma.clientNote.deleteMany({
            where: { clientId: id },
        })

        await prisma.client.delete({
            where: { id },
        })
        return new NextResponse(null, { status: 204 })
    } catch (error) {
        console.error("Error deleting client:", error)
        return NextResponse.json({ error: "Failed to delete client" }, { status: 500 })
    }
}
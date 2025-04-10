import { NextResponse } from "next/server"
import { getAuthUser } from "../../../../lib/auth"

export async function GET() {
    console.log("Resolved getAuthUser:", getAuthUser);
  try {
    const user = await getAuthUser()

    if (!user) {
      return NextResponse.json(null, { status: 401 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error fetching current user:", error)
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}


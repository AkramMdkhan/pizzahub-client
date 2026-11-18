import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return NextResponse.json(
      { message: "Server misconfigured" },
      { status: 500 }
    );
  }

  const role = (session.user as { role?: string }).role || "customer";

  const token = await new SignJWT({
    id: session.user.id,
    email: session.user.email,
    role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(new TextEncoder().encode(secret));

  return NextResponse.json({ token });
}
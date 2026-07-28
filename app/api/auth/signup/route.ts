import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/client";
import { hashPassword, MIN_PASSWORD_LENGTH } from "@/lib/password";
import { ensureWorkspaceForUser } from "@/lib/workspace";

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(MIN_PASSWORD_LENGTH),
  name: z.string().trim().min(1).max(80).optional(),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = signupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: `Enter a valid email and a password of at least ${MIN_PASSWORD_LENGTH} characters.`,
      },
      { status: 400 }
    );
  }

  const email = parsed.data.email.trim().toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { success: false, error: "An account with this email already exists." },
      { status: 409 }
    );
  }

  const password = await hashPassword(parsed.data.password);
  const user = await prisma.user.create({
    data: {
      email,
      name: parsed.data.name || email.split("@")[0],
      password,
      emailVerified: new Date(),
    },
  });

  await ensureWorkspaceForUser(user.id, user.email);

  return NextResponse.json({
    success: true,
    data: { id: user.id, email: user.email },
  });
}

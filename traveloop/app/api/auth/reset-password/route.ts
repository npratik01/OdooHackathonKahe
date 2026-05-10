import bcrypt from "bcrypt";
import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { ResetPasswordSchema } from "@/lib/validations/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, ...rest } = body as { token?: string } & Record<
      string,
      unknown
    >;

    // ── Validate token presence ───────────────────────────────────────────────
    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { error: "Reset token is missing or invalid." },
        { status: 400 },
      );
    }

    // ── Validate passwords ─────────────────────────────────────────────────────
    const parsed = ResetPasswordSchema.safeParse(rest);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", issues: parsed.error.flatten().fieldErrors },
        { status: 422 },
      );
    }

    const { password } = parsed.data;

    // ── Look up token by hash ─────────────────────────────────────────────────
    const tokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { tokenHash },
      include: { user: { select: { id: true, email: true } } },
    });

    if (!resetToken) {
      return NextResponse.json(
        { error: "Reset link is invalid or has already been used." },
        { status: 400 },
      );
    }

    // ── Check expiry ───────────────────────────────────────────────────────────
    if (resetToken.expiresAt < new Date()) {
      await prisma.passwordResetToken.delete({
        where: { id: resetToken.id },
      });
      return NextResponse.json(
        {
          error:
            "Reset link has expired. Please request a new password reset.",
        },
        { status: 400 },
      );
    }

    // ── Check already used ─────────────────────────────────────────────────────
    if (resetToken.usedAt) {
      return NextResponse.json(
        { error: "Reset link has already been used." },
        { status: 400 },
      );
    }

    // ── Hash new password & update user atomically ─────────────────────────────
    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetToken.userId },
        data: { passwordHash },
      }),
      prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { usedAt: new Date() },
      }),
    ]);

    return NextResponse.json(
      { message: "Password reset successfully. You can now log in." },
      { status: 200 },
    );
  } catch (err) {
    console.error("[reset-password] Unexpected error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}

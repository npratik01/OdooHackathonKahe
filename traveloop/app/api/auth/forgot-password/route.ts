import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/email";
import { ForgotPasswordSchema } from "@/lib/validations/auth";

const TOKEN_EXPIRY_MS = 60 * 60 * 1000; // 1 hour

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // ── Validate ───────────────────────────────────────────────────────────────
    const parsed = ForgotPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 422 },
      );
    }

    const { email } = parsed.data;
    const normalizedEmail = email.toLowerCase();

    // ── Always return 200 to prevent user enumeration ─────────────────────────
    const successResponse = NextResponse.json(
      {
        message:
          "If an account with that email exists, a password reset link has been sent.",
      },
      { status: 200 },
    );

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true, email: true, passwordHash: true },
    });

    // No user OR user signed up via OAuth only (no password)
    if (!user) return successResponse;

    // ── Generate secure token ─────────────────────────────────────────────────
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");
    const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_MS);

    // ── Invalidate old tokens + create new one ────────────────────────────────
    await prisma.$transaction([
      prisma.passwordResetToken.deleteMany({ where: { userId: user.id } }),
      prisma.passwordResetToken.create({
        data: { userId: user.id, tokenHash, expiresAt },
      }),
    ]);

    // ── Send email (fire-and-forget; errors are logged, not thrown) ───────────
    await sendPasswordResetEmail(user.email, rawToken).catch((err) => {
      console.error("[forgot-password] Email send failed:", err);
    });

    return successResponse;
  } catch (err) {
    console.error("[forgot-password] Unexpected error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}

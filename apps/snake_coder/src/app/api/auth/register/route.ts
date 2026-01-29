import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import prisma from "@/lib/prisma";

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
const NICKNAME_REGEX = /^[A-Za-z0-9_]+$/;

// Registers a new user with basic validation and uniqueness checks.
export async function POST(req: Request) {
  try {
    const { email, password, nickName, firstName, lastName } = await req.json();

    const safeNickName = typeof nickName === "string" ? nickName.trim() : "";

    if (!email || !password || !safeNickName) {
      return NextResponse.json({ error: "Email, password and nickName are required" }, { status: 400 });
    }

    if (!NICKNAME_REGEX.test(safeNickName)) {
      return NextResponse.json({ error: "Invalid nickname" }, { status: 400 });
    }

    if (!PASSWORD_REGEX.test(password)) {
      return NextResponse.json({ error: "Weak password" }, { status: 400 });
    }

    // Reject duplicate email.
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 });
    }

    // Reject duplicate nickname (case-insensitive).
    const existingNick = await prisma.user.findFirst({
      where: {
        nickName: { equals: safeNickName, mode: "insensitive" },
      },
      select: { id: true },
    });
    if (existingNick) {
      return NextResponse.json({ error: "Nickname already exists" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const safeFirstName = typeof firstName === "string" && firstName.trim().length ? firstName.trim() : undefined;
    const safeLastName = typeof lastName === "string" && lastName.trim().length ? lastName.trim() : undefined;
    const displayName = [safeFirstName, safeLastName].filter(Boolean).join(" ").trim() || safeNickName;

    // Create the user with normalized fields and hashed password.
    const user = await prisma.user.create({
      data: {
        email,
        nickName: safeNickName,
        firstName: safeFirstName,
        lastName: safeLastName,
        name: displayName,
        passwordHash,
      },
    });

    return NextResponse.json({ id: user.id, email: user.email, nickName: user.nickName }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

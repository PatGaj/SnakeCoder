import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

// Grants user access to a module if it is not marked as building.
export async function POST(_: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: moduleName } = await params;

  const moduleRecord = await prisma.module.findUnique({
    where: { name: moduleName },
    select: { id: true, isBuilding: true },
  });

  if (!moduleRecord) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (moduleRecord.isBuilding) {
    return NextResponse.json({ error: "Module is building" }, { status: 409 });
  }

  await prisma.userModuleAccess.upsert({
    where: { userId_moduleId: { userId, moduleId: moduleRecord.id } },
    update: { hasAccess: true, startedAt: new Date() },
    create: { userId, moduleId: moduleRecord.id, hasAccess: true, startedAt: new Date() },
  });

  return NextResponse.json({ ok: true });
}

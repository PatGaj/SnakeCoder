import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { isPublicModuleCode } from "@/lib/moduleAccess";

type Params = {
  params: Promise<{
    id: string;
    sprintId: string;
  }>;
};

const mapSprintStatus = (status?: string): "todo" | "inProgress" | "done" => {
  if (status === "DONE") return "done";
  if (status === "IN_PROGRESS") return "inProgress";
  return "todo";
};

const mapMissionType = (type: string): "code" | "bugfix" | "quiz" | "article" => {
  if (type === "BUGFIX") return "bugfix";
  if (type === "QUIZ") return "quiz";
  if (type === "ARTICLE") return "article";
  return "code";
};

const missionRoute = (type: string, id: string) => {
  if (type === "QUIZ") return `/missions/quiz/${id}`;
  if (type === "ARTICLE") return `/missions/article/${id}`;
  return `/missions/task/${id}`;
};

export async function GET(_: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: moduleName, sprintId: sprintName } = await params;

  const moduleRecord = await prisma.module.findUnique({
    where: { name: moduleName },
    select: { id: true, name: true, code: true },
  });

  if (!moduleRecord) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const isPublic = isPublicModuleCode(moduleRecord.code);
  if (!isPublic) {
    const access = await prisma.userModuleAccess.findUnique({
      where: { userId_moduleId: { userId, moduleId: moduleRecord.id } },
      select: { hasAccess: true },
    });

    if (!access?.hasAccess) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  const sprint = await prisma.sprint.findUnique({
    where: { moduleId_name: { moduleId: moduleRecord.id, name: sprintName } },
    select: {
      name: true,
      title: true,
      description: true,
      missions: {
        where: {
          type: { in: ["TASK", "BUGFIX", "QUIZ", "ARTICLE", "SKILL_TEST"] },
        },
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          type: true,
          title: true,
          shortDesc: true,
          description: true,
          requirements: true,
          hints: true,
          etaMinutes: true,
          xp: true,
          progress: {
            where: { userId },
            select: { status: true },
          },
        },
      },
    },
  });

  if (!sprint) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    header: {
      moduleId: moduleRecord.name,
      sprintId: sprint.name,
      title: sprint.title,
      desc: sprint.description,
    },
    tasks: sprint.missions.map((mission) => {
      const progressStatus = mission.progress[0]?.status;
      return {
        id: mission.id,
        title: mission.title,
        shortDesc: mission.shortDesc,
        etaMinutes: mission.etaMinutes,
        xp: mission.xp,
        type: mapMissionType(mission.type),
        status: mapSprintStatus(progressStatus),
        route: missionRoute(mission.type, mission.id),
        details: {
          goal: mission.description,
          requirements: mission.requirements,
          hints: mission.hints,
        },
      };
    }),
  });
}

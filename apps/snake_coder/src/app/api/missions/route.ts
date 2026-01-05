import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

const mapDifficulty = (difficulty: string): "beginner" | "intermediate" | "advanced" => {
  if (difficulty === "INTERMEDIATE") return "intermediate";
  if (difficulty === "ADVANCED") return "advanced";
  return "beginner";
};

const mapProgressStatus = (status?: string): "todo" | "inProgress" | "done" => {
  if (status === "DONE") return "done";
  if (status === "IN_PROGRESS") return "inProgress";
  return "todo";
};

const mapMissionType = (type: string): "task" | "bugfix" | "quiz" | "article" => {
  if (type === "BUGFIX") return "bugfix";
  if (type === "QUIZ") return "quiz";
  if (type === "ARTICLE") return "article";
  return "task";
};

const missionRoute = (type: string, id: string) => {
  if (type === "QUIZ") return `/missions/quiz/${id}`;
  if (type === "ARTICLE") return `/missions/article/${id}`;
  return `/missions/task/${id}`;
};

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const missions = await prisma.mission.findMany({
    where: {
      type: { in: ["TASK", "BUGFIX", "QUIZ", "ARTICLE", "SKILL_TEST"] },
      module: {
        isBuilding: false,
        access: {
          some: { userId, hasAccess: true },
        },
      },
    },
    include: {
      module: {
        select: {
          name: true,
          code: true,
          title: true,
        },
      },
      sprint: {
        select: {
          name: true,
          order: true,
        },
      },
      progress: {
        where: { userId },
        select: { status: true },
      },
    },
    orderBy: [{ module: { code: "asc" } }, { sprint: { order: "asc" } }, { createdAt: "asc" }],
  });

  const payload = missions.map((mission) => {
    const progressStatus = mission.progress[0]?.status;
    return {
      id: mission.id,
      title: mission.title,
      shortDesc: mission.shortDesc,
      moduleId: mission.module.name,
      moduleCode: mission.module.code,
      moduleTitle: mission.module.title,
      sprintId: mission.sprint?.name ?? undefined,
      difficulty: mapDifficulty(mission.difficulty),
      type: mapMissionType(mission.type),
      status: mapProgressStatus(progressStatus),
      etaMinutes: mission.etaMinutes,
      xp: mission.xp,
      route: missionRoute(mission.type, mission.id),
    };
  });

  return NextResponse.json(payload);
}


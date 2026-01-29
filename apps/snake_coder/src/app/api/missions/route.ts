import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { PUBLIC_MODULE_CODES_LIST } from "@/lib/moduleAccess";

// Maps DB difficulty enum to API-friendly label.
const mapDifficulty = (difficulty: string): "beginner" | "intermediate" | "advanced" => {
  if (difficulty === "INTERMEDIATE") return "intermediate";
  if (difficulty === "ADVANCED") return "advanced";
  return "beginner";
};

// Maps mission progress status to UI status.
const mapProgressStatus = (status?: string): "todo" | "inProgress" | "done" => {
  if (status === "DONE") return "done";
  if (status === "IN_PROGRESS") return "inProgress";
  return "todo";
};

// Maps DB mission type to UI type.
const mapMissionType = (type: string): "task" | "bugfix" | "quiz" | "article" => {
  if (type === "BUGFIX") return "bugfix";
  if (type === "QUIZ") return "quiz";
  if (type === "ARTICLE") return "article";
  return "task";
};

// Builds the client route for a mission by type.
const missionRoute = (type: string, id: string) => {
  if (type === "QUIZ") return `/missions/quiz/${id}`;
  if (type === "ARTICLE") return `/missions/article/${id}`;
  return `/missions/task/${id}`;
};

// Returns all missions available to the user with module/sprint metadata and progress.
export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const missions = await prisma.mission.findMany({
    where: {
      type: { in: ["TASK", "BUGFIX", "QUIZ", "ARTICLE"] },
      module: {
        isBuilding: false,
        OR: [
          {
            access: {
              some: { userId, hasAccess: true },
            },
          },
          {
            code: { in: PUBLIC_MODULE_CODES_LIST },
          },
        ],
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

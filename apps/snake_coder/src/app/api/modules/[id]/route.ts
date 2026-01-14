import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

const mapDifficulty = (difficulty: string): "beginner" | "intermediate" | "advanced" => {
  if (difficulty === "INTERMEDIATE") return "intermediate";
  if (difficulty === "ADVANCED") return "advanced";
  return "beginner";
};

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: moduleName } = await params;

  const moduleRecord = await prisma.module.findUnique({
    where: { name: moduleName },
    include: {
      access: {
        where: { userId },
        select: { hasAccess: true, completedAt: true },
      },
      sprints: {
        orderBy: { order: "asc" },
        include: {
          missions: {
            include: {
              progress: {
                where: { userId },
                select: { status: true },
              },
              quiz: {
                include: {
                  questions: { select: { id: true } },
                  attempts: {
                    where: { userId },
                    orderBy: { score: "desc" },
                    take: 1,
                    select: { score: true },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!moduleRecord) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const access = moduleRecord.access[0];
  const building = moduleRecord.isBuilding;
  const hasAccess = Boolean(access?.hasAccess);
  const locked = !building && !hasAccess;

  const sprints = moduleRecord.sprints.map((sprint) => {
    const etaMinutes = sprint.missions.reduce((acc, mission) => acc + mission.etaMinutes, 0);

    const tasks = sprint.missions.filter((m) => m.type === "TASK" || m.type === "BUGFIX" || m.type === "SKILL_TEST");
    const tasksDone = tasks.reduce((acc, m) => acc + (m.progress[0]?.status === "DONE" ? 1 : 0), 0);

    const articles = sprint.missions.filter((m) => m.type === "ARTICLE");
    const articleDone = articles.some((m) => m.progress[0]?.status === "DONE");

    const quizzes = sprint.missions.filter((m) => m.type === "QUIZ" && m.quiz);
    const quizTotal = quizzes.length;
    const quizScore = quizzes.reduce((acc, q) => acc + (q.progress[0]?.status === "DONE" ? 1 : 0), 0);

    const totalMissions = sprint.missions.length;
    const doneMissions = sprint.missions.reduce((acc, m) => acc + (m.progress[0]?.status === "DONE" ? 1 : 0), 0);
    const progressPercent = totalMissions > 0 ? Math.round((doneMissions / totalMissions) * 100) : 0;

    return {
      id: sprint.name,
      sprintNo: sprint.order,
      title: sprint.title,
      desc: sprint.description,
      etaMinutes,
      progressPercent,
      tasksDone,
      tasksTotal: tasks.length,
      articleDone,
      quizScore,
      quizTotal,
      status: "available" as const,
      route: `/modules/${moduleRecord.name}/${sprint.name}`,
    };
  });

  const sprintsTotal = sprints.length;
  const sprintsDone = sprints.filter((s) => s.progressPercent >= 100).length;

  const totalMissions = moduleRecord.sprints.reduce((acc, sprint) => acc + sprint.missions.length, 0);
  const doneMissions = moduleRecord.sprints.reduce((acc, sprint) => {
    return acc + sprint.missions.reduce((inner, m) => inner + (m.progress[0]?.status === "DONE" ? 1 : 0), 0);
  }, 0);
  const progressPercent = totalMissions > 0 ? Math.round((doneMissions / totalMissions) * 100) : 0;

  const completed = Boolean(access?.completedAt) || (sprintsTotal > 0 && sprintsDone >= sprintsTotal);
  const headerStatus = building ? "building" : locked ? "locked" : completed ? "completed" : "available";

  const sprintsWithStatus = building || !hasAccess
    ? sprints.map((s) => ({ ...s, status: "locked" as const }))
    : sprints.map((s, idx) => {
        const prev = sprints[idx - 1];
        const prevDone = idx === 0 ? true : prev.progressPercent >= 100;

        if (!prevDone) return { ...s, status: "locked" as const };
        if (s.progressPercent >= 100) return { ...s, status: "done" as const };
        if (s.progressPercent > 0) return { ...s, status: "inProgress" as const };
        return { ...s, status: "available" as const };
      });

  return NextResponse.json({
    module: {
      id: moduleRecord.name,
      title: moduleRecord.title,
      desc: moduleRecord.description,
      status: headerStatus,
      difficulty: mapDifficulty(moduleRecord.difficulty),
      progressPercent,
      sprintsDone,
      sprintsTotal,
    },
    sprints: sprintsWithStatus,
  });
}

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

const mapCategory = (category: string): "certifications" | "libraries" => {
  if (category === "CERTIFICATIONS") return "certifications";
  return "libraries";
};

const mapDifficulty = (difficulty: string): "beginner" | "intermediate" | "advanced" => {
  if (difficulty === "INTERMEDIATE") return "intermediate";
  if (difficulty === "ADVANCED") return "advanced";
  return "beginner";
};

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const modules = await prisma.module.findMany({
    include: {
      access: {
        where: { userId },
        select: { hasAccess: true, completedAt: true },
      },
      sprints: {
        orderBy: { order: "asc" },
        select: {
          id: true,
          missions: {
            select: {
              id: true,
              progress: {
                where: { userId },
                select: { status: true },
              },
            },
          },
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  const payload = modules.map((module) => {
    const access = module.access[0];
    const building = module.isBuilding;
    const locked = !building && !(access?.hasAccess ?? false);
    const completed = Boolean(access?.completedAt);

    const sprintProgress = module.sprints.map((sprint) => {
      const total = sprint.missions.length;
      const done = sprint.missions.reduce((acc, mission) => {
        const status = mission.progress[0]?.status;
        return acc + (status === "DONE" ? 1 : 0);
      }, 0);

      return {
        id: sprint.id,
        progressPercent: total > 0 ? Math.round((done / total) * 100) : 0,
      };
    });

    const sprintsTotal = sprintProgress.length;
    const sprintsDone = sprintProgress.filter((s) => s.progressPercent >= 100).length;

    const totalMissions = module.sprints.reduce((acc, sprint) => acc + sprint.missions.length, 0);
    const doneMissions = module.sprints.reduce((acc, sprint) => {
      return (
        acc +
        sprint.missions.reduce((inner, mission) => {
          const status = mission.progress[0]?.status;
          return inner + (status === "DONE" ? 1 : 0);
        }, 0)
      );
    }, 0);

    const progressPercent = totalMissions > 0 ? Math.round((doneMissions / totalMissions) * 100) : 0;

    return {
      id: module.id,
      code: module.code,
      title: module.title,
      requirements: module.requirements,
      desc: module.description,
      progressPercent,
      sprints: sprintProgress,
      sprintsDone,
      sprintsTotal,
      category: mapCategory(module.category),
      difficulty: mapDifficulty(module.difficulty),
      locked,
      building,
      completed,
      route: `/modules/${module.id}`,
    };
  });

  return NextResponse.json(payload);
}


import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { PrismaPg } from '@prisma/adapter-pg'

import { PrismaClient } from '../src/generated/prisma/client'

import { basicsSprints } from './basics-content'
import { pcepSprints } from './pcep-content'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({
  adapter,
})

const baseRequirements = ['Zwróć poprawny wynik.']
const baseHints = ['Wykorzystaj podstawowe operacje Pythona.']

const buildTaskTests = (publicCases: Array<[string, string]>, hiddenCases: Array<[string, string]>) => {
  if (publicCases.length !== 3 || hiddenCases.length !== 5) {
    throw new Error('Każde zadanie/bugfix musi mieć 3 testy jawne i 5 ukrytych.')
  }

  return [
    ...publicCases.map((item, index) => ({
      order: index + 1,
      input: item[0],
      expectedOutput: item[1],
      isPublic: true,
    })),
    ...hiddenCases.map((item, index) => ({
      order: index + 4,
      input: item[0],
      expectedOutput: item[1],
      isPublic: false,
    })),
  ]
}

const seedUsers = async () => {
  const plainPassword = 'Test1234!'
  const passwordHash = await bcrypt.hash(plainPassword, 12)

  const demo = await prisma.user.upsert({
    where: { email: 'demo@snakecoder.com' },
    update: {
      nickName: 'demo',
      name: 'Demo User',
      passwordHash,
      xpTotal: 420,
      xpMonth: 180,
      xpToday: 40,
      streakCurrent: 6,
      streakBest: 14,
      gradeAvg: 4.1,
    },
    create: {
      nickName: 'demo',
      name: 'Demo User',
      email: 'demo@snakecoder.com',
      passwordHash,
      xpTotal: 420,
      xpMonth: 180,
      xpToday: 40,
      streakCurrent: 6,
      streakBest: 14,
      gradeAvg: 4.1,
    },
  })

  const test = await prisma.user.upsert({
    where: { email: 'test@test.com' },
    update: {
      nickName: 'test',
      name: 'Test User',
      passwordHash,
      xpTotal: 150,
      xpMonth: 90,
      xpToday: 20,
      streakCurrent: 2,
      streakBest: 5,
      gradeAvg: 3.4,
    },
    create: {
      nickName: 'test',
      name: 'Test User',
      email: 'test@test.com',
      passwordHash,
      xpTotal: 150,
      xpMonth: 90,
      xpToday: 20,
      streakCurrent: 2,
      streakBest: 5,
      gradeAvg: 3.4,
    },
  })

  const bob = await prisma.user.upsert({
    where: { email: 'bob@gmail.com' },
    update: {
      nickName: 'bob',
      name: 'Bob',
      passwordHash,
      xpTotal: 780,
      xpMonth: 320,
      xpToday: 60,
      streakCurrent: 9,
      streakBest: 18,
      gradeAvg: 4.6,
    },
    create: {
      nickName: 'bob',
      name: 'Bob',
      email: 'bob@gmail.com',
      passwordHash,
      xpTotal: 780,
      xpMonth: 320,
      xpToday: 60,
      streakCurrent: 9,
      streakBest: 18,
      gradeAvg: 4.6,
    },
  })

  const rankingUsers = Array.from({ length: 20 }, (_, index) => {
    const rank = index + 1
    const xpTotal = 1200 - rank * 40
    const xpMonth = 320 - rank * 6
    const xpToday = 40 - rank
    const streakCurrent = Math.max(1, 12 - rank)
    const streakBest = 14 + Math.max(0, 6 - rank)
    const gradeAvg = Number((3.0 + (20 - rank) * 0.05).toFixed(2))

    return {
      nickName: `ranker${rank}`,
      name: `Ranker ${rank}`,
      email: `ranker${rank}@snakecoder.com`,
      xpTotal,
      xpMonth,
      xpToday,
      streakCurrent,
      streakBest,
      gradeAvg,
    }
  })

  for (const user of rankingUsers) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        ...user,
        passwordHash,
      },
      create: {
        ...user,
        passwordHash,
      },
    })
  }

  return { demoUserId: demo.id, testUserId: test.id, bobUserId: bob.id }
}

const seedBasicsModule = async () => {
  const moduleRecord = await prisma.module.upsert({
    where: { name: 'basics' },
    update: {
      name: 'basics',
      code: 'BASICS',
      title: 'Podstawy programowania',
      description:
        'Moduł startowy dla osób początkujących: algorytmy, dane, wejście/wyjście, warunki, pętle, listy, napisy i funkcje.',
      requirements: ['Brak wymagań'],
      category: 'CERTIFICATIONS',
      difficulty: 'BEGINNER',
      imagePath: '/images/python-image.png',
      isBuilding: false,
    },
    create: {
      name: 'basics',
      code: 'BASICS',
      title: 'Podstawy programowania',
      description:
        'Moduł startowy dla osób początkujących: algorytmy, dane, wejście/wyjście, warunki, pętle, listy, napisy i funkcje.',
      requirements: ['Brak wymagań'],
      category: 'CERTIFICATIONS',
      difficulty: 'BEGINNER',
      imagePath: '/images/python-image.png',
      isBuilding: false,
    },
  })

  await prisma.mission.deleteMany({ where: { moduleId: moduleRecord.id } })
  await prisma.sprint.deleteMany({ where: { moduleId: moduleRecord.id } })

  const sprintRecords = await Promise.all(
    basicsSprints.map((sprint) =>
      prisma.sprint.create({
        data: {
          moduleId: moduleRecord.id,
          name: sprint.key,
          order: sprint.order,
          title: sprint.title,
          description: sprint.description,
        },
      })
    )
  )

  const sprintIdByName = new Map(sprintRecords.map((sprint) => [sprint.name, sprint.id]))

  for (const sprint of basicsSprints) {
    const sprintId = sprintIdByName.get(sprint.key)
    if (!sprintId) {
      throw new Error(`Missing sprint for ${sprint.key}`)
    }

    for (const [index, task] of sprint.tasks.entries()) {
      const missionId = `${sprint.key}-task-${index + 1}`

      await prisma.mission.create({
        data: {
          id: missionId,
          moduleId: moduleRecord.id,
          sprintId,
          type: 'TASK',
          difficulty: 'BEGINNER',
          title: task.title,
          shortDesc: task.shortDesc,
          description: task.description,
          requirements: task.requirements ?? baseRequirements,
          hints: task.hints ?? baseHints,
          etaMinutes: task.etaMinutes,
          xp: task.xp,
          timeLimitSeconds: task.etaMinutes * 60,
        },
      })

      await prisma.task.create({
        data: {
          missionId,
          starterCode: task.starterCode,
          language: 'python',
        },
      })

      await prisma.taskTestCase.createMany({
        data: buildTaskTests(task.publicTests, task.hiddenTests).map((test) => ({
          taskId: missionId,
          order: test.order,
          input: test.input,
          expectedOutput: test.expectedOutput,
          isPublic: test.isPublic,
        })),
      })
    }

    for (const [index, bugfix] of sprint.bugfixes.entries()) {
      const missionId = `${sprint.key}-bugfix-${index + 1}`

      await prisma.mission.create({
        data: {
          id: missionId,
          moduleId: moduleRecord.id,
          sprintId,
          type: 'BUGFIX',
          difficulty: 'BEGINNER',
          title: bugfix.title,
          shortDesc: bugfix.shortDesc,
          description: bugfix.description,
          requirements: bugfix.requirements ?? baseRequirements,
          hints: bugfix.hints ?? baseHints,
          etaMinutes: bugfix.etaMinutes,
          xp: bugfix.xp,
          timeLimitSeconds: bugfix.etaMinutes * 60,
        },
      })

      await prisma.task.create({
        data: {
          missionId,
          starterCode: bugfix.starterCode,
          language: 'python',
        },
      })

      await prisma.taskTestCase.createMany({
        data: buildTaskTests(bugfix.publicTests, bugfix.hiddenTests).map((test) => ({
          taskId: missionId,
          order: test.order,
          input: test.input,
          expectedOutput: test.expectedOutput,
          isPublic: test.isPublic,
        })),
      })
    }

    for (const [index, quiz] of sprint.quizzes.entries()) {
      const missionId = `${sprint.key}-quiz-${index + 1}`

      await prisma.mission.create({
        data: {
          id: missionId,
          moduleId: moduleRecord.id,
          sprintId,
          type: 'QUIZ',
          difficulty: 'BEGINNER',
          title: quiz.title,
          shortDesc: quiz.shortDesc,
          description: quiz.description,
          requirements: [],
          hints: [],
          etaMinutes: quiz.etaMinutes,
          xp: quiz.xp,
          timeLimitSeconds: quiz.etaMinutes * 60,
          passPercent: 80,
        },
      })

      await prisma.quiz.create({
        data: {
          missionId,
        },
      })

      for (const [questionIndex, question] of quiz.questions.entries()) {
        const questionRecord = await prisma.quizQuestion.create({
          data: {
            quizId: missionId,
            order: questionIndex + 1,
            title: question.title,
            prompt: question.prompt,
          },
        })

        await prisma.quizOption.createMany({
          data: question.options.map((option, optionIndex) => ({
            questionId: questionRecord.id,
            order: optionIndex + 1,
            label: option.label,
            isCorrect: option.isCorrect,
          })),
        })
      }
    }

    for (const [index, article] of sprint.articles.entries()) {
      const articleId = `${sprint.key}-article-${index + 1}`

      await prisma.mission.create({
        data: {
          id: articleId,
          moduleId: moduleRecord.id,
          sprintId,
          type: 'ARTICLE',
          difficulty: 'BEGINNER',
          title: article.title,
          shortDesc: article.shortDesc,
          description: article.description,
          requirements: [],
          hints: [],
          etaMinutes: article.etaMinutes,
          xp: article.xp,
        },
      })

      await prisma.article.create({
        data: {
          missionId: articleId,
          tags: article.tags,
          blocks: article.blocks,
          summary: article.summary,
        },
      })
    }
  }
}

const seedPcepModule = async () => {
  const moduleRecord = await prisma.module.upsert({
    where: { name: 'pcep' },
    update: {
      name: 'pcep',
      code: 'PCEP',
      title: 'PCEP: fundamenty Pythona',
      description:
        'Kompletny kurs PCEP w 5 sprintach: składnia, typy, warunki, pętle, listy, napisy, funkcje, algorytmy i praktyka.',
      requirements: ['Start od zera', 'Podstawy komputera', 'Regularność'],
      category: 'CERTIFICATIONS',
      difficulty: 'BEGINNER',
      imagePath: '/images/python-image.png',
      isBuilding: false,
    },
    create: {
      name: 'pcep',
      code: 'PCEP',
      title: 'PCEP: fundamenty Pythona',
      description:
        'Kompletny kurs PCEP w 5 sprintach: składnia, typy, warunki, pętle, listy, napisy, funkcje, algorytmy i praktyka.',
      requirements: ['Start od zera', 'Podstawy komputera', 'Regularność'],
      category: 'CERTIFICATIONS',
      difficulty: 'BEGINNER',
      imagePath: '/images/python-image.png',
      isBuilding: false,
    },
  })

  await prisma.mission.deleteMany({ where: { moduleId: moduleRecord.id } })
  await prisma.sprint.deleteMany({ where: { moduleId: moduleRecord.id } })

  const sprints = [
    {
      name: 'pcep-1',
      order: 1,
      title: 'Start w Pythonie',
      description: 'Składnia, zmienne, typy i podstawowe operacje na napisach.',
    },
    {
      name: 'pcep-2',
      order: 2,
      title: 'Warunki i pętle',
      description: 'Porównania, logika, pętle oraz praca na listach liczb.',
    },
    {
      name: 'pcep-3',
      order: 3,
      title: 'Listy i napisy',
      description: 'Unikalne wartości, sortowanie, split/replace i palindromy.',
    },
    {
      name: 'pcep-4',
      order: 4,
      title: 'Funkcje i algorytmy',
      description: 'Funkcje, silnia, Fibonacci, teksty i formatowanie danych.',
    },
    {
      name: 'pcep-5',
      order: 5,
      title: 'Powtórka PCEP',
      description: 'Mieszane zadania i utrwalenie kluczowych tematów.',
    },
  ] as const

  const sprintRecords = await Promise.all(
    sprints.map((sprint) =>
      prisma.sprint.create({
        data: {
          moduleId: moduleRecord.id,
          name: sprint.name,
          order: sprint.order,
          title: sprint.title,
          description: sprint.description,
        },
      })
    )
  )

  const sprintIdByName = new Map(sprintRecords.map((sprint) => [sprint.name, sprint.id]))

  for (const sprint of pcepSprints) {
    const sprintId = sprintIdByName.get(sprint.key)
    if (!sprintId) {
      throw new Error(`Missing sprint for ${sprint.key}`)
    }

    for (const [index, task] of sprint.tasks.entries()) {
      const missionId = `${sprint.key}-task-${index + 1}`

      await prisma.mission.create({
        data: {
          id: missionId,
          moduleId: moduleRecord.id,
          sprintId,
          type: 'TASK',
          difficulty: 'BEGINNER',
          title: task.title,
          shortDesc: task.shortDesc,
          description: task.description,
          requirements: task.requirements ?? baseRequirements,
          hints: task.hints ?? baseHints,
          etaMinutes: task.etaMinutes,
          xp: task.xp,
          timeLimitSeconds: task.etaMinutes * 60,
        },
      })

      await prisma.task.create({
        data: {
          missionId,
          starterCode: task.starterCode,
          language: 'python',
        },
      })

      await prisma.taskTestCase.createMany({
        data: buildTaskTests(task.publicTests, task.hiddenTests).map((test) => ({
          taskId: missionId,
          order: test.order,
          input: test.input,
          expectedOutput: test.expectedOutput,
          isPublic: test.isPublic,
        })),
      })
    }

    for (const [index, bugfix] of sprint.bugfixes.entries()) {
      const missionId = `${sprint.key}-bugfix-${index + 1}`

      await prisma.mission.create({
        data: {
          id: missionId,
          moduleId: moduleRecord.id,
          sprintId,
          type: 'BUGFIX',
          difficulty: 'BEGINNER',
          title: bugfix.title,
          shortDesc: bugfix.shortDesc,
          description: bugfix.description,
          requirements: bugfix.requirements ?? baseRequirements,
          hints: bugfix.hints ?? baseHints,
          etaMinutes: bugfix.etaMinutes,
          xp: bugfix.xp,
          timeLimitSeconds: bugfix.etaMinutes * 60,
        },
      })

      await prisma.task.create({
        data: {
          missionId,
          starterCode: bugfix.starterCode,
          language: 'python',
        },
      })

      await prisma.taskTestCase.createMany({
        data: buildTaskTests(bugfix.publicTests, bugfix.hiddenTests).map((test) => ({
          taskId: missionId,
          order: test.order,
          input: test.input,
          expectedOutput: test.expectedOutput,
          isPublic: test.isPublic,
        })),
      })
    }

    for (const [index, quiz] of sprint.quizzes.entries()) {
      const missionId = `${sprint.key}-quiz-${index + 1}`

      await prisma.mission.create({
        data: {
          id: missionId,
          moduleId: moduleRecord.id,
          sprintId,
          type: 'QUIZ',
          difficulty: 'BEGINNER',
          title: quiz.title,
          shortDesc: quiz.shortDesc,
          description: quiz.description,
          requirements: [],
          hints: [],
          etaMinutes: quiz.etaMinutes,
          xp: quiz.xp,
          timeLimitSeconds: quiz.etaMinutes * 60,
          passPercent: 80,
        },
      })

      await prisma.quiz.create({
        data: {
          missionId,
        },
      })

      for (const [questionIndex, question] of quiz.questions.entries()) {
        const questionRecord = await prisma.quizQuestion.create({
          data: {
            quizId: missionId,
            order: questionIndex + 1,
            title: question.title,
            prompt: question.prompt,
          },
        })

        await prisma.quizOption.createMany({
          data: question.options.map((option, optionIndex) => ({
            questionId: questionRecord.id,
            order: optionIndex + 1,
            label: option.label,
            isCorrect: option.isCorrect,
          })),
        })
      }
    }

    for (const [index, article] of sprint.articles.entries()) {
      const articleId = `${sprint.key}-article-${index + 1}`

      await prisma.mission.create({
        data: {
          id: articleId,
          moduleId: moduleRecord.id,
          sprintId,
          type: 'ARTICLE',
          difficulty: 'BEGINNER',
          title: article.title,
          shortDesc: article.shortDesc,
          description: article.description,
          requirements: [],
          hints: [],
          etaMinutes: article.etaMinutes,
          xp: article.xp,
        },
      })

      await prisma.article.create({
        data: {
          missionId: articleId,
          tags: article.tags,
          blocks: article.blocks,
          summary: article.summary,
        },
      })
    }
  }
}

const seedBuildingModules = async () => {
  const modules = [
    {
      name: 'numpy',
      code: 'NUMPY',
      title: 'NumPy: obliczenia numeryczne',
      description: 'Moduł w budowie — wkrótce ćwiczenia z tablic i obliczeń numerycznych.',
      requirements: ['Podstawy Pythona'],
      category: 'LIBRARIES',
      difficulty: 'INTERMEDIATE',
      imagePath: '/images/python-image.png',
      isBuilding: true,
    },
    {
      name: 'pcap',
      code: 'PCAP',
      title: 'PCAP: poziom zaawansowany',
      description: 'Moduł w budowie — obiekty, wyjątki, moduły i dobre praktyki.',
      requirements: ['PCEP lub solidne podstawy Pythona'],
      category: 'CERTIFICATIONS',
      difficulty: 'ADVANCED',
      imagePath: '/images/python-image.png',
      isBuilding: true,
    },
  ] as const

  for (const moduleData of modules) {
    const data = {
      ...moduleData,
      requirements: [...moduleData.requirements],
    }

    await prisma.module.upsert({
      where: { name: moduleData.name },
      update: {
        ...data,
      },
      create: {
        ...data,
      },
    })
  }
}

export async function main() {
  await seedUsers()
  await seedBasicsModule()
  await seedPcepModule()
  await seedBuildingModules()
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

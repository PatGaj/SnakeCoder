import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { PrismaPg } from '@prisma/adapter-pg'

import { PrismaClient } from '../src/generated/prisma/client'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({
  adapter,
})

const seedUsers = async () => {
  const plainPassword = 'Test1234!'
  const passwordHash = await bcrypt.hash(plainPassword, 12)

  const demo = await prisma.user.upsert({
    where: { email: 'demo@snakecoder.com' },
    update: {
      nickName: 'demo',
      name: 'Demo User',
      passwordHash,
    },
    create: {
      nickName: 'demo',
      name: 'Demo User',
      email: 'demo@snakecoder.com',
      passwordHash,
    },
  })

  return { demoUserId: demo.id }
}

const seedPcepModule = async (demoUserId: string) => {
  await prisma.module.upsert({
    where: { id: 'pcep' },
    update: {
      code: 'PCEP',
      title: 'PCEP: fundamenty Pythona',
      description:
        'Zacznij od absolutnych podstaw i ucz się przez krótkie misje. Składnia, typy, warunki, pętle oraz proste funkcje.',
      requirements: ['Start od zera', 'Podstawy komputera', 'Regularność'],
      category: 'CERTIFICATIONS',
      difficulty: 'BEGINNER',
      imagePath: '/images/python-image.png',
      isBuilding: false,
    },
    create: {
      id: 'pcep',
      code: 'PCEP',
      title: 'PCEP: fundamenty Pythona',
      description:
        'Zacznij od absolutnych podstaw i ucz się przez krótkie misje. Składnia, typy, warunki, pętle oraz proste funkcje.',
      requirements: ['Start od zera', 'Podstawy komputera', 'Regularność'],
      category: 'CERTIFICATIONS',
      difficulty: 'BEGINNER',
      imagePath: '/images/python-image.png',
      isBuilding: false,
    },
  })

  await prisma.userModuleAccess.upsert({
    where: { userId_moduleId: { userId: demoUserId, moduleId: 'pcep' } },
    update: { hasAccess: true },
    create: { userId: demoUserId, moduleId: 'pcep', hasAccess: true },
  })

  const sprints = [
    {
      id: 'pcep-1',
      order: 1,
      title: 'Pierwsze kroki i składnia',
      description: 'Zmienne, proste operacje i podstawowe wejście/wyjście.',
      etaMinutes: 18,
    },
    {
      id: 'pcep-2',
      order: 2,
      title: 'Warunki i pętle',
      description: 'if/elif/else, for/while i praktyczne patterny.',
      etaMinutes: 22,
    },
  ] as const

  for (const sprint of sprints) {
    await prisma.sprint.upsert({
      where: { id: sprint.id },
      update: {
        moduleId: 'pcep',
        order: sprint.order,
        title: sprint.title,
        description: sprint.description,
        etaMinutes: sprint.etaMinutes,
      },
      create: {
        id: sprint.id,
        moduleId: 'pcep',
        order: sprint.order,
        title: sprint.title,
        description: sprint.description,
        etaMinutes: sprint.etaMinutes,
      },
    })
  }

  const missions = [
    {
      id: 'pcep-1-task-1',
      sprintId: 'pcep-1',
      type: 'TASK',
      title: 'Powiel znaki w tekście',
      shortDesc: 'Napisz funkcję, która powiela każdy znak (np. "ab" → "aabb").',
      description:
        'Napisz funkcję `solve(text)`, która zwraca tekst, w którym każdy znak jest powtórzony. Zadbaj o poprawny wynik dla pustego tekstu i zwykłych słów.',
      requirements: ['Zachowaj kolejność znaków.', 'Zwróć nowy string.', 'Bez bibliotek zewnętrznych.'],
      hints: ['Najprościej: zbuduj wynik przez join.', 'Pamiętaj o pustym stringu.'],
      etaMinutes: 8,
      xp: 55,
      timeLimitSeconds: 10 * 60,
      task: {
        starterCode: `"""Zadanie:
Zaimplementuj funkcję solve(text), która zwraca tekst,
w którym każdy znak jest powtórzony.

Przykład:
solve("ab") -> "aabb"
"""


def solve(text: str) -> str:
    return ""


if __name__ == "__main__":
    print(solve(input().rstrip("\\n")))
`,
        tests: [
          { order: 1, input: 'hellow', expectedOutput: 'hheellllooww', isPublic: true },
          { order: 2, input: 'world', expectedOutput: 'wwoorrlldd', isPublic: true },
          { order: 3, input: '', expectedOutput: '', isPublic: false },
        ],
      },
    },
    {
      id: 'pcep-1-task-2',
      sprintId: 'pcep-1',
      type: 'TASK',
      title: 'Sumowanie liczb',
      shortDesc: 'Zwróć sumę liczb z listy wejściowej.',
      description:
        'Napisz funkcję `solve(nums)`, która zwraca sumę liczb. Wejściem jest lista intów w jednej linii (oddzielone spacją).',
      requirements: ['Obsłuż pustą listę (wynik 0).', 'Nie używaj bibliotek zewnętrznych.'],
      hints: ['Możesz użyć wbudowanego sum().'],
      etaMinutes: 7,
      xp: 45,
      timeLimitSeconds: 8 * 60,
      task: {
        starterCode: `"""Zadanie:
Zaimplementuj funkcję solve(nums), która zwraca sumę liczb.
"""


def solve(nums: list[int]) -> int:
    return 0


if __name__ == "__main__":
    raw = input().strip()
    nums = [int(x) for x in raw.split()] if raw else []
    print(solve(nums))
`,
        tests: [
          { order: 1, input: '1 2 3', expectedOutput: '6', isPublic: true },
          { order: 2, input: '10 -5 2', expectedOutput: '7', isPublic: true },
          { order: 3, input: '', expectedOutput: '0', isPublic: false },
        ],
      },
    },
    {
      id: 'pcep-1-bugfix-1',
      sprintId: 'pcep-1',
      type: 'BUGFIX',
      title: 'Zły warunek w porównaniu',
      shortDesc: 'Napraw błąd w warunku, przez który wynik jest odwrotny.',
      description:
        'W kodzie jest błąd logiczny: warunek jest odwrócony. Popraw go tak, aby funkcja zwracała True tylko wtedy, gdy liczba jest dodatnia.',
      requirements: ['Zmień tylko to, co konieczne.', 'Przejdź wszystkie testy.'],
      hints: ['Sprawdź znak porównania w if.'],
      etaMinutes: 6,
      xp: 40,
      timeLimitSeconds: 7 * 60,
      task: {
        starterCode: `"""Zadanie:
Napraw funkcję is_positive(n), aby zwracała True dla n > 0.
"""


def is_positive(n: int) -> bool:
    if n < 0:
        return True
    return False


if __name__ == "__main__":
    print(is_positive(int(input().strip())))
`,
        tests: [
          { order: 1, input: '5', expectedOutput: 'True', isPublic: true },
          { order: 2, input: '0', expectedOutput: 'False', isPublic: true },
          { order: 3, input: '-3', expectedOutput: 'False', isPublic: false },
        ],
      },
    },
    {
      id: 'pcep-2-task-1',
      sprintId: 'pcep-2',
      type: 'TASK',
      title: 'Liczby parzyste',
      shortDesc: 'Policz, ile liczb parzystych jest w wejściu.',
      description:
        'Napisz funkcję `solve(nums)`, która zwraca liczbę elementów parzystych w liście. Wejściem jest lista intów w jednej linii.',
      requirements: ['Obsłuż pustą listę (wynik 0).'],
      hints: ['Użyj operatora % 2.'],
      etaMinutes: 8,
      xp: 55,
      timeLimitSeconds: 10 * 60,
      task: {
        starterCode: `"""Zadanie:
Zaimplementuj funkcję solve(nums), która zwraca liczbę parzystych elementów.
"""


def solve(nums: list[int]) -> int:
    return 0


if __name__ == "__main__":
    raw = input().strip()
    nums = [int(x) for x in raw.split()] if raw else []
    print(solve(nums))
`,
        tests: [
          { order: 1, input: '1 2 3 4', expectedOutput: '2', isPublic: true },
          { order: 2, input: '2 2 2', expectedOutput: '3', isPublic: true },
          { order: 3, input: '', expectedOutput: '0', isPublic: false },
        ],
      },
    },
    {
      id: 'pcep-2-bugfix-1',
      sprintId: 'pcep-2',
      type: 'BUGFIX',
      title: 'Błąd w pętli',
      shortDesc: 'Kod nie liczy poprawnie sumy — napraw pętlę.',
      description:
        'W kodzie jest błąd w iteracji: pętla omija jeden element. Popraw ją tak, aby sumowanie działało dla całej listy.',
      requirements: ['Nie zmieniaj struktury programu bardziej niż trzeba.'],
      hints: ['Sprawdź zakres pętli i indeksowanie.'],
      etaMinutes: 7,
      xp: 45,
      timeLimitSeconds: 8 * 60,
      task: {
        starterCode: `"""Zadanie:
Napraw funkcję solve(nums), aby zwracała poprawną sumę listy.
"""


def solve(nums: list[int]) -> int:
    total = 0
    for i in range(0, len(nums) - 1):
        total += nums[i]
    return total


if __name__ == "__main__":
    raw = input().strip()
    nums = [int(x) for x in raw.split()] if raw else []
    print(solve(nums))
`,
        tests: [
          { order: 1, input: '1 2 3', expectedOutput: '6', isPublic: true },
          { order: 2, input: '5', expectedOutput: '5', isPublic: true },
          { order: 3, input: '', expectedOutput: '0', isPublic: false },
        ],
      },
    },
    {
      id: 'pcep-2-task-2',
      sprintId: 'pcep-2',
      type: 'TASK',
      title: 'Największa liczba',
      shortDesc: 'Zwróć największą liczbę z wejścia.',
      description:
        'Napisz funkcję `solve(nums)`, która zwraca największą liczbę z listy. Jeśli lista jest pusta — zwróć 0.',
      requirements: ['Obsłuż pustą listę.', 'Nie używaj bibliotek zewnętrznych.'],
      hints: ['Możesz użyć max(), ale pamiętaj o pustej liście.'],
      etaMinutes: 8,
      xp: 55,
      timeLimitSeconds: 10 * 60,
      task: {
        starterCode: `"""Zadanie:
Zaimplementuj funkcję solve(nums), która zwraca max z listy lub 0, gdy lista jest pusta.
"""


def solve(nums: list[int]) -> int:
    return 0


if __name__ == "__main__":
    raw = input().strip()
    nums = [int(x) for x in raw.split()] if raw else []
    print(solve(nums))
`,
        tests: [
          { order: 1, input: '1 2 3', expectedOutput: '3', isPublic: true },
          { order: 2, input: '-5 -2 -7', expectedOutput: '-2', isPublic: true },
          { order: 3, input: '', expectedOutput: '0', isPublic: false },
        ],
      },
    },
  ] as const

  for (const mission of missions) {
    await prisma.mission.upsert({
      where: { id: mission.id },
      update: {
        moduleId: 'pcep',
        sprintId: mission.sprintId,
        type: mission.type,
        difficulty: 'BEGINNER',
        title: mission.title,
        shortDesc: mission.shortDesc,
        description: mission.description,
        requirements: [...mission.requirements],
        hints: [...mission.hints],
        etaMinutes: mission.etaMinutes,
        xp: mission.xp,
        timeLimitSeconds: mission.timeLimitSeconds,
      },
      create: {
        id: mission.id,
        moduleId: 'pcep',
        sprintId: mission.sprintId,
        type: mission.type,
        difficulty: 'BEGINNER',
        title: mission.title,
        shortDesc: mission.shortDesc,
        description: mission.description,
        requirements: [...mission.requirements],
        hints: [...mission.hints],
        etaMinutes: mission.etaMinutes,
        xp: mission.xp,
        timeLimitSeconds: mission.timeLimitSeconds,
      },
    })

    await prisma.task.upsert({
      where: { missionId: mission.id },
      update: {
        starterCode: mission.task.starterCode,
        language: 'python',
      },
      create: {
        missionId: mission.id,
        starterCode: mission.task.starterCode,
        language: 'python',
      },
    })

    await prisma.taskTestCase.deleteMany({ where: { taskId: mission.id } })
    await prisma.taskTestCase.createMany({
      data: mission.task.tests.map((test) => ({
        taskId: mission.id,
        order: test.order,
        input: test.input,
        expectedOutput: test.expectedOutput,
        isPublic: test.isPublic,
      })),
    })
  }
}

export async function main() {
  const { demoUserId } = await seedUsers()
  await seedPcepModule(demoUserId)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

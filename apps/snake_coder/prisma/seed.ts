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

  return { demoUserId: demo.id, testUserId: test.id, bobUserId: bob.id }
}

const seedPcepModule = async () => {
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

  const quizMissionId = 'pcep-1-quiz-1'
  await prisma.mission.upsert({
    where: { id: quizMissionId },
    update: {
      moduleId: 'pcep',
      sprintId: 'pcep-1',
      type: 'QUIZ',
      difficulty: 'BEGINNER',
      title: 'Quiz: podstawy składni',
      shortDesc: 'Krótki quiz: komentarze, typy i proste operatory.',
      description: 'Odpowiedz na pytania ABCD. Wynik poznasz od razu po zakończeniu.',
      requirements: [],
      hints: [],
      etaMinutes: 6,
      xp: 30,
      timeLimitSeconds: 6 * 60,
      passPercent: 80,
    },
    create: {
      id: quizMissionId,
      moduleId: 'pcep',
      sprintId: 'pcep-1',
      type: 'QUIZ',
      difficulty: 'BEGINNER',
      title: 'Quiz: podstawy składni',
      shortDesc: 'Krótki quiz: komentarze, typy i proste operatory.',
      description: 'Odpowiedz na pytania ABCD. Wynik poznasz od razu po zakończeniu.',
      requirements: [],
      hints: [],
      etaMinutes: 6,
      xp: 30,
      timeLimitSeconds: 6 * 60,
      passPercent: 80,
    },
  })

  await prisma.quiz.upsert({
    where: { missionId: quizMissionId },
    update: {},
    create: { missionId: quizMissionId },
  })

  await prisma.quizOption.deleteMany({
    where: { question: { quizId: quizMissionId } },
  })
  await prisma.quizQuestion.deleteMany({ where: { quizId: quizMissionId } })

  const q1 = await prisma.quizQuestion.create({
    data: {
      quizId: quizMissionId,
      order: 1,
      title: 'Pytanie 1',
      prompt: 'Który zapis jest poprawnym komentarzem w Pythonie?',
    },
  })
  await prisma.quizOption.createMany({
    data: [
      { questionId: q1.id, order: 1, label: '// komentarz', isCorrect: false },
      { questionId: q1.id, order: 2, label: '# komentarz', isCorrect: true },
      { questionId: q1.id, order: 3, label: '/* komentarz */', isCorrect: false },
      { questionId: q1.id, order: 4, label: '<!-- komentarz -->', isCorrect: false },
    ],
  })

  const q2 = await prisma.quizQuestion.create({
    data: {
      quizId: quizMissionId,
      order: 2,
      title: 'Pytanie 2',
      prompt: 'Jaki będzie wynik wyrażenia: 3 * "ab" ?',
    },
  })
  await prisma.quizOption.createMany({
    data: [
      { questionId: q2.id, order: 1, label: '"ababab"', isCorrect: true },
      { questionId: q2.id, order: 2, label: '"ab3"', isCorrect: false },
      { questionId: q2.id, order: 3, label: 'błąd typu', isCorrect: false },
      { questionId: q2.id, order: 4, label: '"ab ab ab"', isCorrect: false },
    ],
  })

  const q3 = await prisma.quizQuestion.create({
    data: {
      quizId: quizMissionId,
      order: 3,
      title: 'Pytanie 3',
      prompt: 'Która wartość jest typu bool w Pythonie?',
    },
  })
  await prisma.quizOption.createMany({
    data: [
      { questionId: q3.id, order: 1, label: '"True"', isCorrect: false },
      { questionId: q3.id, order: 2, label: '1', isCorrect: false },
      { questionId: q3.id, order: 3, label: 'True', isCorrect: true },
      { questionId: q3.id, order: 4, label: 'None', isCorrect: false },
    ],
  })

  const articleMissionId = 'pcep-1-article-1'
  await prisma.mission.upsert({
    where: { id: articleMissionId },
    update: {
      moduleId: 'pcep',
      sprintId: 'pcep-1',
      type: 'ARTICLE',
      difficulty: 'BEGINNER',
      title: 'Artykuł: pierwsze kroki i składnia',
      shortDesc: 'Zmienne, typy i podstawowe wejście/wyjście — szybki wstęp.',
      description: 'Przeczytaj artykuł i zapamiętaj najważniejsze zasady. Przyda się w kolejnych zadaniach.',
      requirements: [],
      hints: [],
      etaMinutes: 7,
      xp: 20,
    },
    create: {
      id: articleMissionId,
      moduleId: 'pcep',
      sprintId: 'pcep-1',
      type: 'ARTICLE',
      difficulty: 'BEGINNER',
      title: 'Artykuł: pierwsze kroki i składnia',
      shortDesc: 'Zmienne, typy i podstawowe wejście/wyjście — szybki wstęp.',
      description: 'Przeczytaj artykuł i zapamiętaj najważniejsze zasady. Przyda się w kolejnych zadaniach.',
      requirements: [],
      hints: [],
      etaMinutes: 7,
      xp: 20,
    },
  })

  await prisma.article.upsert({
    where: { missionId: articleMissionId },
    update: {
      tags: ['PCEP', 'składnia', 'zmienne', 'wejście/wyjście'],
      blocks: [
        { type: 'heading', id: 'wstep', level: 2, text: 'Wstęp' },
        {
          type: 'paragraph',
          text: 'Python to język, w którym czytelność jest bardzo ważna. Zacznij od podstaw: zmienne, typy danych oraz proste operacje na wartościach.',
        },
        { type: 'heading', id: 'zmienne', level: 2, text: 'Zmienne i typy' },
        {
          type: 'paragraph',
          text: 'Zmienne w Pythonie nie wymagają deklarowania typu. Typ wynika z przypisanej wartości. To ułatwia start, ale wymaga uważności.',
        },
        { type: 'code', language: 'python', title: 'Przykład', code: 'name = \"Julia\"\\nage = 18\\nactive = True' },
        {
          type: 'callout',
          tone: 'tip',
          title: 'Tip',
          text: 'Nazwy zmiennych powinny być czytelne. Unikaj skrótów typu x1, z2, tmp.',
        },
        { type: 'heading', id: 'io', level: 2, text: 'Wejście i wyjście' },
        {
          type: 'paragraph',
          text: 'Do pobierania danych używasz input(), a do wypisywania print(). Pamiętaj, że input() zawsze zwraca string — liczby musisz zrzutować.',
        },
        { type: 'code', language: 'python', title: 'input / print', code: 'x = int(input())\\nprint(x * 2)' },
        { type: 'list', items: ['input() zwraca string', 'int()/float() do konwersji', 'print() do outputu'] },
      ],
      summary: ['Zmienne nie wymagają deklaracji typu.', 'input() zwraca string.', 'Dbaj o czytelne nazwy i proste kroki.'],
    },
    create: {
      missionId: articleMissionId,
      tags: ['PCEP', 'składnia', 'zmienne', 'wejście/wyjście'],
      blocks: [
        { type: 'heading', id: 'wstep', level: 2, text: 'Wstęp' },
        {
          type: 'paragraph',
          text: 'Python to język, w którym czytelność jest bardzo ważna. Zacznij od podstaw: zmienne, typy danych oraz proste operacje na wartościach.',
        },
        { type: 'heading', id: 'zmienne', level: 2, text: 'Zmienne i typy' },
        {
          type: 'paragraph',
          text: 'Zmienne w Pythonie nie wymagają deklarowania typu. Typ wynika z przypisanej wartości. To ułatwia start, ale wymaga uważności.',
        },
        { type: 'code', language: 'python', title: 'Przykład', code: 'name = \"Julia\"\\nage = 18\\nactive = True' },
        {
          type: 'callout',
          tone: 'tip',
          title: 'Tip',
          text: 'Nazwy zmiennych powinny być czytelne. Unikaj skrótów typu x1, z2, tmp.',
        },
        { type: 'heading', id: 'io', level: 2, text: 'Wejście i wyjście' },
        {
          type: 'paragraph',
          text: 'Do pobierania danych używasz input(), a do wypisywania print(). Pamiętaj, że input() zawsze zwraca string — liczby musisz zrzutować.',
        },
        { type: 'code', language: 'python', title: 'input / print', code: 'x = int(input())\\nprint(x * 2)' },
        { type: 'list', items: ['input() zwraca string', 'int()/float() do konwersji', 'print() do outputu'] },
      ],
      summary: ['Zmienne nie wymagają deklaracji typu.', 'input() zwraca string.', 'Dbaj o czytelne nazwy i proste kroki.'],
    },
  })
}

export async function main() {
  await seedUsers()
  await seedPcepModule()
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

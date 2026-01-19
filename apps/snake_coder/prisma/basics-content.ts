import type { Prisma } from '../src/generated/prisma/client'

type TaskSeedInput = {
  title: string
  shortDesc: string
  description: string
  etaMinutes: number
  xp: number
  starterCode: string
  publicTests: Array<[string, string]>
  hiddenTests: Array<[string, string]>
  requirements?: string[]
  hints?: string[]
}

type QuizOptionSeed = {
  label: string
  isCorrect: boolean
}

type QuizQuestionSeed = {
  title: string
  prompt: string
  options: QuizOptionSeed[]
}

type QuizSeedInput = {
  title: string
  shortDesc: string
  description: string
  etaMinutes: number
  xp: number
  questions: QuizQuestionSeed[]
}

type ArticleSeedInput = {
  title: string
  shortDesc: string
  description: string
  etaMinutes: number
  xp: number
  tags: string[]
  blocks: Prisma.InputJsonObject[]
  summary: string[]
}

export type BasicsSprintSeedInput = {
  key: string
  order: number
  title: string
  description: string
  tasks: TaskSeedInput[]
  bugfixes: TaskSeedInput[]
  quizzes: QuizSeedInput[]
  articles: ArticleSeedInput[]
}

export const basicsSprints: BasicsSprintSeedInput[] = [
  {
    key: 'basics-1',
    order: 1,
    title: 'Start w programowaniu',
    description: 'Czym jest program, algorytm, dane i podstawowe wejście/wyjście.',
    tasks: [],
    bugfixes: [],
    quizzes: [
      {
        title: 'Quiz: fundamenty programowania',
        shortDesc: 'Program, algorytm i dane.',
        description: 'Sprawdź, czy rozumiesz podstawowe pojęcia.',
        etaMinutes: 8,
        xp: 30,
        questions: [
          {
            title: 'Pytanie 1',
            prompt: 'Czym jest algorytm?',
            options: [
              { label: 'Uporządkowany zestaw kroków prowadzących do celu', isCorrect: true },
              { label: 'Losowy zbiór instrukcji', isCorrect: false },
              { label: 'Język programowania', isCorrect: false },
              { label: 'Błąd w programie', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 2',
            prompt: 'Program to:',
            options: [
              { label: 'Zapis algorytmu w języku zrozumiałym dla komputera', isCorrect: true },
              { label: 'Plik z obrazkami', isCorrect: false },
              { label: 'Wyłącznie aplikacja mobilna', isCorrect: false },
              { label: 'Tylko kod w języku maszynowym', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 3',
            prompt: 'Zmienne służą do:',
            options: [
              { label: 'Przechowywania danych w programie', isCorrect: true },
              { label: 'Ustawiania koloru ekranu', isCorrect: false },
              { label: 'Wyłączania programu', isCorrect: false },
              { label: 'Tworzenia sieci Wi-Fi', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 4',
            prompt: 'Który przykład przedstawia typ tekstowy?',
            options: [
              { label: '"Ala"', isCorrect: true },
              { label: '42', isCorrect: false },
              { label: '3.14', isCorrect: false },
              { label: 'True', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 5',
            prompt: 'Które zdanie jest prawdziwe o input() w Pythonie?',
            options: [
              { label: 'Zawsze zwraca tekst (string)', isCorrect: true },
              { label: 'Zawsze zwraca liczbę', isCorrect: false },
              { label: 'Zwraca True/False', isCorrect: false },
              { label: 'Nie zwraca nic', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 6',
            prompt: 'Co to jest typ danych?',
            options: [
              { label: 'Informacja o rodzaju wartości, np. liczba lub tekst', isCorrect: true },
              { label: 'Sposób rysowania okien', isCorrect: false },
              { label: 'Nazwa programu', isCorrect: false },
              { label: 'Model procesora', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 7',
            prompt: 'Co oznacza błąd składni (syntax error)?',
            options: [
              { label: 'Kod nie spełnia zasad języka', isCorrect: true },
              { label: 'Program działa za wolno', isCorrect: false },
              { label: 'Brakuje internetu', isCorrect: false },
              { label: 'Zbyt mało pamięci RAM', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 8',
            prompt: 'Do czego służy print()?',
            options: [
              { label: 'Do wyświetlania informacji na ekranie', isCorrect: true },
              { label: 'Do pobierania danych z klawiatury', isCorrect: false },
              { label: 'Do zapisu plików PDF', isCorrect: false },
              { label: 'Do uruchamiania kompilatora', isCorrect: false },
            ],
          },
        ],
      },
    ],
    articles: [
      {
        title: 'Artykuł: program i algorytm',
        shortDesc: 'Podstawowe pojęcia bez żargonu.',
        description: 'Dowiedz się, czym jest programowanie i algorytm.',
        etaMinutes: 12,
        xp: 24,
        tags: ['podstawy', 'algorytm', 'programowanie'],
        blocks: [
          { type: 'heading', id: 'wstep', level: 2, text: 'Czym jest programowanie' },
          {
            type: 'paragraph',
            text: 'Programowanie to tworzenie instrukcji, które komputer wykonuje krok po kroku. Komputer nie zgaduje intencji, realizuje dokładnie to, co mu zlecisz.',
          },
          { type: 'heading', id: 'algorytm', level: 2, text: 'Algorytm' },
          {
            type: 'paragraph',
            text: 'Algorytm to uporządkowany zestaw kroków prowadzących do celu. Jest niezależny od języka programowania.',
          },
          {
            type: 'list',
            items: ['Ma jasno określony początek i koniec', 'Składa się z małych kroków', 'Powinien być jednoznaczny'],
          },
          {
            type: 'code',
            language: 'text',
            title: 'Przykład algorytmu (kanapka)',
            code: '1. Weź kromki chleba\n2. Posmaruj masłem\n3. Dodaj ser\n4. Złóż kanapkę',
          },
          { type: 'heading', id: 'program', level: 2, text: 'Program' },
          {
            type: 'paragraph',
            text: 'Program to algorytm zapisany w języku, który rozumie komputer. To instrukcje w konkretnym porządku.',
          },
          {
            type: 'callout',
            tone: 'info',
            title: 'Najważniejsze',
            text: 'Najpierw myślimy o rozwiązaniu (algorytm), potem zapisujemy je w kodzie (program).',
          },
        ],
        summary: ['Algorytm to plan krok po kroku.', 'Program to algorytm zapisany w języku.', 'Komputer wykonuje instrukcje dokładnie.'],
      },
      {
        title: 'Artykuł: dane, zmienne i wejście/wyjście',
        shortDesc: 'Co to są dane i jak z nimi pracować.',
        description: 'Poznaj typy danych, zmienne oraz podstawowe wejście/wyjście.',
        etaMinutes: 14,
        xp: 28,
        tags: ['dane', 'zmienne', 'input', 'output'],
        blocks: [
          { type: 'heading', id: 'dane', level: 2, text: 'Dane i typy' },
          {
            type: 'paragraph',
            text: 'Dane mogą być liczbami, tekstem lub wartościami logicznymi (prawda/fałsz). Typ danych mówi, jak program ma je interpretować.',
          },
          {
            type: 'list',
            items: ['int, liczby całkowite', 'float, liczby z przecinkiem', 'str, tekst', 'bool, True/False'],
          },
          { type: 'heading', id: 'zmienne', level: 2, text: 'Zmienne' },
          {
            type: 'paragraph',
            text: 'Zmienna to nazwa przypisana do wartości. Dzięki temu możemy przechowywać i modyfikować dane.',
          },
          {
            type: 'code',
            language: 'python',
            title: 'Przykład zmiennych',
            code: 'age = 20\nname = "Ola"\nactive = True',
          },
          { type: 'heading', id: 'io', level: 2, text: 'Wejście i wyjście' },
          {
            type: 'paragraph',
            text: 'Wejście to dane podane przez użytkownika. Wyjście to informacje wyświetlane przez program.',
          },
          {
            type: 'code',
            language: 'python',
            title: 'input i print',
            code: 'name = input()\nprint("Cześć", name)',
          },
          {
            type: 'paragraph',
            text: 'input() zwraca tekst. Gdy potrzebujesz liczby, wykonaj konwersję.',
          },
          {
            type: 'code',
            language: 'python',
            title: 'Konwersja na liczbę',
            code: 'age = int(input())\nprint(age + 1)',
          },
          {
            type: 'callout',
            tone: 'info',
            title: 'Uwaga',
            text: 'Program nie zgaduje typu danych, musisz go świadomie ustawić.',
          },
        ],
        summary: ['Dane mają typy (int, float, str, bool).', 'Zmienne przechowują wartości.', 'input() zwraca tekst i wymaga konwersji.'],
      },
    ],
  },
  {
    key: 'basics-2',
    order: 2,
    title: 'Sterowanie przepływem',
    description: 'Warunki, logika i pętle w praktyce.',
    tasks: [],
    bugfixes: [],
    quizzes: [
      {
        title: 'Quiz: warunki i pętle',
        shortDesc: 'Sprawdź podstawy sterowania przepływem.',
        description: 'Pytania o if/else, logikę i pętle.',
        etaMinutes: 8,
        xp: 30,
        questions: [
          {
            title: 'Pytanie 1',
            prompt: 'Który operator oznacza równość?',
            options: [
              { label: '==', isCorrect: true },
              { label: '=', isCorrect: false },
              { label: '!=', isCorrect: false },
              { label: '===', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 2',
            prompt: 'Co oznacza warunek: x > 0 and x < 10?',
            options: [
              { label: 'x jest większe od 0 i mniejsze od 10', isCorrect: true },
              { label: 'x jest mniejsze od 0', isCorrect: false },
              { label: 'x jest równe 10', isCorrect: false },
              { label: 'x jest większe od 10', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 3',
            prompt: 'Który zapis jest poprawnym if-em?',
            options: [
              { label: 'if x == 3:', isCorrect: true },
              { label: 'if x = 3:', isCorrect: false },
              { label: 'if (x == 3)', isCorrect: false },
              { label: 'if x == 3 then', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 4',
            prompt: 'Co zwraca range(3)?',
            options: [
              { label: 'Liczby 0, 1, 2', isCorrect: true },
              { label: 'Liczby 1, 2, 3', isCorrect: false },
              { label: 'Liczby 0, 1, 2, 3', isCorrect: false },
              { label: 'Pustą listę', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 5',
            prompt: 'Do czego służy break?',
            options: [
              { label: 'Przerywa pętlę', isCorrect: true },
              { label: 'Pomija jedną iterację', isCorrect: false },
              { label: 'Zwiększa licznik', isCorrect: false },
              { label: 'Kończy program', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 6',
            prompt: 'Która pętla jest lepsza, gdy liczba iteracji jest znana?',
            options: [
              { label: 'for', isCorrect: true },
              { label: 'while', isCorrect: false },
              { label: 'if', isCorrect: false },
              { label: 'switch', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 7',
            prompt: 'Która wartość jest traktowana jako False?',
            options: [
              { label: '0', isCorrect: true },
              { label: '"0"', isCorrect: false },
              { label: '1', isCorrect: false },
              { label: '"True"', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 8',
            prompt: 'Co oznacza operator not?',
            options: [
              { label: 'Neguje warunek', isCorrect: true },
              { label: 'Dodaje warunki', isCorrect: false },
              { label: 'Mnoży liczby', isCorrect: false },
              { label: 'Zamienia typ na int', isCorrect: false },
            ],
          },
        ],
      },
    ],
    articles: [
      {
        title: 'Artykuł: warunki i logika',
        shortDesc: 'Jak podejmować decyzje w programie.',
        description: 'Poznaj instrukcje warunkowe i operatory logiczne.',
        etaMinutes: 12,
        xp: 24,
        tags: ['warunki', 'logika', 'if'],
        blocks: [
          { type: 'heading', id: 'warunki', level: 2, text: 'Instrukcje warunkowe' },
          {
            type: 'paragraph',
            text: 'Warunki pozwalają programowi podejmować decyzje. Najczęściej używa się if, elif i else.',
          },
          {
            type: 'code',
            language: 'python',
            title: 'Przykład if/elif/else',
            code: 'if x > 0:\n    print("plus")\nelif x == 0:\n    print("zero")\nelse:\n    print("minus")',
          },
          { type: 'heading', id: 'porownania', level: 2, text: 'Porównania' },
          {
            type: 'list',
            items: ['== równość', '!= różne', '<, >, <=, >= porównania liczb'],
          },
          { type: 'heading', id: 'logika', level: 2, text: 'Operatory logiczne' },
          {
            type: 'paragraph',
            text: 'and oznacza "i", or oznacza "lub", a not neguje warunek.',
          },
          {
            type: 'code',
            language: 'python',
            title: 'Łączenie warunków',
            code: 'if age >= 18 and has_id:\n    print("OK")',
          },
          {
            type: 'callout',
            tone: 'info',
            title: 'Truthy/Falsy',
            text: 'Puste wartości (0, "", [], None) są traktowane jako False.',
          },
        ],
        summary: ['if/elif/else steruje decyzjami.', 'Operatory porównują wartości.', 'and/or/not łączą warunki.'],
      },
      {
        title: 'Artykuł: pętle i powtarzanie',
        shortDesc: 'Jak wykonywać kod wiele razy.',
        description: 'Poznaj pętle for/while i funkcję range().',
        etaMinutes: 14,
        xp: 26,
        tags: ['pętle', 'for', 'while', 'range'],
        blocks: [
          { type: 'heading', id: 'petle', level: 2, text: 'Po co są pętle' },
          {
            type: 'paragraph',
            text: 'Pętle pozwalają powtarzać te same instrukcje bez kopiowania kodu.',
          },
          { type: 'heading', id: 'for', level: 2, text: 'Pętla for' },
          {
            type: 'paragraph',
            text: 'for jest używany, gdy znasz liczbę powtórzeń lub iterujesz po kolekcji.',
          },
          {
            type: 'code',
            language: 'python',
            title: 'for + range',
            code: 'for i in range(3):\n    print(i)',
          },
          { type: 'heading', id: 'range', level: 2, text: 'range() w praktyce' },
          {
            type: 'list',
            items: ['range(stop)', 'range(start, stop)', 'range(start, stop, step)'],
          },
          {
            type: 'code',
            language: 'python',
            title: 'Przykłady range',
            code: 'print(list(range(5)))\nprint(list(range(2, 6)))\nprint(list(range(2, 10, 2)))',
          },
          { type: 'heading', id: 'while', level: 2, text: 'Pętla while' },
          {
            type: 'paragraph',
            text: 'while powtarza kod dopóki warunek jest True. Musisz pilnować, by warunek kiedyś przestał być spełniony.',
          },
          {
            type: 'code',
            language: 'python',
            title: 'Przykład while',
            code: 'count = 0\nwhile count < 3:\n    print(count)\n    count += 1',
          },
          { type: 'heading', id: 'break', level: 2, text: 'break i continue' },
          {
            type: 'list',
            items: ['break przerywa pętlę', 'continue pomija bieżącą iterację'],
          },
        ],
        summary: ['Pętle oszczędzają powtarzania kodu.', 'range() generuje kolejne liczby.', 'break/continue kontrolują przebieg.'],
      },
    ],
  },
  {
    key: 'basics-3',
    order: 3,
    title: 'Dane złożone i tekst',
    description: 'Listy, indeksy i podstawowe operacje na napisach.',
    tasks: [],
    bugfixes: [],
    quizzes: [
      {
        title: 'Quiz: listy i napisy',
        shortDesc: 'Podstawowe struktury danych.',
        description: 'Pytania o listy i stringi.',
        etaMinutes: 8,
        xp: 30,
        questions: [
          {
            title: 'Pytanie 1',
            prompt: 'Jaki jest indeks pierwszego elementu listy?',
            options: [
              { label: '0', isCorrect: true },
              { label: '1', isCorrect: false },
              { label: '-1', isCorrect: false },
              { label: '2', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 2',
            prompt: 'Co zwraca len([1, 2, 3])?',
            options: [
              { label: '3', isCorrect: true },
              { label: '2', isCorrect: false },
              { label: '4', isCorrect: false },
              { label: '1', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 3',
            prompt: 'Jak dodać element na koniec listy?',
            options: [
              { label: 'append()', isCorrect: true },
              { label: 'add()', isCorrect: false },
              { label: 'push()', isCorrect: false },
              { label: 'insertEnd()', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 4',
            prompt: 'Co zwraca "a,b".split(",")?',
            options: [
              { label: '["a", "b"]', isCorrect: true },
              { label: '["a,b"]', isCorrect: false },
              { label: '"a b"', isCorrect: false },
              { label: 'Błąd', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 5',
            prompt: 'Co zwraca tekst[1:3]?',
            options: [
              { label: 'Znaki o indeksach 1 i 2', isCorrect: true },
              { label: 'Znaki o indeksach 1 i 3', isCorrect: false },
              { label: 'Cały tekst', isCorrect: false },
              { label: 'Tylko znak o indeksie 3', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 6',
            prompt: 'Jak połączyć listę ["a", "b"] w "a-b"?',
            options: [
              { label: '"-".join(["a", "b"])', isCorrect: true },
              { label: '["a", "b"].join("-")', isCorrect: false },
              { label: '"a-b".split("-")', isCorrect: false },
              { label: '"-".split(["a", "b"])', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 7',
            prompt: 'Czy string można modyfikować znak po znaku?',
            options: [
              { label: 'Nie, stringi są niemutowalne', isCorrect: true },
              { label: 'Tak, zawsze', isCorrect: false },
              { label: 'Tylko w pętli', isCorrect: false },
              { label: 'Tylko dla małych liter', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 8',
            prompt: 'Co zwraca "  hi  ".strip()?',
            options: [
              { label: '"hi"', isCorrect: true },
              { label: '"  hi  "', isCorrect: false },
              { label: '"hi  "', isCorrect: false },
              { label: '"  hi"', isCorrect: false },
            ],
          },
        ],
      },
    ],
    articles: [
      {
        title: 'Artykuł: listy i kolekcje',
        shortDesc: 'Jak przechowywać wiele wartości.',
        description: 'Wprowadzenie do list i pracy z kolekcjami.',
        etaMinutes: 12,
        xp: 24,
        tags: ['listy', 'kolekcje', 'indeksy'],
        blocks: [
          { type: 'heading', id: 'listy', level: 2, text: 'Listy' },
          {
            type: 'paragraph',
            text: 'Lista przechowuje wiele wartości w jednej zmiennej. Jest uporządkowana i indeksowana od 0.',
          },
          {
            type: 'code',
            language: 'python',
            title: 'Tworzenie listy',
            code: 'nums = [1, 2, 3]\nprint(nums[0])  # 1',
          },
          { type: 'heading', id: 'metody', level: 2, text: 'Dodawanie i usuwanie' },
          {
            type: 'code',
            language: 'python',
            title: 'append i pop',
            code: 'nums.append(4)\nnums.pop()  # usuwa ostatni element',
          },
          { type: 'heading', id: 'iteracja', level: 2, text: 'Iteracja po liście' },
          {
            type: 'code',
            language: 'python',
            title: 'for po liście',
            code: 'for n in nums:\n    print(n)',
          },
          {
            type: 'callout',
            tone: 'info',
            title: 'Wskazówka',
            text: 'len(lista) zwraca liczbę elementów w liście.',
          },
        ],
        summary: ['Listy przechowują wiele wartości.', 'Indeksy zaczynają się od 0.', 'append/pop modyfikują listę.'],
      },
      {
        title: 'Artykuł: napisy i operacje tekstowe',
        shortDesc: 'Podstawy pracy z tekstem.',
        description: 'Poznaj najczęstsze operacje na stringach.',
        etaMinutes: 12,
        xp: 24,
        tags: ['napisy', 'string', 'split', 'join'],
        blocks: [
          { type: 'heading', id: 'napisy', level: 2, text: 'Napisy (stringi)' },
          {
            type: 'paragraph',
            text: 'Napis to sekwencja znaków. Możesz pobierać znaki po indeksach i wycinać fragmenty (slicing).',
          },
          {
            type: 'code',
            language: 'python',
            title: 'Indeksy i slicing',
            code: 'text = "python"\nprint(text[0])   # p\nprint(text[1:4]) # yth',
          },
          { type: 'heading', id: 'split', level: 2, text: 'split i join' },
          {
            type: 'code',
            language: 'python',
            title: 'split',
            code: 'words = "a b c".split()\nprint(words)',
          },
          {
            type: 'code',
            language: 'python',
            title: 'join',
            code: 'text = "-".join(["a", "b", "c"])\nprint(text)',
          },
          { type: 'heading', id: 'inne', level: 2, text: 'Inne przydatne metody' },
          {
            type: 'list',
            items: ['strip() usuwa spacje z początku i końca', 'replace() zamienia fragmenty', 'lower()/upper() zmienia wielkość liter'],
          },
        ],
        summary: ['Stringi są indeksowane.', 'split i join konwertują między tekstem a listą.', 'strip/replace upraszczają obróbkę.'],
      },
    ],
  },
  {
    key: 'basics-4',
    order: 4,
    title: 'Funkcje i debugowanie',
    description: 'Rozbijanie problemu i szukanie błędów.',
    tasks: [],
    bugfixes: [],
    quizzes: [
      {
        title: 'Quiz: funkcje i myślenie',
        shortDesc: 'Podstawy funkcji i debugowania.',
        description: 'Sprawdź, czy rozumiesz funkcje i typowe błędy.',
        etaMinutes: 8,
        xp: 30,
        questions: [
          {
            title: 'Pytanie 1',
            prompt: 'Po co używa się funkcji?',
            options: [
              { label: 'Aby porządkować i wielokrotnie używać kodu', isCorrect: true },
              { label: 'Aby spowolnić program', isCorrect: false },
              { label: 'Aby ukryć kod przed komputerem', isCorrect: false },
              { label: 'Aby stworzyć plik tekstowy', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 2',
            prompt: 'Co robi return?',
            options: [
              { label: 'Zwraca wartość i kończy funkcję', isCorrect: true },
              { label: 'Wypisuje tekst', isCorrect: false },
              { label: 'Tworzy pętlę', isCorrect: false },
              { label: 'Resetuje program', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 3',
            prompt: 'Jak wywołać funkcję add z argumentami 2 i 3?',
            options: [
              { label: 'add(2, 3)', isCorrect: true },
              { label: 'add = 2, 3', isCorrect: false },
              { label: 'add(2;3)', isCorrect: false },
              { label: 'call add(2, 3)', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 4',
            prompt: 'Co to jest przypadek brzegowy?',
            options: [
              { label: 'Nietypowa sytuacja, np. pusta lista', isCorrect: true },
              { label: 'Błąd w komputerze', isCorrect: false },
              { label: 'Zawsze poprawny wynik', isCorrect: false },
              { label: 'Nowa funkcja w Pythonie', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 5',
            prompt: 'Który błąd pojawia się, gdy użyjesz niezdefiniowanej zmiennej?',
            options: [
              { label: 'NameError', isCorrect: true },
              { label: 'TypeError', isCorrect: false },
              { label: 'ValueError', isCorrect: false },
              { label: 'IndexError', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 6',
            prompt: 'Co to jest debugowanie?',
            options: [
              { label: 'Proces szukania i naprawiania błędów', isCorrect: true },
              { label: 'Pisanie nowych funkcji', isCorrect: false },
              { label: 'Instalacja Pythona', isCorrect: false },
              { label: 'Kompilowanie programu', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 7',
            prompt: 'Które narzędzie pomaga zrozumieć, co robi program krok po kroku?',
            options: [
              { label: 'print() lub debugger', isCorrect: true },
              { label: 'losowe zgadywanie', isCorrect: false },
              { label: 'usuwanie kodu', isCorrect: false },
              { label: 'zmiana języka', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 8',
            prompt: 'Co oznacza błąd logiczny?',
            options: [
              { label: 'Program działa, ale daje zły wynik', isCorrect: true },
              { label: 'Program się nie uruchamia', isCorrect: false },
              { label: 'Brak internetu', isCorrect: false },
              { label: 'Brak pamięci', isCorrect: false },
            ],
          },
        ],
      },
    ],
    articles: [
      {
        title: 'Artykuł: funkcje i dekompozycja',
        shortDesc: 'Jak dzielić problem na części.',
        description: 'Poznaj funkcje i sposób myślenia o problemach.',
        etaMinutes: 12,
        xp: 24,
        tags: ['funkcje', 'dekompozycja', 'return'],
        blocks: [
          { type: 'heading', id: 'funkcje', level: 2, text: 'Funkcje' },
          {
            type: 'paragraph',
            text: 'Funkcja to nazwany fragment kodu. Ułatwia porządkowanie i wielokrotne użycie.',
          },
          {
            type: 'code',
            language: 'python',
            title: 'Definicja funkcji',
            code: 'def add(a, b):\n    return a + b',
          },
          {
            type: 'code',
            language: 'python',
            title: 'Wywołanie',
            code: 'result = add(2, 3)\nprint(result)',
          },
          { type: 'heading', id: 'dekompozycja', level: 2, text: 'Dekompozycja' },
          {
            type: 'paragraph',
            text: 'Duży problem rozbij na mniejsze kroki i osobne funkcje. To ułatwia testowanie.',
          },
          {
            type: 'list',
            items: ['Nazwij funkcje zgodnie z ich rolą', 'Testuj małe fragmenty', 'Unikaj duplikowania kodu'],
          },
        ],
        summary: ['Funkcje porządkują kod.', 'return zwraca wynik.', 'Dekompozycja ułatwia pracę.'],
      },
      {
        title: 'Artykuł: debugowanie i testowanie',
        shortDesc: 'Jak znaleźć i naprawić błąd.',
        description: 'Najważniejsze techniki debugowania dla początkujących.',
        etaMinutes: 12,
        xp: 24,
        tags: ['debug', 'błędy', 'testy'],
        blocks: [
          { type: 'heading', id: 'bledy', level: 2, text: 'Rodzaje błędów' },
          {
            type: 'list',
            items: ['Błąd składni (syntax error)', 'Błąd wykonania (exception)', 'Błąd logiczny'],
          },
          { type: 'heading', id: 'debug', level: 2, text: 'Debugowanie' },
          {
            type: 'paragraph',
            text: 'Debugowanie to szukanie przyczyny błędu. Najprostsza metoda to wypisywanie wartości zmiennych.',
          },
          {
            type: 'code',
            language: 'python',
            title: 'Print debug',
            code: 'print("x=", x)\nprint("wynik=", result)',
          },
          { type: 'heading', id: 'testy', level: 2, text: 'Testowanie' },
          {
            type: 'paragraph',
            text: 'Testuj przypadki typowe i brzegowe (np. pusta lista, 0, wartości ujemne).',
          },
          {
            type: 'callout',
            tone: 'info',
            title: 'Wskazowka',
            text: 'Jeśli program działa, ale wynik jest zły, szukaj błędu logicznego.',
          },
        ],
        summary: ['Debugowanie to szukanie błędów.', 'Testuj przypadki typowe i brzegowe.', 'Print pomaga zrozumieć program.'],
      },
    ],
  },
]

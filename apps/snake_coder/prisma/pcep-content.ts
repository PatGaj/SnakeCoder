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

export type SprintSeedInput = {
  key: string
  tasks: TaskSeedInput[]
  bugfixes: TaskSeedInput[]
  quizzes: QuizSeedInput[]
  articles: ArticleSeedInput[]
}

const starterCode = {
  textToText: `def solve(text: str) -> str:
    return ""
`,
  textToInt: `def solve(text: str) -> int:
    return 0
`,
  textToBool: `def solve(text: str) -> bool:
    return False
`,
  numsToInt: `def solve(nums: list[int]) -> int:
    return 0
`,
  numsToBool: `def solve(nums: list[int]) -> bool:
    return False
`,
  intToInt: `def solve(n: int) -> int:
    return 0
`,
  intToBool: `def solve(n: int) -> bool:
    return False
`,
  intToText: `def solve(n: int) -> str:
    return ""
`,
  twoIntsToInt: `def solve(a: int, b: int) -> int:
    return 0
`,
}

export const pcepSprints: SprintSeedInput[] = [
  {
    key: 'pcep-1',
    tasks: [
      {
        title: 'Powiel znaki w tekście',
        shortDesc: 'Podwój każdy znak w stringu.',
        description: 'Napisz funkcję `solve(text)`, która zwraca tekst z podwojonymi znakami.',
        etaMinutes: 8,
        xp: 55,
        starterCode: starterCode.textToText,
        publicTests: [
          ['ab', 'aabb'],
          ['hello', 'hheelllloo'],
          ['Snake', 'SSnnaakkee'],
        ],
        hiddenTests: [
          ['', ''],
          ['Python', 'PPyytthhoonn'],
          ['aa', 'aaaa'],
          ['x y', 'xx  yy'],
          ['123', '112233'],
        ],
        requirements: ['Zachowaj kolejność znaków.'],
        hints: ['Przejdź po znakach i doklejaj `ch * 2`.'],
      },
      {
        title: 'Suma dwóch liczb',
        shortDesc: 'Dodaj dwie liczby z wejścia.',
        description: 'Napisz funkcję `solve(a, b)`, która zwraca sumę dwóch liczb całkowitych.',
        etaMinutes: 6,
        xp: 40,
        starterCode: starterCode.twoIntsToInt,
        publicTests: [
          ['2 5', '7'],
          ['-3 10', '7'],
          ['0 0', '0'],
        ],
        hiddenTests: [
          ['100 200', '300'],
          ['-5 -6', '-11'],
          ['7 -2', '5'],
          ['9 1', '10'],
          ['50 -100', '-50'],
        ],
        hints: ['Użyj operatora `+`.'],
      },
      {
        title: 'Długość tekstu',
        shortDesc: 'Zwróć liczbę znaków w tekście.',
        description: 'Zwróć długość wejściowego tekstu (licz też spacje).',
        etaMinutes: 7,
        xp: 45,
        starterCode: starterCode.textToInt,
        publicTests: [
          ['snake', '5'],
          ['Python 3', '8'],
          [' ', '1'],
        ],
        hiddenTests: [
          ['', '0'],
          ['a b c', '5'],
          ['12345', '5'],
          ['hello world', '11'],
          ['snake_coder', '11'],
        ],
        requirements: ['Policz również spacje.'],
        hints: ['Użyj `len(text)`.'],
      },
      {
        title: 'Duże litery',
        shortDesc: 'Zamień tekst na wielkie litery.',
        description: 'Zwróć tekst zamieniony na wielkie litery.',
        etaMinutes: 6,
        xp: 40,
        starterCode: starterCode.textToText,
        publicTests: [
          ['pcep', 'Podstawy Pythona'],
          ['Snake Coder', 'SNAKE CODER'],
          ['abc', 'ABC'],
        ],
        hiddenTests: [
          ['', ''],
          ['Python3', 'PYTHON3'],
          ['MiXeD', 'MIXED'],
          ['a b', 'A B'],
          ['123', '123'],
        ],
        hints: ['Skorzystaj z metody `upper()`.'],
      },
      {
        title: 'Ostatni znak',
        shortDesc: 'Zwróć ostatni znak tekstu.',
        description: 'Zwróć ostatni znak tekstu. Jeśli tekst jest pusty, zwróć pusty string.',
        etaMinutes: 7,
        xp: 45,
        starterCode: starterCode.textToText,
        publicTests: [
          ['python', 'n'],
          ['a', 'a'],
          ['xyz', 'z'],
        ],
        hiddenTests: [
          ['hi!', '!'],
          ['Snake', 'e'],
          ['hello', 'o'],
          ['123', '3'],
          ['ab', 'b'],
        ],
        requirements: ['Dla pustego tekstu zwróć "".'],
        hints: ['Dla niepustego tekstu użyj `text[-1]`.'],
      },
    ],
    bugfixes: [
      {
        title: 'Zły warunek znaku',
        shortDesc: 'Funkcja zwraca True dla liczb ujemnych.',
        description: 'Popraw logikę tak, aby True było tylko dla liczb dodatnich.',
        etaMinutes: 6,
        xp: 40,
        starterCode: `def solve(n: int) -> bool:
    return n < 0
`,
        publicTests: [
          ['5', 'True'],
          ['0', 'False'],
          ['-1', 'False'],
        ],
        hiddenTests: [
          ['10', 'True'],
          ['-5', 'False'],
          ['1', 'True'],
          ['-100', 'False'],
          ['2', 'True'],
        ],
        requirements: ['Popraw tylko logikę warunku.'],
        hints: ['Sprawdź znak porównania.'],
      },
      {
        title: 'Zła operacja na liczbach',
        shortDesc: 'Funkcja odejmuje zamiast dodawać.',
        description: 'Popraw funkcję tak, aby zwracała sumę dwóch liczb.',
        etaMinutes: 6,
        xp: 40,
        starterCode: `def solve(a: int, b: int) -> int:
    return a - b
`,
        publicTests: [
          ['5 2', '7'],
          ['-3 1', '-2'],
          ['0 0', '0'],
        ],
        hiddenTests: [
          ['10 10', '20'],
          ['-5 -5', '-10'],
          ['7 -2', '5'],
          ['100 1', '101'],
          ['-8 3', '-5'],
        ],
        hints: ['Użyj operatora `+`.'],
      },
      {
        title: 'Błąd w długości tekstu',
        shortDesc: 'Funkcja zwraca o 1 mniej.',
        description: 'Popraw obliczanie długości tekstu.',
        etaMinutes: 6,
        xp: 40,
        starterCode: `def solve(text: str) -> int:
    return len(text) - 1
`,
        publicTests: [
          ['abc', '3'],
          ['', '0'],
          ['hello', '5'],
        ],
        hiddenTests: [
          ['a', '1'],
          ['Python', '6'],
          ['12345', '5'],
          ['a b', '3'],
          ['xx', '2'],
        ],
        hints: ['Użyj `len(text)` bez odejmowania.'],
      },
    ],
    quizzes: [
      {
        title: 'Quiz: składnia i I/O',
        shortDesc: 'Komentarze, print i input.',
        description: 'Sprawdź podstawy składni i wejścia/wyjścia.',
        etaMinutes: 6,
        xp: 30,
        questions: [
          {
            title: 'Pytanie 1',
            prompt: 'Która funkcja wypisuje tekst na ekran?',
            options: [
              { label: 'print("Hello")', isCorrect: true },
              { label: 'input("Hello")', isCorrect: false },
              { label: 'echo("Hello")', isCorrect: false },
              { label: 'console.log("Hello")', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 2',
            prompt: 'Jaki znak rozpoczyna komentarz w Pythonie?',
            options: [
              { label: '#', isCorrect: true },
              { label: '//', isCorrect: false },
              { label: '/* */', isCorrect: false },
              { label: '<!-- -->', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 3',
            prompt: 'Co zwraca funkcja input()?',
            options: [
              { label: 'String', isCorrect: true },
              { label: 'Integer', isCorrect: false },
              { label: 'Float', isCorrect: false },
              { label: 'Bool', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 4',
            prompt: 'Który zapis tworzy poprawny f-string z imieniem?',
            options: [
              { label: 'f"Cześć {name}"', isCorrect: true },
              { label: '"Cześć {name}"', isCorrect: false },
              { label: '"fCześć {name}"', isCorrect: false },
              { label: 'format("Cześć {name}")', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 5',
            prompt: 'Co robi parametr sep w print(1, 2, 3, sep="-")?',
            options: [
              { label: 'Wstawia separator między argumentami', isCorrect: true },
              { label: 'Dodaje separator na końcu', isCorrect: false },
              { label: 'Zamienia liczby na stringi', isCorrect: false },
              { label: 'Usuwa spacje po przecinkach', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 6',
            prompt: 'Jak wczytać dwie liczby całkowite z jednej linii?',
            options: [
              { label: 'a, b = map(int, input().split())', isCorrect: true },
              { label: 'a, b = int(input())', isCorrect: false },
              { label: 'a = int(input().split())', isCorrect: false },
              { label: 'a, b = input(int).split()', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 7',
            prompt: 'Jak wypisać tekst bez znaku nowej linii na końcu?',
            options: [
              { label: 'print("A", end="")', isCorrect: true },
              { label: 'print("A", sep="")', isCorrect: false },
              { label: 'print("A", stop="")', isCorrect: false },
              { label: 'print("A", end="\\n")', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 8',
            prompt: 'Ile spacji najczęściej stosuje się na jeden poziom wcięcia w Pythonie?',
            options: [
              { label: '4', isCorrect: true },
              { label: '2', isCorrect: false },
              { label: '8', isCorrect: false },
              { label: '1', isCorrect: false },
            ],
          },
        ],
      },
      {
        title: 'Quiz: typy i operatory',
        shortDesc: 'Typy danych i proste operacje.',
        description: 'Sprawdź wiedzę o typach danych i operatorach.',
        etaMinutes: 6,
        xp: 30,
        questions: [
          {
            title: 'Pytanie 1',
            prompt: 'Jaki będzie wynik wyrażenia: 3 * "ab" ?',
            options: [
              { label: 'ababab', isCorrect: true },
              { label: 'ab3', isCorrect: false },
              { label: 'błąd typu', isCorrect: false },
              { label: 'ab ab ab', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 2',
            prompt: 'Jaki typ zwraca type(3.0)?',
            options: [
              { label: 'float', isCorrect: true },
              { label: 'int', isCorrect: false },
              { label: 'str', isCorrect: false },
              { label: 'bool', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 3',
            prompt: 'Jaki jest wynik True and False?',
            options: [
              { label: 'False', isCorrect: true },
              { label: 'True', isCorrect: false },
              { label: '1', isCorrect: false },
              { label: '0', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 4',
            prompt: 'Jaki będzie wynik 7 // 2?',
            options: [
              { label: '3', isCorrect: true },
              { label: '3.5', isCorrect: false },
              { label: '4', isCorrect: false },
              { label: '2', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 5',
            prompt: 'Jaki będzie wynik 7 % 2?',
            options: [
              { label: '1', isCorrect: true },
              { label: '0', isCorrect: false },
              { label: '2', isCorrect: false },
              { label: '3', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 6',
            prompt: 'Jaki będzie wynik 2 ** 3?',
            options: [
              { label: '8', isCorrect: true },
              { label: '6', isCorrect: false },
              { label: '9', isCorrect: false },
              { label: '5', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 7',
            prompt: 'Co zwraca bool("0")?',
            options: [
              { label: 'True', isCorrect: true },
              { label: 'False', isCorrect: false },
              { label: '0', isCorrect: false },
              { label: '"0"', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 8',
            prompt: 'Jak połączyć napisy "py" i "thon" w "python"?',
            options: [
              { label: '"py" + "thon"', isCorrect: true },
              { label: '"py".add("thon")', isCorrect: false },
              { label: '"py" * "thon"', isCorrect: false },
              { label: 'concat("py", "thon")', isCorrect: false },
            ],
          },
        ],
      },
    ],
    articles: [
      {
        title: 'Artykuł: start w Pythonie',
        shortDesc: 'Składnia, zmienne i podstawowe I/O.',
        description: 'Wprowadzenie do składni Pythona, zmiennych, typów i pracy z input/print.',
        etaMinutes: 10,
        xp: 24,
        tags: ['Podstawy Pythona', 'składnia', 'zmienne', 'wejście/wyjście'],
        blocks: [
          { type: 'heading', id: 'wciecia', level: 2, text: 'Wcięcia i czytelność' },
          {
            type: 'paragraph',
            text: 'Python używa wcięć zamiast nawiasów klamrowych. To wymusza czytelny układ kodu.',
          },
          { type: 'list', items: ['4 spacje na poziom', 'Brak średników', 'Czytelność jest priorytetem'] },
          {
            type: 'paragraph',
            text: 'Wszystkie linie w tym samym bloku muszą mieć identyczne wcięcie. To częsty błąd początkujących.',
          },
          {
            type: 'code',
            language: 'python',
            title: 'Blok kodu',
            code: 'x = 3\nif x > 0:\n    print("plus")\nprint("koniec")',
          },
          { type: 'heading', id: 'komentarze', level: 2, text: 'Komentarze' },
          {
            type: 'code',
            language: 'python',
            title: 'Komentarz jednolinijkowy',
            code: '# To jest komentarz\nprint("Hello")',
          },
          {
            type: 'paragraph',
            text: 'Do opisu funkcji używaj docstringów (potrójne cudzysłowy).',
          },
          {
            type: 'code',
            language: 'python',
            title: 'Docstring',
            code: 'def add(a, b):\n    """Zwraca sumę dwóch liczb."""\n    return a + b',
          },
          { type: 'heading', id: 'zmienne', level: 2, text: 'Zmienne i typy' },
          {
            type: 'paragraph',
            text: 'Typ wynika z wartości. Nie deklarujesz go ręcznie, ale warto pilnować spójności.',
          },
          { type: 'list', items: ['int (np. 10)', 'float (np. 3.14)', 'str (np. "Ala")', 'bool (True/False)'] },
          {
            type: 'list',
            items: [
              'Nazwa może zawierać litery, cyfry i _',
              'Nie może zaczynać się od cyfry',
              'Wielkość liter ma znaczenie (name ≠ Name)',
              'Nie używaj słów kluczowych (np. for, if, class)',
            ],
          },
          {
            type: 'code',
            language: 'python',
            title: 'Przykład',
            code: 'name = "Julia"\nage = 18\nactive = True',
          },
          { type: 'heading', id: 'io', level: 2, text: 'Wejście i wyjście' },
          {
            type: 'paragraph',
            text: 'input() zawsze zwraca string. Gdy potrzebujesz liczby, użyj int() lub float().',
          },
          {
            type: 'code',
            language: 'python',
            title: 'input / print',
            code: 'name = input()\nage = int(input())\nprint(f"Cześć {name}")',
          },
          {
            type: 'code',
            language: 'python',
            title: 'Dwie liczby w jednej linii',
            code: 'a, b = map(int, input().split())\nprint(a + b)',
          },
          {
            type: 'paragraph',
            text: 'print() pozwala ustawić separator i znak końca linii przez parametry sep i end.',
          },
          {
            type: 'code',
            language: 'python',
            title: 'sep i end',
            code: 'print(1, 2, 3, sep="-")\nprint("bez nowej linii", end="")',
          },
          { type: 'heading', id: 'operatory', level: 2, text: 'Operatory i porównania' },
          {
            type: 'list',
            items: ['+ - * / // % **', '== != < <= > >=', 'and / or / not'],
          },
          {
            type: 'paragraph',
            text: 'Pamiętaj: `=` przypisuje wartość, a `==` porównuje.',
          },
          {
            type: 'code',
            language: 'python',
            title: 'Dzielenie i reszta',
            code: 'print(7 / 2)   # 3.5\nprint(7 // 2)  # 3\nprint(7 % 2)   # 1\nprint(2 ** 3)  # 8',
          },
        ],
        summary: [
          'Wcięcia to część składni Pythona.',
          'input() zwraca tekst i wymaga konwersji.',
          'Operatory i porównania to fundament dalszych zadań.',
          'print() i input() to podstawowe narzędzia I/O.',
        ],
      },
      {
        title: 'Artykuł: napisy krok po kroku',
        shortDesc: 'Długość, indeksy, pętle i upper().',
        description: 'Poznaj podstawy pracy ze stringami i przygotuj się do zadań.',
        etaMinutes: 10,
        xp: 24,
        tags: ['Podstawy Pythona', 'napisy', 'len', 'indeksy'],
        blocks: [
          { type: 'heading', id: 'string', level: 2, text: 'Czym jest string' },
          {
            type: 'paragraph',
            text: 'String to sekwencja znaków. Możesz po niej iterować i odczytywać znaki po indeksach.',
          },
          {
            type: 'paragraph',
            text: 'Stringi są niemutowalne, czyli nie da się zmienić pojedynczego znaku w miejscu.',
          },
          {
            type: 'code',
            language: 'python',
            title: 'Niemutowalność',
            code: 'text = "kot"\n# text[0] = "b"  # błąd\ntext = "b" + text[1:]\nprint(text)  # bot',
          },
          { type: 'heading', id: 'len', level: 2, text: 'Długość i indeksy' },
          {
            type: 'code',
            language: 'python',
            title: 'len i indeksy',
            code: 'text = "Python"\nprint(len(text))  # 6\nprint(text[0])    # P\nprint(text[-1])   # n',
          },
          {
            type: 'code',
            language: 'python',
            title: 'Slicing',
            code: 'text = "python"\nprint(text[1:4])  # yth\nprint(text[:3])   # pyt\nprint(text[::2])  # pto',
          },
          {
            type: 'paragraph',
            text: 'Dla pustego tekstu nie możesz użyć text[-1], więc najpierw sprawdź długość.',
          },
          {
            type: 'paragraph',
            text: 'Możesz sprawdzać, czy znak lub fragment występuje w tekście operatorem in.',
          },
          {
            type: 'code',
            language: 'python',
            title: 'Operator in',
            code: 'print("py" in "python")  # True\nprint("z" in "python")   # False',
          },
          { type: 'heading', id: 'iteracja', level: 2, text: 'Iteracja po znakach' },
          {
            type: 'code',
            language: 'python',
            title: 'Powielanie znaków',
            code: 'def solve(text: str) -> str:\n    result = ""\n    for ch in text:\n        result += ch * 2\n    return result',
          },
          { type: 'heading', id: 'upper', level: 2, text: 'Zmiana wielkości liter' },
          {
            type: 'code',
            language: 'python',
            title: 'upper / lower',
            code: 'print("Snake".upper())\nprint("Snake".lower())',
          },
          {
            type: 'paragraph',
            text: 'Popularne metody stringów to: lower(), upper(), strip(), replace(), split().',
          },
          { type: 'heading', id: 'sklejanie', level: 2, text: 'Sklejanie tekstu' },
          {
            type: 'paragraph',
            text: 'Możesz łączyć teksty przez + lub f-stringi: f"Hej {name}".',
          },
        ],
        summary: [
          'len() zwraca liczbę znaków.',
          'Indeks -1 oznacza ostatni znak.',
          'Stringi są niemutowalne.',
          'upper() i lower() zmieniają wielkość liter.',
        ],
      },
      {
        title: 'Artykuł: Python i ekosystem (bonus)',
        shortDesc: 'Skąd się wziął Python i dlaczego jest popularny.',
        description: 'Krótki kontekst historyczny i ekosystem narzędzi.',
        etaMinutes: 7,
        xp: 18,
        tags: ['Podstawy Pythona', 'historia', 'ekosystem'],
        blocks: [
          { type: 'heading', id: 'historia', level: 2, text: 'Historia' },
          {
            type: 'paragraph',
            text: 'Python został stworzony przez Guido van Rossuma i po raz pierwszy wydany w 1991 roku.',
          },
          {
            type: 'paragraph',
            text: 'Przejście z Pythona 2 na 3 uprościło składnię i poprawiło spójność języka.',
          },
          { type: 'heading', id: 'ekosystem', level: 2, text: 'Ekosystem' },
          {
            type: 'paragraph',
            text: 'Pakiety z PyPI pozwalają szybko rozszerzać możliwości języka.',
          },
          { type: 'list', items: ['requests do HTTP', 'numpy do obliczeń', 'pandas do danych', 'pytest do testów'] },
          {
            type: 'paragraph',
            text: 'Pakiety instalujesz przez pip, a projekty warto izolować w wirtualnym środowisku (venv).',
          },
          {
            type: 'code',
            language: 'bash',
            title: 'pip i venv',
            code: 'python -m venv .venv\nsource .venv/bin/activate\npip install requests',
          },
          { type: 'heading', id: 'zen', level: 2, text: 'Zen Pythona' },
          {
            type: 'code',
            language: 'python',
            title: 'Zen of Python',
            code: 'import this',
          },
          {
            type: 'paragraph',
            text: 'Najważniejsze hasło: czytelność ma znaczenie.',
          },
        ],
        summary: [
          'Python ma długą historię i aktywną społeczność.',
          'PyPI to ogromny zbiór bibliotek.',
          'pip i venv ułatwiają pracę z pakietami.',
          'Czytelność jest priorytetem języka.',
        ],
      },
    ],
  },
  {
    key: 'pcep-2',
    tasks: [
      {
        title: 'Policz liczby parzyste',
        shortDesc: 'Zwróć liczbę parzystych elementów listy.',
        description: 'Zwróć liczbę parzystych liczb w liście.',
        etaMinutes: 8,
        xp: 55,
        starterCode: starterCode.numsToInt,
        publicTests: [
          ['1 2 3 4', '2'],
          ['2 2 2', '3'],
          ['', '0'],
        ],
        hiddenTests: [
          ['1 3 5', '0'],
          ['-2 -4 6', '3'],
          ['0 1 2', '2'],
          ['8', '1'],
          ['-1 -2 -3 -4', '2'],
        ],
        requirements: ['Obsłuż pustą listę.'],
        hints: ['Sprawdź parzystość przez `n % 2 == 0`.'],
      },
      {
        title: 'Suma liczb dodatnich',
        shortDesc: 'Zsumuj tylko dodatnie wartości.',
        description: 'Zwróć sumę liczb większych od zera.',
        etaMinutes: 8,
        xp: 55,
        starterCode: starterCode.numsToInt,
        publicTests: [
          ['1 -2 3 4', '8'],
          ['-1 -2', '0'],
          ['5', '5'],
        ],
        hiddenTests: [
          ['0 1 2', '3'],
          ['-5 10 -3', '10'],
          ['', '0'],
          ['7 -1 0', '7'],
          ['2 2 2', '6'],
        ],
        hints: ['Dodawaj tylko wtedy, gdy `n > 0`.'],
      },
      {
        title: 'Największa liczba',
        shortDesc: 'Zwróć największą liczbę z listy.',
        description: 'Zwróć największą liczbę z listy. Gdy lista jest pusta, zwróć 0.',
        etaMinutes: 8,
        xp: 55,
        starterCode: starterCode.numsToInt,
        publicTests: [
          ['1 5 2', '5'],
          ['-3 -2 -7', '-2'],
          ['0', '0'],
        ],
        hiddenTests: [
          ['', '0'],
          ['10 9 8', '10'],
          ['4 4 4', '4'],
          ['-10 -1 -2', '-1'],
          ['100 50', '100'],
        ],
        requirements: ['Dla pustej listy zwróć 0.'],
        hints: ['Ustaw `best` na pierwszy element lub użyj `max`.'],
      },
      {
        title: 'Suma od 1 do n',
        shortDesc: 'Zwróć sumę liczb od 1 do n.',
        description: 'Zwróć sumę liczb od 1 do n. Jeśli n <= 0, zwróć 0.',
        etaMinutes: 8,
        xp: 55,
        starterCode: starterCode.intToInt,
        publicTests: [
          ['5', '15'],
          ['1', '1'],
          ['0', '0'],
        ],
        hiddenTests: [
          ['-3', '0'],
          ['10', '55'],
          ['2', '3'],
          ['7', '28'],
          ['-1', '0'],
        ],
        hints: ['Użyj pętli `for i in range(1, n + 1)`.'],
      },
      {
        title: 'Rok przestępny',
        shortDesc: 'Sprawdź, czy rok jest przestępny.',
        description: 'Zwróć True dla lat przestępnych (dzielnych przez 4, z wyjątkiem setek, chyba że przez 400).',
        etaMinutes: 9,
        xp: 60,
        starterCode: starterCode.intToBool,
        publicTests: [
          ['2024', 'True'],
          ['1900', 'False'],
          ['2000', 'True'],
        ],
        hiddenTests: [
          ['2023', 'False'],
          ['2400', 'True'],
          ['2100', 'False'],
          ['1996', 'True'],
          ['2019', 'False'],
        ],
        hints: ['Najpierw sprawdź podzielność przez 400, potem 100 i 4.'],
      },
    ],
    bugfixes: [
      {
        title: 'Błąd w pętli sumującej',
        shortDesc: 'Pętla pomija ostatni element.',
        description: 'Popraw pętlę tak, aby sumowała wszystkie liczby.',
        etaMinutes: 7,
        xp: 45,
        starterCode: `def solve(nums: list[int]) -> int:
    total = 0
    for i in range(len(nums) - 1):
        total += nums[i]
    return total
`,
        publicTests: [
          ['1 2 3', '6'],
          ['5', '5'],
          ['', '0'],
        ],
        hiddenTests: [
          ['10 10', '20'],
          ['1 1 1 1', '4'],
          ['-1 -2 -3', '-6'],
          ['4 0 6', '10'],
          ['2 3', '5'],
        ],
        hints: ['Zakres w range powinien obejmować ostatni indeks.'],
      },
      {
        title: 'Parzystość działa odwrotnie',
        shortDesc: 'Funkcja zwraca True dla nieparzystych.',
        description: 'Popraw warunek, aby True było dla liczb parzystych.',
        etaMinutes: 6,
        xp: 40,
        starterCode: `def solve(n: int) -> bool:
    return n % 2 == 1
`,
        publicTests: [
          ['2', 'True'],
          ['3', 'False'],
          ['0', 'True'],
        ],
        hiddenTests: [
          ['10', 'True'],
          ['-4', 'True'],
          ['7', 'False'],
          ['-1', 'False'],
          ['8', 'True'],
        ],
        hints: ['Parzyste mają resztę 0.'],
      },
      {
        title: 'Błędne liczenie dodatnich',
        shortDesc: 'Kod liczy wartości <= 0.',
        description: 'Popraw warunek tak, aby liczyć tylko liczby dodatnie.',
        etaMinutes: 6,
        xp: 40,
        starterCode: `def solve(nums: list[int]) -> int:
    count = 0
    for n in nums:
        if n <= 0:
            count += 1
    return count
`,
        publicTests: [
          ['1 -2 3', '2'],
          ['0 1 2', '2'],
          ['-1 -2', '0'],
        ],
        hiddenTests: [
          ['5 5 5', '3'],
          ['-3 4 0', '1'],
          ['', '0'],
          ['7 -7 8', '2'],
          ['1 2 -3 -4', '2'],
        ],
        hints: ['Warunek powinien być `n > 0`.'],
      },
    ],
    quizzes: [
      {
        title: 'Quiz: warunki',
        shortDesc: 'if/elif/else i logika.',
        description: 'Sprawdź podstawy instrukcji warunkowych.',
        etaMinutes: 6,
        xp: 30,
        questions: [
          {
            title: 'Pytanie 1',
            prompt: 'Który operator oznacza "różne"?',
            options: [
              { label: '!=', isCorrect: true },
              { label: '==', isCorrect: false },
              { label: '<=', isCorrect: false },
              { label: '=>', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 2',
            prompt: 'Wartość 0 w warunku if jest traktowana jako:',
            options: [
              { label: 'False', isCorrect: true },
              { label: 'True', isCorrect: false },
              { label: 'Błąd', isCorrect: false },
              { label: 'None', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 3',
            prompt: 'Do czego służy elif?',
            options: [
              { label: 'Do sprawdzenia kolejnego warunku', isCorrect: true },
              { label: 'Do zakończenia programu', isCorrect: false },
              { label: 'Do tworzenia pętli', isCorrect: false },
              { label: 'Do deklarowania zmiennych', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 4',
            prompt: 'Który zapis poprawnie sprawdza, czy x jest w przedziale 1..5?',
            options: [
              { label: '1 <= x <= 5', isCorrect: true },
              { label: 'x > 1 < 5', isCorrect: false },
              { label: '1 < x > 5', isCorrect: false },
              { label: 'x in 1..5', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 5',
            prompt: 'Który operator służy do porównania równości?',
            options: [
              { label: '==', isCorrect: true },
              { label: '=', isCorrect: false },
              { label: '===', isCorrect: false },
              { label: '!=', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 6',
            prompt: 'Co oznacza warunek: n > 0 and n % 2 == 0?',
            options: [
              { label: 'n jest dodatnia i parzysta', isCorrect: true },
              { label: 'n jest dodatnia lub parzysta', isCorrect: false },
              { label: 'n jest ujemna i parzysta', isCorrect: false },
              { label: 'n jest dodatnia i nieparzysta', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 7',
            prompt: 'Która wartość jest traktowana jako False w warunku if?',
            options: [
              { label: '""', isCorrect: true },
              { label: '"0"', isCorrect: false },
              { label: '1', isCorrect: false },
              { label: '"False"', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 8',
            prompt: 'Jak sprawdzić, czy element x jest w liście lista?',
            options: [
              { label: 'x in lista', isCorrect: true },
              { label: 'lista.has(x)', isCorrect: false },
              { label: 'lista.contains(x)', isCorrect: false },
              { label: 'x inside lista', isCorrect: false },
            ],
          },
        ],
      },
      {
        title: 'Quiz: pętle',
        shortDesc: 'for/while i range.',
        description: 'Sprawdź wiedzę o pętlach i iteracji.',
        etaMinutes: 6,
        xp: 30,
        questions: [
          {
            title: 'Pytanie 1',
            prompt: 'Co zwraca range(3)?',
            options: [
              { label: '0, 1, 2', isCorrect: true },
              { label: '1, 2, 3', isCorrect: false },
              { label: '0, 1, 2, 3', isCorrect: false },
              { label: '3, 2, 1', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 2',
            prompt: 'Ile razy wykona się pętla: for i in range(1, 4)?',
            options: [
              { label: '3 razy', isCorrect: true },
              { label: '4 razy', isCorrect: false },
              { label: '2 razy', isCorrect: false },
              { label: '1 raz', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 3',
            prompt: 'Do czego służy break?',
            options: [
              { label: 'Do przerwania pętli', isCorrect: true },
              { label: 'Do pominięcia iteracji', isCorrect: false },
              { label: 'Do rozpoczęcia pętli', isCorrect: false },
              { label: 'Do zmiany zakresu', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 4',
            prompt: 'Do czego służy continue?',
            options: [
              { label: 'Pomija bieżącą iterację pętli', isCorrect: true },
              { label: 'Przerywa pętlę', isCorrect: false },
              { label: 'Restartuje program', isCorrect: false },
              { label: 'Zamyka funkcję', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 5',
            prompt: 'Co zwraca list(range(2, 6))?',
            options: [
              { label: '[2, 3, 4, 5]', isCorrect: true },
              { label: '[2, 3, 4, 5, 6]', isCorrect: false },
              { label: '[1, 2, 3, 4, 5]', isCorrect: false },
              { label: '[3, 4, 5, 6]', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 6',
            prompt: 'Ile razy wykona się pętla: for i in range(0, 10, 2)?',
            options: [
              { label: '5', isCorrect: true },
              { label: '4', isCorrect: false },
              { label: '6', isCorrect: false },
              { label: '10', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 7',
            prompt: 'Która pętla jest lepsza, gdy nie znasz liczby iteracji z góry?',
            options: [
              { label: 'while', isCorrect: true },
              { label: 'for', isCorrect: false },
              { label: 'if', isCorrect: false },
              { label: 'switch', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 8',
            prompt: 'Czy wartość stop w range(start, stop) jest włączona?',
            options: [
              { label: 'Nie, jest niewłączająca', isCorrect: true },
              { label: 'Tak, zawsze jest włączona', isCorrect: false },
              { label: 'Zależy od kroku', isCorrect: false },
              { label: 'Tylko dla liczb parzystych', isCorrect: false },
            ],
          },
        ],
      },
    ],
    articles: [
      {
        title: 'Artykuł: warunki i logika',
        shortDesc: 'Porównania, if/elif/else i operatory logiczne.',
        description: 'Wprowadzenie do instrukcji warunkowych i logiki.',
        etaMinutes: 10,
        xp: 24,
        tags: ['Podstawy Pythona', 'warunki', 'logika'],
        blocks: [
          { type: 'heading', id: 'porownania', level: 2, text: 'Porównania' },
          { type: 'list', items: ['== != < <= > >=', 'Wynikiem porównania jest True/False'] },
          {
            type: 'code',
            language: 'python',
            title: 'Porównanie',
            code: 'x = 5\nprint(x > 3)  # True\nprint(x == 5) # True',
          },
          {
            type: 'paragraph',
            text: 'Możesz łączyć porównania w jednym zapisie (tzw. chain comparisons).',
          },
          {
            type: 'code',
            language: 'python',
            title: 'Łańcuch porównań',
            code: 'x = 7\nprint(0 < x < 10)  # True',
          },
          { type: 'heading', id: 'if', level: 2, text: 'if / elif / else' },
          {
            type: 'code',
            language: 'python',
            title: 'Przykład',
            code: 'if x > 0:\n    print("plus")\nelif x == 0:\n    print("zero")\nelse:\n    print("minus")',
          },
          {
            type: 'paragraph',
            text: 'elif to kolejny warunek sprawdzany tylko wtedy, gdy poprzednie były fałszywe.',
          },
          {
            type: 'code',
            language: 'python',
            title: 'Zagnieżdżone if',
            code: 'if x > 0:\n    if x % 2 == 0:\n        print("dodatnia parzysta")',
          },
          { type: 'heading', id: 'logika', level: 2, text: 'Operatory logiczne' },
          {
            type: 'paragraph',
            text: 'Warunki możesz łączyć operatorem and/or oraz negować przy pomocy not.',
          },
          {
            type: 'code',
            language: 'python',
            title: 'Łączenie warunków',
            code: 'if n > 0 and n % 2 == 0:\n    print("dodatnia parzysta")',
          },
          {
            type: 'paragraph',
            text: 'Kolejność ważności: not, potem and, na końcu or. Dla pewności używaj nawiasów.',
          },
          {
            type: 'callout',
            tone: 'info',
            title: 'Prawda i fałsz',
            text: 'W Pythonie 0 jest traktowane jako False, a każda inna liczba jako True.',
          },
          {
            type: 'callout',
            tone: 'info',
            title: 'Falsy wartości',
            text: 'False, 0, 0.0, "", [], {} oraz None są traktowane jako False w warunku.',
          },
        ],
        summary: [
          'Porównania zwracają True/False.',
          'if/elif/else steruje przepływem.',
          'and/or/not łączy warunki.',
          'Falsy wartości upraszczają sprawdzanie pustych danych.',
        ],
      },
      {
        title: 'Artykuł: pętle i liczniki',
        shortDesc: 'for, while i range w praktyce.',
        description: 'Naucz się iteracji i budowania liczników.',
        etaMinutes: 10,
        xp: 24,
        tags: ['Podstawy Pythona', 'pętle', 'range'],
        blocks: [
          { type: 'heading', id: 'for', level: 2, text: 'Pętla for' },
          {
            type: 'paragraph',
            text: 'for z range pozwala wykonać kod określoną liczbę razy.',
          },
          {
            type: 'paragraph',
            text: 'for działa na dowolnym iterowalnym obiekcie: liście, napisie, zbiorze czy range.',
          },
          {
            type: 'code',
            language: 'python',
            title: 'Suma od 1 do n',
            code: 'total = 0\nfor i in range(1, n + 1):\n    total += i',
          },
          { type: 'heading', id: 'range', level: 2, text: 'range(), podstawy' },
          {
            type: 'paragraph',
            text: 'range() zwraca obiekt range, który generuje kolejne liczby. Nie jest to lista, ale można go z niej stworzyć.',
          },
          {
            type: 'list',
            items: [
              'range(stop), start=0, krok=1',
              'range(start, stop), krok=1',
              'range(start, stop, step), krok może być dodatni lub ujemny',
            ],
          },
          {
            type: 'code',
            language: 'python',
            title: 'Przykłady range',
            code: 'print(list(range(5)))        # [0, 1, 2, 3, 4]\nprint(list(range(2, 6)))     # [2, 3, 4, 5]\nprint(list(range(2, 10, 2))) # [2, 4, 6, 8]',
          },
          {
            type: 'paragraph',
            text: 'W range() warto pamiętać, że stop jest niewłączający (górny zakres nie jest brany).',
          },
          {
            type: 'code',
            language: 'python',
            title: 'Krok ujemny',
            code: 'print(list(range(5, 0, -1)))  # [5, 4, 3, 2, 1]',
          },
          { type: 'heading', id: 'while', level: 2, text: 'Pętla while' },
          {
            type: 'paragraph',
            text: 'while wykonuje kod tak długo, jak warunek jest True. Trzeba aktualizować zmienne, aby nie utknąć w pętli.',
          },
          {
            type: 'code',
            language: 'python',
            title: 'while',
            code: 'count = 0\nwhile count < 3:\n    print(count)\n    count += 1',
          },
          {
            type: 'code',
            language: 'python',
            title: 'Pętla nieskończona z break',
            code: 'while True:\n    text = input()\n    if text == "stop":\n        break',
          },
          { type: 'heading', id: 'break', level: 2, text: 'break i continue' },
          { type: 'list', items: ['break przerywa pętlę', 'continue pomija iterację'] },
          {
            type: 'paragraph',
            text: 'Pętle mogą mieć blok else, który wykona się, gdy pętla zakończy się naturalnie (bez break).',
          },
          {
            type: 'code',
            language: 'python',
            title: 'for-else',
            code: 'for n in nums:\n    if n < 0:\n        break\nelse:\n    print("brak ujemnych")',
          },
        ],
        summary: [
          'range() generuje liczby i ma trzy podstawowe warianty.',
          'Pętle budują liczniki i sumy.',
          'break/continue kontrolują przebieg pętli.',
        ],
      },
      {
        title: 'Artykuł: listy w zadaniach z liczbami',
        shortDesc: 'Iteracja po listach i obsługa pustych danych.',
        description: 'Dowiedz się, jak przechodzić po listach liczb i liczyć wyniki.',
        etaMinutes: 9,
        xp: 22,
        tags: ['Podstawy Pythona', 'listy', 'iteracja'],
        blocks: [
          { type: 'heading', id: 'listy', level: 2, text: 'Listy jako kolekcja liczb' },
          {
            type: 'paragraph',
            text: 'Lista może być pusta, dlatego warto zawsze obsłużyć przypadek bez elementów.',
          },
          {
            type: 'paragraph',
            text: 'Listy są uporządkowane i indeksowane od 0. Możesz je łatwo przeglądać pętlą for.',
          },
          {
            type: 'code',
            language: 'python',
            title: 'Wczytaj listę liczb z wejścia',
            code: 'text = input().strip()\nnums = list(map(int, text.split())) if text else []',
          },
          {
            type: 'code',
            language: 'python',
            title: 'Zlicz parzyste',
            code: 'def solve(nums: list[int]) -> int:\n    count = 0\n    for n in nums:\n        if n % 2 == 0:\n            count += 1\n    return count',
          },
          {
            type: 'code',
            language: 'python',
            title: 'Suma dodatnich',
            code: 'def solve(nums: list[int]) -> int:\n    total = 0\n    for n in nums:\n        if n > 0:\n            total += n\n    return total',
          },
          {
            type: 'paragraph',
            text: 'Wbudowane funkcje sum(), max(), min() ułatwiają liczenie, ale pamiętaj o pustej liście.',
          },
          {
            type: 'code',
            language: 'python',
            title: 'sum i max',
            code: 'total = sum(nums)\nbiggest = max(nums) if nums else 0',
          },
          {
            type: 'callout',
            tone: 'info',
            title: 'Pusta lista',
            text: 'Gdy lista jest pusta, przyjmij 0 jako wynik (np. sumy lub maksimum).',
          },
        ],
        summary: [
          'Po liście najlepiej iterować pętlą for.',
          'Warunek w pętli decyduje, co liczymy.',
          'Pusta lista to osobny przypadek brzegowy.',
          'sum(), min(), max() pomagają w obliczeniach.',
        ],
      },
    ],
  },
  {
    key: 'pcep-3',
    tasks: [
      {
        title: 'Unikalne wartości',
        shortDesc: 'Policz różne liczby w liście.',
        description: 'Zwróć liczbę unikalnych wartości w liście.',
        etaMinutes: 8,
        xp: 55,
        starterCode: starterCode.numsToInt,
        publicTests: [
          ['1 1 2 3 3', '3'],
          ['5 5 5', '1'],
          ['', '0'],
        ],
        hiddenTests: [
          ['1 2 3 4', '4'],
          ['2 2 3 4 4', '3'],
          ['-1 -1 0', '2'],
          ['7', '1'],
          ['1 2 2 3 4 4', '4'],
        ],
        hints: ['Użyj `set(nums)` i policz długość.'],
      },
      {
        title: 'Druga największa liczba',
        shortDesc: 'Zwróć drugi największy różny element.',
        description: 'Zwróć drugi największy różny element. Jeśli jest mniej niż 2 różne liczby, zwróć 0.',
        etaMinutes: 10,
        xp: 70,
        starterCode: starterCode.numsToInt,
        publicTests: [
          ['1 3 2 4', '3'],
          ['5 5 4', '4'],
          ['7', '0'],
        ],
        hiddenTests: [
          ['1 2', '1'],
          ['10 8 9', '9'],
          ['-1 -2 -3', '-2'],
          ['4 4 4', '0'],
          ['2 5 5 4', '4'],
        ],
        hints: ['Usuń duplikaty, posortuj i weź element [-2].'],
      },
      {
        title: 'Palindrom',
        shortDesc: 'Sprawdź, czy tekst jest palindromem.',
        description: 'Zwróć True, jeśli tekst czytany od przodu i od tyłu jest taki sam.',
        etaMinutes: 9,
        xp: 60,
        starterCode: starterCode.textToBool,
        publicTests: [
          ['kajak', 'True'],
          ['python', 'False'],
          ['', 'True'],
        ],
        hiddenTests: [
          ['level', 'True'],
          ['abcba', 'True'],
          ['ab', 'False'],
          ['x', 'True'],
          ['noon', 'True'],
        ],
        hints: ['Porównaj tekst z `text[::-1]`.'],
      },
      {
        title: 'Zamień spacje na podkreślenia',
        shortDesc: 'Każdą spację zamień na znak _.',
        description: 'Zamień każdą spację w tekście na znak `_`.',
        etaMinutes: 7,
        xp: 45,
        starterCode: starterCode.textToText,
        publicTests: [
          ['hello world', 'hello_world'],
          ['a b c', 'a_b_c'],
          ['single', 'single'],
        ],
        hiddenTests: [
          ['', ''],
          ['two  spaces', 'two__spaces'],
          ['snake coder', 'snake_coder'],
          ['a  b', 'a__b'],
          ['hello', 'hello'],
        ],
        hints: ['Użyj `text.replace(" ", "_")`.'],
      },
      {
        title: 'Policz słowa',
        shortDesc: 'Zwróć liczbę słów w tekście.',
        description: 'Zwróć liczbę słów w tekście (słowa oddzielone spacjami).',
        etaMinutes: 7,
        xp: 45,
        starterCode: starterCode.textToInt,
        publicTests: [
          ['ala ma kota', '3'],
          ['jedno', '1'],
          ['', '0'],
        ],
        hiddenTests: [
          ['wiele   spacji', '2'],
          ['python jest super', '3'],
          ['  leading and trailing  ', '3'],
          ['a b c d', '4'],
          ['word', '1'],
        ],
        requirements: ['Wielokrotne spacje traktuj jako jeden separator.'],
        hints: ['Użyj `text.split()` bez argumentów i policz elementy.'],
      },
    ],
    bugfixes: [
      {
        title: 'Odwracanie tekstu nie działa',
        shortDesc: 'Funkcja zwraca wejście bez zmian.',
        description: 'Popraw funkcję tak, aby zwracała odwrócony tekst.',
        etaMinutes: 6,
        xp: 40,
        starterCode: `def solve(text: str) -> str:
    return text
`,
        publicTests: [
          ['abc', 'cba'],
          ['racecar', 'racecar'],
          ['', ''],
        ],
        hiddenTests: [
          ['python', 'nohtyp'],
          ['ab', 'ba'],
          ['123', '321'],
          ['hello world', 'dlrow olleh'],
          ['x', 'x'],
        ],
        hints: ['Użyj `text[::-1]`.'],
      },
      {
        title: 'Samogłoski tylko małe litery',
        shortDesc: 'Kod nie liczy wielkich liter.',
        description: 'Popraw funkcję tak, aby liczyła samogłoski bez rozróżniania wielkości.',
        etaMinutes: 6,
        xp: 40,
        starterCode: `def solve(text: str) -> int:
    count = 0
    for ch in text:
        if ch in 'aeiouy':
            count += 1
    return count
`,
        publicTests: [
          ['hello', '2'],
          ['PYTHON', '2'],
          ['rhythm', '1'],
        ],
        hiddenTests: [
          ['Ala', '2'],
          ['SEED', '2'],
          ['quick', '2'],
          ['Sky', '1'],
          ['', '0'],
        ],
        hints: ['Zamień tekst na lower() lub dodaj wielkie litery do zbioru.'],
      },
      {
        title: 'Cyfry są odejmowane',
        shortDesc: 'Kod odejmuje cyfry zamiast je sumować.',
        description: 'Popraw funkcję tak, aby sumowała cyfry w tekście.',
        etaMinutes: 6,
        xp: 40,
        starterCode: `def solve(text: str) -> int:
    total = 0
    for ch in text:
        if ch.isdigit():
            total -= int(ch)
    return total
`,
        publicTests: [
          ['12045', '12'],
          ['7', '7'],
          ['', '0'],
        ],
        hiddenTests: [
          ['999', '27'],
          ['a1b2', '3'],
          ['000', '0'],
          ['123456', '21'],
          ['5 5', '10'],
        ],
        hints: ['Zmień znak z `-=` na `+=`.'],
      },
    ],
    quizzes: [
      {
        title: 'Quiz: listy',
        shortDesc: 'Indeksy i metody list.',
        description: 'Sprawdź podstawy pracy z listami.',
        etaMinutes: 6,
        xp: 30,
        questions: [
          {
            title: 'Pytanie 1',
            prompt: 'Jak dodać element na koniec listy?',
            options: [
              { label: 'append()', isCorrect: true },
              { label: 'push()', isCorrect: false },
              { label: 'add()', isCorrect: false },
              { label: 'insert()', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 2',
            prompt: 'Jaki jest indeks pierwszego elementu listy?',
            options: [
              { label: '0', isCorrect: true },
              { label: '1', isCorrect: false },
              { label: '-1', isCorrect: false },
              { label: '2', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 3',
            prompt: 'Ile zwraca len([1, 2, 3])?',
            options: [
              { label: '3', isCorrect: true },
              { label: '2', isCorrect: false },
              { label: '4', isCorrect: false },
              { label: '1', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 4',
            prompt: 'Co zwraca metoda lista.pop() bez argumentu?',
            options: [
              { label: 'Usuwa i zwraca ostatni element', isCorrect: true },
              { label: 'Usuwa pierwszy element', isCorrect: false },
              { label: 'Zwraca długość listy', isCorrect: false },
              { label: 'Zwraca None', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 5',
            prompt: 'Jak wstawić element x na indeks 1?',
            options: [
              { label: 'lista.insert(1, x)', isCorrect: true },
              { label: 'lista.append(1, x)', isCorrect: false },
              { label: 'lista.add(1, x)', isCorrect: false },
              { label: 'lista.put(1, x)', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 6',
            prompt: 'Jaki będzie wynik: [1, 2] + [3]?',
            options: [
              { label: '[1, 2, 3]', isCorrect: true },
              { label: '[1, 2, 3, 3]', isCorrect: false },
              { label: '[1, 2][3]', isCorrect: false },
              { label: 'Błąd', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 7',
            prompt: 'Jak usunąć pierwszy element równy 7 z listy?',
            options: [
              { label: 'lista.remove(7)', isCorrect: true },
              { label: 'lista.pop(7)', isCorrect: false },
              { label: 'del lista[7]', isCorrect: false },
              { label: 'lista.delete(7)', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 8',
            prompt: 'Co zwraca lista[1:3] dla lista = [10, 20, 30, 40]?',
            options: [
              { label: '[20, 30]', isCorrect: true },
              { label: '[10, 20, 30]', isCorrect: false },
              { label: '[30, 40]', isCorrect: false },
              { label: '20', isCorrect: false },
            ],
          },
        ],
      },
      {
        title: 'Quiz: napisy',
        shortDesc: 'split, join i upper.',
        description: 'Sprawdź podstawowe operacje na stringach.',
        etaMinutes: 6,
        xp: 30,
        questions: [
          {
            title: 'Pytanie 1',
            prompt: 'Co zwróci "a,b,c".split(",")?',
            options: [
              { label: '["a", "b", "c"]', isCorrect: true },
              { label: '["a,b,c"]', isCorrect: false },
              { label: '"a b c"', isCorrect: false },
              { label: 'Błąd', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 2',
            prompt: 'Jaki będzie wynik "python".upper()? ',
            options: [
              { label: 'PYTHON', isCorrect: true },
              { label: 'Python', isCorrect: false },
              { label: 'python', isCorrect: false },
              { label: 'PYthon', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 3',
            prompt: 'Co zwraca tekst[1:3]?',
            options: [
              { label: 'Znaki o indeksach 1 i 2', isCorrect: true },
              { label: 'Znaki o indeksach 1 i 3', isCorrect: false },
              { label: 'Cały tekst', isCorrect: false },
              { label: 'Tylko znak o indeksie 3', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 4',
            prompt: 'Co zwraca "  hi  ".strip()?',
            options: [
              { label: '"hi"', isCorrect: true },
              { label: '"  hi  "', isCorrect: false },
              { label: '"hi  "', isCorrect: false },
              { label: '"  hi"', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 5',
            prompt: 'Jak zamienić wszystkie spacje w tekście na "_"?',
            options: [
              { label: 'text.replace(" ", "_")', isCorrect: true },
              { label: 'text.split(" ")', isCorrect: false },
              { label: 'text.strip(" ")', isCorrect: false },
              { label: 'text.join("_")', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 6',
            prompt: 'Co zwraca "a-b-c".split("-")?',
            options: [
              { label: '["a", "b", "c"]', isCorrect: true },
              { label: '["a-b-c"]', isCorrect: false },
              { label: '"a b c"', isCorrect: false },
              { label: 'Błąd', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 7',
            prompt: 'Jak połączyć ["a", "b"] w "a,b"?',
            options: [
              { label: '",".join(["a", "b"])', isCorrect: true },
              { label: '"a,b".split(",")', isCorrect: false },
              { label: '["a", "b"].join(",")', isCorrect: false },
              { label: '",".split(["a", "b"])', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 8',
            prompt: 'Co zwraca "7".isdigit()?',
            options: [
              { label: 'True', isCorrect: true },
              { label: 'False', isCorrect: false },
              { label: '"7"', isCorrect: false },
              { label: '7', isCorrect: false },
            ],
          },
        ],
      },
    ],
    articles: [
      {
        title: 'Artykuł: listy w praktyce',
        shortDesc: 'Indeksy, sortowanie i unikalne wartości.',
        description: 'Poznaj podstawy list i sposoby pracy z unikalnymi elementami.',
        etaMinutes: 10,
        xp: 24,
        tags: ['Podstawy Pythona', 'listy', 'set', 'sortowanie'],
        blocks: [
          { type: 'heading', id: 'indeksy', level: 2, text: 'Indeksy i duplikaty' },
          {
            type: 'paragraph',
            text: 'Listy przechowują wiele wartości. Mogą zawierać duplikaty.',
          },
          {
            type: 'code',
            language: 'python',
            title: 'Podstawy list',
            code: 'nums = [3, 1, 3]\nprint(nums[0])   # 3\nprint(len(nums)) # 3',
          },
          {
            type: 'paragraph',
            text: 'Listy możesz modyfikować przez append, insert, pop i remove.',
          },
          {
            type: 'code',
            language: 'python',
            title: 'Modyfikacja listy',
            code: 'nums.append(5)\nnums.insert(1, 9)\nnums.pop()\nnums.remove(9)',
          },
          { type: 'heading', id: 'set', level: 2, text: 'Unikalne wartości' },
          {
            type: 'code',
            language: 'python',
            title: 'Unikalne elementy',
            code: 'def solve(nums: list[int]) -> int:\n    return len(set(nums))',
          },
          {
            type: 'paragraph',
            text: 'set usuwa duplikaty, ale nie zachowuje kolejności elementów.',
          },
          { type: 'heading', id: 'sort', level: 2, text: 'Sortowanie i druga największa' },
          {
            type: 'paragraph',
            text: 'sorted() zwraca nową listę, a list.sort() sortuje listę w miejscu.',
          },
          {
            type: 'code',
            language: 'python',
            title: 'sorted vs sort',
            code: 'nums = [3, 1, 2]\nprint(sorted(nums))  # [1, 2, 3]\nnums.sort()\nprint(nums)          # [1, 2, 3]',
          },
          {
            type: 'code',
            language: 'python',
            title: 'Druga największa',
            code: 'def solve(nums: list[int]) -> int:\n    uniq = sorted(set(nums))\n    if len(uniq) < 2:\n        return 0\n    return uniq[-2]',
          },
          {
            type: 'callout',
            tone: 'info',
            title: 'Uwaga',
            text: 'set usuwa duplikaty, ale nie zachowuje kolejności.',
          },
        ],
        summary: [
          'Listy są indeksowane i mają metody modyfikacji.',
          'set() usuwa duplikaty.',
          'sorted() porządkuje dane, a sort() działa w miejscu.',
        ],
      },
      {
        title: 'Artykuł: split, strip, join i replace',
        shortDesc: 'Dzielenie i składanie napisów.',
        description: 'Naucz się pracować z tekstem przy pomocy metod string.',
        etaMinutes: 10,
        xp: 24,
        tags: ['Podstawy Pythona', 'napisy', 'split', 'join', 'replace'],
        blocks: [
          { type: 'heading', id: 'split', level: 2, text: 'split() i białe znaki' },
          {
            type: 'paragraph',
            text: 'split() bez argumentów dzieli po dowolnych białych znakach i ignoruje wielokrotne spacje.',
          },
          {
            type: 'paragraph',
            text: 'Jeśli podasz separator, split() dzieli dokładnie po nim (np. przecinek).',
          },
          {
            type: 'code',
            language: 'python',
            title: 'split() bez argumentu',
            code: 'text = "a  b   c"\nwords = text.split()\nprint(words)  # ["a", "b", "c"]',
          },
          {
            type: 'code',
            language: 'python',
            title: 'split() z separatorem',
            code: 'csv = "a,b,c"\nprint(csv.split(","))  # ["a", "b", "c"]',
          },
          {
            type: 'paragraph',
            text: 'maxsplit ogranicza liczbę podziałów.',
          },
          {
            type: 'code',
            language: 'python',
            title: 'maxsplit',
            code: 'text = "a b c d"\nprint(text.split(maxsplit=1))  # ["a", "b c d"]',
          },
          { type: 'heading', id: 'strip', level: 2, text: 'strip()' },
          {
            type: 'paragraph',
            text: 'strip() usuwa spacje z początku i końca tekstu.',
          },
          {
            type: 'paragraph',
            text: 'Możesz podać znaki do usunięcia, np. kropki lub myślniki.',
          },
          {
            type: 'code',
            language: 'python',
            title: 'strip()',
            code: 'text = "  hello  "\nprint(text.strip())  # "hello"',
          },
          {
            type: 'code',
            language: 'python',
            title: 'strip() z argumentem',
            code: 'text = "---hello---"\nprint(text.strip("-"))  # "hello"',
          },
          { type: 'heading', id: 'replace', level: 2, text: 'replace()' },
          {
            type: 'code',
            language: 'python',
            title: 'Zamiana spacji',
            code: 'text = "hello world"\nprint(text.replace(" ", "_"))',
          },
          {
            type: 'paragraph',
            text: 'replace() ma opcjonalny trzeci argument count, który ogranicza liczbę zamian.',
          },
          {
            type: 'code',
            language: 'python',
            title: 'replace() z limitem',
            code: 'text = "a-a-a"\nprint(text.replace("-", "_", 1))  # a_a-a',
          },
          { type: 'heading', id: 'join', level: 2, text: 'join()' },
          {
            type: 'paragraph',
            text: 'join() łączy elementy listy w jeden tekst.',
          },
          {
            type: 'code',
            language: 'python',
            title: 'join()',
            code: 'parts = ["a", "b", "c"]\nprint("-".join(parts))  # a-b-c',
          },
          {
            type: 'paragraph',
            text: 'Elementy listy muszą być stringami. Jeśli masz liczby, użyj map(str, ...).',
          },
          {
            type: 'code',
            language: 'python',
            title: 'join() z liczbami',
            code: 'nums = [1, 2, 3]\ntext = ",".join(map(str, nums))\nprint(text)  # 1,2,3',
          },
          { type: 'heading', id: 'metody', level: 2, text: 'lower() i isdigit()' },
          {
            type: 'paragraph',
            text: 'lower() zamienia litery na małe, a isdigit() sprawdza, czy znak jest cyfrą.',
          },
          {
            type: 'code',
            language: 'python',
            title: 'Metody tekstu',
            code: 'text = "A1b"\nprint(text.lower())  # a1b\nprint("7".isdigit())  # True',
          },
        ],
        summary: [
          'split() dzieli tekst na listę słów.',
          'replace() zamienia fragmenty tekstu.',
          'join(), lower() i isdigit() pomagają w składaniu i analizie.',
        ],
      },
      {
        title: 'Artykuł: slicing i palindromy',
        shortDesc: 'Odwracanie tekstu i sprawdzanie palindromów.',
        description: 'Poznaj slicing i wykorzystaj go do palindromów.',
        etaMinutes: 9,
        xp: 22,
        tags: ['Podstawy Pythona', 'napisy', 'slicing', 'palindrom'],
        blocks: [
          { type: 'heading', id: 'slicing', level: 2, text: 'Slicing' },
          {
            type: 'paragraph',
            text: 'Slicing pozwala wycinać fragmenty: text[start:stop:step].',
          },
          {
            type: 'list',
            items: [
              'start, indeks początkowy (domyślnie 0)',
              'stop, indeks końcowy (nie jest włączony)',
              'step, krok (domyślnie 1)',
            ],
          },
          {
            type: 'code',
            language: 'python',
            title: 'Odwrócenie tekstu',
            code: 'text = "abcd"\nprint(text[::-1])  # dcba',
          },
          {
            type: 'code',
            language: 'python',
            title: 'Slicing z zakresami',
            code: 'text = "python"\nprint(text[1:4])  # yth\nprint(text[-3:])  # hon',
          },
          { type: 'heading', id: 'palindrom', level: 2, text: 'Palindrom' },
          {
            type: 'code',
            language: 'python',
            title: 'Sprawdzenie palindromu',
            code: 'def solve(text: str) -> bool:\n    return text == text[::-1]',
          },
          {
            type: 'paragraph',
            text: 'Jeśli chcesz ignorować wielkość liter, użyj text.lower() przed porównaniem.',
          },
        ],
        summary: ['Slicing wycina fragmenty tekstu.', 'text[::-1] odwraca string.', 'Palindrom to tekst równy swojemu odwróceniu.'],
      },
    ],
  },
  {
    key: 'pcep-4',
    tasks: [
      {
        title: 'Silnia',
        shortDesc: 'Oblicz silnię liczby n.',
        description: 'Zwróć n! dla n >= 0. Dla n = 0 zwróć 1.',
        etaMinutes: 10,
        xp: 70,
        starterCode: starterCode.intToInt,
        publicTests: [
          ['5', '120'],
          ['0', '1'],
          ['1', '1'],
        ],
        hiddenTests: [
          ['3', '6'],
          ['7', '5040'],
          ['2', '2'],
          ['6', '720'],
          ['4', '24'],
        ],
        hints: ['Zacznij od 1 i mnoż po kolei do n.'],
      },
      {
        title: 'Fibonacci',
        shortDesc: 'Zwróć n-ty wyraz ciągu Fibonacciego.',
        description: 'Zwróć n-ty wyraz ciągu Fibonacciego, gdzie F(0)=0 i F(1)=1.',
        etaMinutes: 11,
        xp: 80,
        starterCode: starterCode.intToInt,
        publicTests: [
          ['0', '0'],
          ['1', '1'],
          ['7', '13'],
        ],
        hiddenTests: [
          ['2', '1'],
          ['3', '2'],
          ['5', '5'],
          ['8', '21'],
          ['10', '55'],
        ],
        hints: ['Użyj dwóch zmiennych i aktualizuj je w pętli.'],
      },
      {
        title: 'Policz litery a',
        shortDesc: 'Policz wystąpienia litery a.',
        description: 'Policz wystąpienia litery a (bez rozróżniania wielkości).',
        etaMinutes: 7,
        xp: 45,
        starterCode: starterCode.textToInt,
        publicTests: [
          ['Ala ma kota', '4'],
          ['xyz', '0'],
          ['Banana', '3'],
        ],
        hiddenTests: [
          ['', '0'],
          ['AAA', '3'],
          ['python', '0'],
          ['ananas', '3'],
          ['Abrakadabra', '5'],
        ],
        hints: ['Zamień tekst na lower() i zlicz "a".'],
      },
      {
        title: 'Najdłuższe słowo',
        shortDesc: 'Zwróć długość najdłuższego słowa.',
        description: 'Zwróć długość najdłuższego słowa w tekście.',
        etaMinutes: 9,
        xp: 60,
        starterCode: starterCode.textToInt,
        publicTests: [
          ['ala ma kota', '4'],
          ['python', '6'],
          ['', '0'],
        ],
        hiddenTests: [
          ['lorem ipsum dolor', '5'],
          ['a bc def', '3'],
          ['snake coder', '5'],
          ['one two three four', '5'],
          ['x', '1'],
        ],
        hints: ['Użyj `split()` i znajdź maksymalną długość.'],
      },
      {
        title: 'Minuty na format HH:MM',
        shortDesc: 'Zamień minuty na format czasu.',
        description: 'Zamień liczbę minut na format HH:MM z zerami wiodącymi.',
        etaMinutes: 9,
        xp: 60,
        starterCode: starterCode.intToText,
        publicTests: [
          ['75', '01:15'],
          ['5', '00:05'],
          ['1439', '23:59'],
        ],
        hiddenTests: [
          ['0', '00:00'],
          ['60', '01:00'],
          ['61', '01:01'],
          ['135', '02:15'],
          ['720', '12:00'],
        ],
        hints: ['Użyj `divmod(minutes, 60)` i formatuj `:02d`.'],
      },
    ],
    bugfixes: [
      {
        title: 'Silnia bez ostatniego kroku',
        shortDesc: 'Pętla pomija mnożenie przez n.',
        description: 'Popraw pętlę tak, aby uwzględniała n.',
        etaMinutes: 7,
        xp: 45,
        starterCode: `def solve(n: int) -> int:
    result = 1
    for i in range(1, n):
        result *= i
    return result
`,
        publicTests: [
          ['5', '120'],
          ['1', '1'],
          ['0', '1'],
        ],
        hiddenTests: [
          ['3', '6'],
          ['4', '24'],
          ['2', '2'],
          ['6', '720'],
          ['7', '5040'],
        ],
        hints: ['Zakres powinien kończyć się na n + 1.'],
      },
      {
        title: 'Błędny start Fibonacciego',
        shortDesc: 'Startuje od złych wartości.',
        description: 'Popraw inicjalizację ciągu Fibonacciego.',
        etaMinutes: 7,
        xp: 45,
        starterCode: `def solve(n: int) -> int:
    a, b = 1, 1
    for _ in range(n):
        a, b = b, a + b
    return a
`,
        publicTests: [
          ['0', '0'],
          ['1', '1'],
          ['2', '1'],
        ],
        hiddenTests: [
          ['3', '2'],
          ['4', '3'],
          ['5', '5'],
          ['6', '8'],
          ['7', '13'],
        ],
        hints: ['Ustaw start na a=0, b=1.'],
      },
      {
        title: 'Maksimum z listy dla liczb ujemnych',
        shortDesc: 'Kod nie działa dla samych ujemnych liczb.',
        description: 'Popraw inicjalizację wartości maksymalnej.',
        etaMinutes: 7,
        xp: 45,
        starterCode: `def solve(nums: list[int]) -> int:
    best = 0
    for n in nums:
        if n > best:
            best = n
    return best
`,
        publicTests: [
          ['1 5 2', '5'],
          ['-3 -2 -7', '-2'],
          ['0', '0'],
        ],
        hiddenTests: [
          ['-10 -1 -2', '-1'],
          ['4 4 4', '4'],
          ['', '0'],
          ['100 50', '100'],
          ['-5', '-5'],
        ],
        hints: ['Zainicjalizuj `best` pierwszym elementem, gdy lista nie jest pusta.'],
      },
    ],
    quizzes: [
      {
        title: 'Quiz: funkcje',
        shortDesc: 'Parametry i return.',
        description: 'Sprawdź wiedzę o funkcjach w Pythonie.',
        etaMinutes: 6,
        xp: 30,
        questions: [
          {
            title: 'Pytanie 1',
            prompt: 'Do czego służy return?',
            options: [
              { label: 'Zwraca wartość i kończy funkcję', isCorrect: true },
              { label: 'Wypisuje wartość', isCorrect: false },
              { label: 'Tworzy pętlę', isCorrect: false },
              { label: 'Zmienia typ', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 2',
            prompt: 'Czy funkcja może mieć parametr domyślny?',
            options: [
              { label: 'Tak', isCorrect: true },
              { label: 'Nie', isCorrect: false },
              { label: 'Tylko w klasach', isCorrect: false },
              { label: 'Tylko dla typów numerycznych', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 3',
            prompt: 'Co zwraca funkcja bez return?',
            options: [
              { label: 'None', isCorrect: true },
              { label: '0', isCorrect: false },
              { label: 'False', isCorrect: false },
              { label: '""', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 4',
            prompt: 'Które słowo kluczowe rozpoczyna definicję funkcji?',
            options: [
              { label: 'def', isCorrect: true },
              { label: 'func', isCorrect: false },
              { label: 'define', isCorrect: false },
              { label: 'function', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 5',
            prompt: 'Który zapis wywołuje funkcję greet z argumentem nazwanym?',
            options: [
              { label: 'greet(name="Ala")', isCorrect: true },
              { label: 'greet("Ala"=name)', isCorrect: false },
              { label: 'greet(name:"Ala")', isCorrect: false },
              { label: 'greet="Ala"', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 6',
            prompt: 'Gdzie powinny znajdować się parametry domyślne?',
            options: [
              { label: 'Na końcu listy parametrów', isCorrect: true },
              { label: 'Na początku listy parametrów', isCorrect: false },
              { label: 'W środku, dowolnie', isCorrect: false },
              { label: 'W oddzielnej funkcji', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 7',
            prompt: 'Jaki jest zasięg zmiennej zdefiniowanej wewnątrz funkcji?',
            options: [
              { label: 'Lokalny', isCorrect: true },
              { label: 'Globalny', isCorrect: false },
              { label: 'Publiczny', isCorrect: false },
              { label: 'Prywatny systemowy', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 8',
            prompt: 'Czy funkcja może zwrócić więcej niż jedną wartość?',
            options: [
              { label: 'Tak, np. jako krotkę', isCorrect: true },
              { label: 'Nie, zawsze tylko jedną', isCorrect: false },
              { label: 'Tylko w klasach', isCorrect: false },
              { label: 'Tylko dla liczb', isCorrect: false },
            ],
          },
        ],
      },
      {
        title: 'Quiz: algorytmy',
        shortDesc: 'Fibonacci i złożoność.',
        description: 'Krótki quiz o prostych algorytmach.',
        etaMinutes: 6,
        xp: 30,
        questions: [
          {
            title: 'Pytanie 1',
            prompt: 'Jaka jest wartość 4! ?',
            options: [
              { label: '24', isCorrect: true },
              { label: '12', isCorrect: false },
              { label: '16', isCorrect: false },
              { label: '8', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 2',
            prompt: 'Pierwsze dwa wyrazy Fibonacciego to:',
            options: [
              { label: '0 i 1', isCorrect: true },
              { label: '1 i 1', isCorrect: false },
              { label: '2 i 3', isCorrect: false },
              { label: '1 i 2', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 3',
            prompt: 'Jaka jest złożoność pojedynczej pętli po n elementach?',
            options: [
              { label: 'O(n)', isCorrect: true },
              { label: 'O(n^2)', isCorrect: false },
              { label: 'O(log n)', isCorrect: false },
              { label: 'O(1)', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 4',
            prompt: 'Ile wynosi 0! ?',
            options: [
              { label: '1', isCorrect: true },
              { label: '0', isCorrect: false },
              { label: '-1', isCorrect: false },
              { label: '2', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 5',
            prompt: 'Jaki jest F(6), gdy F(0)=0 i F(1)=1?',
            options: [
              { label: '8', isCorrect: true },
              { label: '5', isCorrect: false },
              { label: '13', isCorrect: false },
              { label: '21', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 6',
            prompt: 'Do jakiej wartości sprawdza się dzielniki przy teście pierwszości?',
            options: [
              { label: 'Do pierwiastka z n', isCorrect: true },
              { label: 'Do n - 1', isCorrect: false },
              { label: 'Do n / 2', isCorrect: false },
              { label: 'Tylko do 10', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 7',
            prompt: 'Jaki jest wynik sumy liczb od 1 do 5?',
            options: [
              { label: '15', isCorrect: true },
              { label: '10', isCorrect: false },
              { label: '12', isCorrect: false },
              { label: '20', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 8',
            prompt: 'Jaka jest złożoność zagnieżdżonej pętli po n elementach?',
            options: [
              { label: 'O(n^2)', isCorrect: true },
              { label: 'O(n)', isCorrect: false },
              { label: 'O(log n)', isCorrect: false },
              { label: 'O(1)', isCorrect: false },
            ],
          },
        ],
      },
    ],
    articles: [
      {
        title: 'Artykuł: funkcje od podstaw',
        shortDesc: 'def, parametry i return.',
        description: 'Dowiedz się, jak definiować funkcje i zwracać wyniki.',
        etaMinutes: 10,
        xp: 24,
        tags: ['Podstawy Pythona', 'funkcje', 'return'],
        blocks: [
          { type: 'heading', id: 'def', level: 2, text: 'Definicja funkcji' },
          {
            type: 'paragraph',
            text: 'Funkcja to nazwany fragment kodu, który można wielokrotnie wywoływać.',
          },
          {
            type: 'code',
            language: 'python',
            title: 'Prosta funkcja',
            code: 'def add(a, b):\n    return a + b',
          },
          {
            type: 'code',
            language: 'python',
            title: 'Wywołanie funkcji',
            code: 'result = add(2, 3)\nprint(result)  # 5',
          },
          { type: 'heading', id: 'parametry', level: 2, text: 'Parametry i wartości domyślne' },
          {
            type: 'code',
            language: 'python',
            title: 'Parametr domyślny',
            code: 'def greet(name, prefix="Hej"):\n    return f"{prefix} {name}"',
          },
          {
            type: 'paragraph',
            text: 'Parametry domyślne muszą być na końcu listy parametrów.',
          },
          {
            type: 'code',
            language: 'python',
            title: 'Argumenty nazwane',
            code: 'print(greet(name="Ala"))\nprint(greet(prefix="Cześć", name="Ola"))',
          },
          { type: 'heading', id: 'return', level: 2, text: 'return' },
          {
            type: 'paragraph',
            text: 'return kończy funkcję i oddaje wynik. Bez return funkcja zwraca None.',
          },
          {
            type: 'paragraph',
            text: 'Zmienne zdefiniowane w funkcji są lokalne i nie istnieją poza nią.',
          },
          {
            type: 'code',
            language: 'python',
            title: 'Zasięg zmiennych',
            code: 'def func():\n    x = 10\n    return x\n# print(x)  # błąd: x nie istnieje tutaj',
          },
        ],
        summary: [
          'Funkcja to blok kodu wielokrotnego użytku.',
          'return zwraca wynik.',
          'Parametry domyślne i nazwane upraszczają wywołania.',
        ],
      },
      {
        title: 'Artykuł: algorytmy iteracyjne',
        shortDesc: 'Silnia i Fibonacci krok po kroku.',
        description: 'Poznaj klasyczne algorytmy i ich implementację w pętli.',
        etaMinutes: 10,
        xp: 24,
        tags: ['Podstawy Pythona', 'algorytmy', 'pętle'],
        blocks: [
          { type: 'heading', id: 'silnia', level: 2, text: 'Silnia' },
          {
            type: 'paragraph',
            text: 'Silnia n! to iloczyn liczb od 1 do n. Dla n = 0 wynik to 1.',
          },
          {
            type: 'code',
            language: 'python',
            title: 'Silnia (iteracyjnie)',
            code: 'def solve(n: int) -> int:\n    result = 1\n    for i in range(2, n + 1):\n        result *= i\n    return result',
          },
          { type: 'heading', id: 'fib', level: 2, text: 'Fibonacci' },
          {
            type: 'paragraph',
            text: 'Ciąg Fibonacciego startuje od 0, 1. Każdy kolejny wyraz to suma dwóch poprzednich.',
          },
          {
            type: 'code',
            language: 'python',
            title: 'Fibonacci',
            code: 'def solve(n: int) -> int:\n    a, b = 0, 1\n    for _ in range(n):\n        a, b = b, a + b\n    return a',
          },
          {
            type: 'paragraph',
            text: 'W algorytmach iteracyjnych najczęstszy błąd to zły zakres pętli (off-by-one).',
          },
          {
            type: 'callout',
            tone: 'info',
            title: 'Inicjalizacja',
            text: 'Poprawne wartości startowe są kluczowe dla algorytmu.',
          },
        ],
        summary: [
          'Silnia to mnożenie kolejnych liczb.',
          'Fibonacci wymaga dwóch zmiennych.',
          'Zakres pętli wpływa na poprawność wyniku.',
        ],
      },
      {
        title: 'Artykuł: przetwarzanie tekstu',
        shortDesc: 'Zliczanie liter i praca ze słowami.',
        description: 'Naucz się zliczać litery i znajdować najdłuższe słowo.',
        etaMinutes: 9,
        xp: 22,
        tags: ['Podstawy Pythona', 'napisy', 'split', 'lower'],
        blocks: [
          { type: 'heading', id: 'zliczanie', level: 2, text: 'Zliczanie liter' },
          {
            type: 'paragraph',
            text: 'Najprościej zliczać litery po ujednoliceniu wielkości (lower).',
          },
          {
            type: 'code',
            language: 'python',
            title: 'Litery a',
            code: 'def solve(text: str) -> int:\n    return text.lower().count("a")',
          },
          {
            type: 'code',
            language: 'python',
            title: 'Zliczanie w pętli',
            code: 'count = 0\nfor ch in text.lower():\n    if ch == "a":\n        count += 1',
          },
          { type: 'heading', id: 'slow', level: 2, text: 'Najdłuższe słowo' },
          {
            type: 'code',
            language: 'python',
            title: 'Najdłuższe słowo',
            code: 'def solve(text: str) -> int:\n    words = text.split()\n    if not words:\n        return 0\n    return max(len(word) for word in words)',
          },
          {
            type: 'paragraph',
            text: 'split() bez argumentów usuwa nadmiarowe spacje.',
          },
          {
            type: 'paragraph',
            text: 'Gdy tekst ma znaki interpunkcyjne, możesz je wcześniej usunąć lub zastąpić spacją.',
          },
        ],
        summary: ['lower() ułatwia zliczanie liter.', 'split() dzieli tekst na słowa.', 'max() wybiera najdłuższe słowo.'],
      },
      {
        title: 'Artykuł: formatowanie czasu',
        shortDesc: 'Zamiana minut na HH:MM.',
        description: 'Przećwicz formatowanie danych liczbowych na tekst.',
        etaMinutes: 8,
        xp: 20,
        tags: ['Podstawy Pythona', 'formatowanie', 'f-string'],
        blocks: [
          { type: 'heading', id: 'divmod', level: 2, text: 'Rozbijanie minut' },
          {
            type: 'paragraph',
            text: 'Godziny to iloraz z dzielenia przez 60, a minuty to reszta z tego dzielenia.',
          },
          {
            type: 'code',
            language: 'python',
            title: 'divmod()',
            code: 'hours, minutes = divmod(total_minutes, 60)',
          },
          {
            type: 'code',
            language: 'python',
            title: 'Alternatywa: // i %',
            code: 'hours = total_minutes // 60\nminutes = total_minutes % 60',
          },
          { type: 'heading', id: 'format', level: 2, text: 'Zera wiodące' },
          {
            type: 'code',
            language: 'python',
            title: 'Format HH:MM',
            code: 'result = f"{hours:02d}:{minutes:02d}"',
          },
          {
            type: 'code',
            language: 'python',
            title: 'zfill()',
            code: 'h = str(hours).zfill(2)\nm = str(minutes).zfill(2)\nprint(f"{h}:{m}")',
          },
        ],
        summary: ['divmod() zwraca iloraz i resztę.', 'Format :02d dodaje zero wiodące.', 'HH:MM to standardowy zapis czasu.'],
      },
    ],
  },
  {
    key: 'pcep-5',
    tasks: [
      {
        title: 'Policz liczby ujemne',
        shortDesc: 'Zwróć liczbę ujemnych wartości.',
        description: 'Zwróć liczbę ujemnych liczb w liście.',
        etaMinutes: 7,
        xp: 45,
        starterCode: starterCode.numsToInt,
        publicTests: [
          ['1 -2 -3 4', '2'],
          ['-1 -1', '2'],
          ['', '0'],
        ],
        hiddenTests: [
          ['0 1 2', '0'],
          ['-5 10 -3', '2'],
          ['7 -7 8', '1'],
          ['-2 -2 -2', '3'],
          ['5', '0'],
        ],
        hints: ['Zwiększ licznik, gdy `n < 0`.'],
      },
      {
        title: 'Iloczyn liczb',
        shortDesc: 'Zwróć iloczyn wszystkich liczb.',
        description: 'Zwróć iloczyn wszystkich liczb w liście. Dla pustej listy zwróć 0.',
        etaMinutes: 8,
        xp: 55,
        starterCode: starterCode.numsToInt,
        publicTests: [
          ['2 3 4', '24'],
          ['5', '5'],
          ['', '0'],
        ],
        hiddenTests: [
          ['1 2 3', '6'],
          ['-2 3', '-6'],
          ['-1 -1', '1'],
          ['0 5', '0'],
          ['10 -1 2', '-20'],
        ],
        requirements: ['Dla pustej listy zwróć 0.'],
        hints: ['Zacznij od 1 i mnoż po kolei.'],
      },
      {
        title: 'Ten sam start i koniec',
        shortDesc: 'Sprawdź, czy tekst zaczyna i kończy się tak samo.',
        description: 'Zwróć True, jeśli tekst zaczyna się i kończy tym samym znakiem. Dla pustego tekstu zwróć False.',
        etaMinutes: 7,
        xp: 45,
        starterCode: starterCode.textToBool,
        publicTests: [
          ['abba', 'True'],
          ['python', 'False'],
          ['a', 'True'],
        ],
        hiddenTests: [
          ['', 'False'],
          ['ab', 'False'],
          ['level', 'True'],
          ['testt', 'True'],
          ['xyzx', 'True'],
        ],
        requirements: ['Dla pustego tekstu zwróć False.'],
        hints: ['Porównaj `text[0]` i `text[-1]`.'],
      },
      {
        title: 'Usuń samogłoski',
        shortDesc: 'Usuń samogłoski z tekstu.',
        description: 'Usuń samogłoski a, e, i, o, u z tekstu (bez rozróżniania wielkości).',
        etaMinutes: 8,
        xp: 55,
        starterCode: starterCode.textToText,
        publicTests: [
          ['Python', 'Pythn'],
          ['Ala ma kota', 'l m kt'],
          ['bcdf', 'bcdf'],
        ],
        hiddenTests: [
          ['AEIOU', ''],
          ['snake', 'snk'],
          ['yellow', 'yllw'],
          ['', ''],
          ['hello world', 'hll wrld'],
        ],
        hints: ['Utwórz zbiór samogłosek i filtruj znaki.'],
      },
      {
        title: 'Liczba pierwsza',
        shortDesc: 'Sprawdź, czy liczba jest pierwsza.',
        description: 'Zwróć True, jeśli liczba jest pierwsza. Dla n <= 1 zwróć False.',
        etaMinutes: 11,
        xp: 80,
        starterCode: starterCode.intToBool,
        publicTests: [
          ['2', 'True'],
          ['9', 'False'],
          ['1', 'False'],
        ],
        hiddenTests: [
          ['17', 'True'],
          ['0', 'False'],
          ['-3', 'False'],
          ['19', 'True'],
          ['15', 'False'],
        ],
        hints: ['Sprawdź dzielniki do sqrt(n).'],
      },
    ],
    bugfixes: [
      {
        title: 'Pierwszość błędnie dla 1',
        shortDesc: 'Funkcja uznaje 1 za liczbę pierwszą.',
        description: 'Popraw warunek brzegowy dla liczb <= 1.',
        etaMinutes: 7,
        xp: 45,
        starterCode: `def solve(n: int) -> bool:
    if n <= 1:
        return True
    for i in range(2, int(n ** 0.5) + 1):
        if n % i == 0:
            return False
    return True
`,
        publicTests: [
          ['1', 'False'],
          ['2', 'True'],
          ['9', 'False'],
        ],
        hiddenTests: [
          ['17', 'True'],
          ['0', 'False'],
          ['-3', 'False'],
          ['15', 'False'],
          ['19', 'True'],
        ],
        hints: ['Dla n <= 1 wynik zawsze False.'],
      },
      {
        title: 'Pomijanie ostatniej cyfry',
        shortDesc: 'Kod nie sumuje ostatniej cyfry.',
        description: 'Popraw iterację tak, aby uwzględniała wszystkie cyfry.',
        etaMinutes: 6,
        xp: 40,
        starterCode: `def solve(text: str) -> int:
    total = 0
    for ch in text[:-1]:
        if ch.isdigit():
            total += int(ch)
    return total
`,
        publicTests: [
          ['12045', '12'],
          ['7', '7'],
          ['', '0'],
        ],
        hiddenTests: [
          ['999', '27'],
          ['a1b2', '3'],
          ['000', '0'],
          ['123456', '21'],
          ['5 5', '10'],
        ],
        hints: ['Przejdź po całym tekście, bez [: -1].'],
      },
      {
        title: 'Zły kierunek liter',
        shortDesc: 'Tekst jest zamieniany na wielkie litery.',
        description: 'Zwróć tekst zapisany małymi literami.',
        etaMinutes: 6,
        xp: 40,
        starterCode: `def solve(text: str) -> str:
    return text.upper()
`,
        publicTests: [
          ['Podstawy Pythona', 'pcep'],
          ['Snake Coder', 'snake coder'],
          ['abc', 'abc'],
        ],
        hiddenTests: [
          ['', ''],
          ['Python3', 'python3'],
          ['MiXeD', 'mixed'],
          ['A B', 'a b'],
          ['123', '123'],
        ],
        hints: ['Użyj `lower()` zamiast `upper()`.'],
      },
    ],
    quizzes: [
      {
        title: 'Quiz: powtórka',
        shortDesc: 'Podstawy typów i operatorów.',
        description: 'Szybka powtórka kluczowych pojęć.',
        etaMinutes: 6,
        xp: 30,
        questions: [
          {
            title: 'Pytanie 1',
            prompt: 'Jaki będzie wynik int("10")?',
            options: [
              { label: '10', isCorrect: true },
              { label: '"10"', isCorrect: false },
              { label: '1', isCorrect: false },
              { label: 'Błąd', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 2',
            prompt: 'Ile zwraca len("")?',
            options: [
              { label: '0', isCorrect: true },
              { label: '1', isCorrect: false },
              { label: 'None', isCorrect: false },
              { label: 'Błąd', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 3',
            prompt: 'Jaki jest wynik bool("")?',
            options: [
              { label: 'False', isCorrect: true },
              { label: 'True', isCorrect: false },
              { label: '0', isCorrect: false },
              { label: '1', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 4',
            prompt: 'Co zwraca "a b".split()?',
            options: [
              { label: '["a", "b"]', isCorrect: true },
              { label: '["a b"]', isCorrect: false },
              { label: '"a b"', isCorrect: false },
              { label: 'Błąd', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 5',
            prompt: 'Jaki będzie wynik 5 % 2?',
            options: [
              { label: '1', isCorrect: true },
              { label: '0', isCorrect: false },
              { label: '2', isCorrect: false },
              { label: '3', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 6',
            prompt: 'Ile zwraca len([1, 2, 3, 4])?',
            options: [
              { label: '4', isCorrect: true },
              { label: '3', isCorrect: false },
              { label: '5', isCorrect: false },
              { label: '0', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 7',
            prompt: 'Co zwraca list(range(3, 6))?',
            options: [
              { label: '[3, 4, 5]', isCorrect: true },
              { label: '[3, 4, 5, 6]', isCorrect: false },
              { label: '[2, 3, 4, 5]', isCorrect: false },
              { label: '[4, 5, 6]', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 8',
            prompt: 'Który zapis tworzy pustą listę?',
            options: [
              { label: '[]', isCorrect: true },
              { label: '{}', isCorrect: false },
              { label: '()', isCorrect: false },
              { label: '""', isCorrect: false },
            ],
          },
        ],
      },
      {
        title: 'Quiz: wyjątki',
        shortDesc: 'Podstawy try/except.',
        description: 'Sprawdź podstawy obsługi błędów.',
        etaMinutes: 6,
        xp: 30,
        questions: [
          {
            title: 'Pytanie 1',
            prompt: 'Który blok przechwytuje wyjątek?',
            options: [
              { label: 'except', isCorrect: true },
              { label: 'catch', isCorrect: false },
              { label: 'error', isCorrect: false },
              { label: 'handle', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 2',
            prompt: 'Do czego służy try?',
            options: [
              { label: 'Do wykonania kodu mogącego zgłosić błąd', isCorrect: true },
              { label: 'Do tworzenia pętli', isCorrect: false },
              { label: 'Do deklaracji zmiennych', isCorrect: false },
              { label: 'Do importu modułów', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 3',
            prompt: 'Jaki wyjątek pojawi się przy int("abc")?',
            options: [
              { label: 'ValueError', isCorrect: true },
              { label: 'TypeError', isCorrect: false },
              { label: 'IndexError', isCorrect: false },
              { label: 'KeyError', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 4',
            prompt: 'Który blok wykona się zawsze w obsłudze wyjątków?',
            options: [
              { label: 'finally', isCorrect: true },
              { label: 'else', isCorrect: false },
              { label: 'except', isCorrect: false },
              { label: 'raise', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 5',
            prompt: 'Kiedy wykona się blok else w try/except?',
            options: [
              { label: 'Gdy nie wystąpi wyjątek', isCorrect: true },
              { label: 'Gdy wystąpi wyjątek', isCorrect: false },
              { label: 'Zawsze', isCorrect: false },
              { label: 'Nigdy', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 6',
            prompt: 'Jak zgłosić wyjątek ręcznie?',
            options: [
              { label: 'raise ValueError("błąd")', isCorrect: true },
              { label: 'throw ValueError("błąd")', isCorrect: false },
              { label: 'error ValueError("błąd")', isCorrect: false },
              { label: 'except ValueError("błąd")', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 7',
            prompt: 'Co się stanie, gdy wyjątek nie zostanie obsłużony?',
            options: [
              { label: 'Program przerwie działanie i pokaże traceback', isCorrect: true },
              { label: 'Program zignoruje wyjątek', isCorrect: false },
              { label: 'Zawsze wykona się else', isCorrect: false },
              { label: 'Wartość zostanie ustawiona na 0', isCorrect: false },
            ],
          },
          {
            title: 'Pytanie 8',
            prompt: 'Jak poprawnie złapać ValueError lub TypeError?',
            options: [
              { label: 'except (ValueError, TypeError):', isCorrect: true },
              { label: 'except ValueError or TypeError:', isCorrect: false },
              { label: 'except ValueError, TypeError:', isCorrect: false },
              { label: 'except [ValueError, TypeError]:', isCorrect: false },
            ],
          },
        ],
      },
    ],
    articles: [
      {
        title: 'Artykuł: powtórka, liczby i listy',
        shortDesc: 'Utrwalenie pracy z listami liczb.',
        description: 'Przećwicz liczenie, sumowanie i iloczyny.',
        etaMinutes: 9,
        xp: 22,
        tags: ['Podstawy Pythona', 'powtórka', 'listy'],
        blocks: [
          { type: 'heading', id: 'ujemne', level: 2, text: 'Zliczanie ujemnych' },
          {
            type: 'paragraph',
            text: 'Zliczanie to klasyczny wzorzec: licznik + pętla + warunek.',
          },
          {
            type: 'code',
            language: 'python',
            title: 'Licznik ujemnych',
            code: 'def solve(nums: list[int]) -> int:\n    count = 0\n    for n in nums:\n        if n < 0:\n            count += 1\n    return count',
          },
          { type: 'heading', id: 'iloczyn', level: 2, text: 'Iloczyn liczb' },
          {
            type: 'paragraph',
            text: 'Dla iloczynu inicjalizuj wynik na 1. Dla pustej listy zwróć 0 (zgodnie z zadaniem).',
          },
          {
            type: 'code',
            language: 'python',
            title: 'Iloczyn',
            code: 'def solve(nums: list[int]) -> int:\n    if not nums:\n        return 0\n    result = 1\n    for n in nums:\n        result *= n\n    return result',
          },
          {
            type: 'code',
            language: 'python',
            title: 'Sumowanie i minimum',
            code: 'total = sum(nums)\nsmallest = min(nums) if nums else 0',
          },
          {
            type: 'callout',
            tone: 'info',
            title: 'Pusta lista',
            text: 'Dla pustej listy zwracamy 0 (zgodnie z zadaniem).',
          },
        ],
        summary: [
          'Zliczanie to pętla + warunek.',
          'Iloczyn wymaga inicjalizacji na 1.',
          'Pusta lista to przypadek brzegowy.',
        ],
      },
      {
        title: 'Artykuł: filtracja tekstu',
        shortDesc: 'Usuwanie samogłosek i praca z znakami.',
        description: 'Naucz się filtrować znaki w stringu.',
        etaMinutes: 8,
        xp: 20,
        tags: ['Podstawy Pythona', 'napisy', 'filtracja'],
        blocks: [
          { type: 'heading', id: 'samogloski', level: 2, text: 'Usuwanie samogłosek' },
          {
            type: 'paragraph',
            text: 'Najwygodniej przygotować zbiór samogłosek i filtrować znaki w pętli lub składaniu listy.',
          },
          {
            type: 'code',
            language: 'python',
            title: 'Filtracja',
            code: 'def solve(text: str) -> str:\n    vowels = "aeiouAEIOU"\n    return "".join(ch for ch in text if ch not in vowels)',
          },
          {
            type: 'code',
            language: 'python',
            title: 'Wersja z pętlą',
            code: 'result = ""\nfor ch in text:\n    if ch not in vowels:\n        result += ch',
          },
          { type: 'heading', id: 'indeksy', level: 2, text: 'Pierwszy i ostatni znak' },
          {
            type: 'code',
            language: 'python',
            title: 'Start i koniec',
            code: 'def solve(text: str) -> bool:\n    if not text:\n        return False\n    return text[0] == text[-1]',
          },
          {
            type: 'paragraph',
            text: 'Zawsze sprawdzaj pusty tekst przed użyciem text[0] i text[-1].',
          },
        ],
        summary: [
          'Filtracja to wybieranie znaków spełniających warunek.',
          'join() składa wynik w string.',
          'Indeksy 0 i -1 dają pierwszy i ostatni znak.',
        ],
      },
      {
        title: 'Artykuł: liczby pierwsze',
        shortDesc: 'Sprawdzanie pierwszości.',
        description: 'Poznaj algorytm sprawdzania liczby pierwszej.',
        etaMinutes: 9,
        xp: 22,
        tags: ['Podstawy Pythona', 'liczby pierwsze'],
        blocks: [
          { type: 'heading', id: 'prime', level: 2, text: 'Test pierwszości' },
          {
            type: 'paragraph',
            text: 'Liczba pierwsza ma dokładnie dwa dzielniki: 1 i samą siebie.',
          },
          {
            type: 'code',
            language: 'python',
            title: 'Sprawdzenie',
            code: 'def solve(n: int) -> bool:\n    if n <= 1:\n        return False\n    for i in range(2, int(n ** 0.5) + 1):\n        if n % i == 0:\n            return False\n    return True',
          },
          {
            type: 'paragraph',
            text: 'Wystarczy sprawdzać dzielniki do pierwiastka z n.',
          },
          {
            type: 'code',
            language: 'python',
            title: 'Szybsza wersja (pomijanie parzystych)',
            code: 'if n == 2:\n    return True\nif n < 2 or n % 2 == 0:\n    return False\nfor i in range(3, int(n ** 0.5) + 1, 2):\n    if n % i == 0:\n        return False\nreturn True',
          },
        ],
        summary: ['Liczba pierwsza ma tylko dwa dzielniki.', 'Sprawdzaj do sqrt(n).', 'Warunek n <= 1 zwraca False.'],
      },
      {
        title: 'Artykuł: wyjątki w Pythonie',
        shortDesc: 'try/except i podstawowe błędy.',
        description: 'Krótki wstęp do obsługi wyjątków.',
        etaMinutes: 8,
        xp: 20,
        tags: ['Podstawy Pythona', 'wyjątki'],
        blocks: [
          { type: 'heading', id: 'try', level: 2, text: 'try / except' },
          {
            type: 'code',
            language: 'python',
            title: 'Przykład',
            code: 'try:\n    value = int("abc")\nexcept ValueError:\n    value = 0',
          },
          {
            type: 'paragraph',
            text: 'Wyjątek ValueError pojawia się, gdy konwersja się nie powiedzie.',
          },
          {
            type: 'paragraph',
            text: 'Możesz użyć else, gdy kod w try nie zgłosił wyjątku, oraz finally, które wykona się zawsze.',
          },
          {
            type: 'code',
            language: 'python',
            title: 'try / except / else / finally',
            code: 'try:\n    value = int(text)\nexcept ValueError:\n    value = 0\nelse:\n    print("OK")\nfinally:\n    print("koniec")',
          },
          {
            type: 'paragraph',
            text: 'Wyjątki można też świadomie zgłaszać przez raise.',
          },
          {
            type: 'code',
            language: 'python',
            title: 'raise',
            code: 'if n < 0:\n    raise ValueError("n musi być >= 0")',
          },
        ],
        summary: [
          'try/except chroni kod przed błędami.',
          'ValueError dotyczy niepoprawnych danych.',
          'else/finally i raise pomagają kontrolować przepływ.',
        ],
      },
    ],
  },
]

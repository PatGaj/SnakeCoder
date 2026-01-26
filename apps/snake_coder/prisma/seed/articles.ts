import type { Prisma, PrismaClient } from '../../src/generated/prisma/client'

import { SEED_IDS } from './ids'

export const seedArticles = async (prisma: PrismaClient) => {
  await prisma.article.createMany({
    data: [
      // Module: Basics
      // Sprint 1
      {
        missionId: SEED_IDS.id_mission_article1_sprint1_moduleBase,
        tags: ['seed', 'article', 'basics', 'cs'],
        blocks: [
          {
            type: 'heading',
            id: 'intro',
            level: 2,
            text: 'Jak myśli komputer (i dlaczego to ma znaczenie)',
          },
          {
            type: 'paragraph',
            text: 'Komputer nie „rozumie” problemów tak jak człowiek. Nie domyśla się, nie zgaduje i nie interpretuje intencji. Wykonuje dokładnie to, co zostało zapisane w programie — krok po kroku. Jeśli nie rozumiesz tego mechanizmu, programowanie bardzo szybko zamienia się w zgadywanie i kopiowanie kodu z internetu.',
          },
          {
            type: 'paragraph',
            text: 'W tym artykule skupimy się na tym, jak komputer przetwarza informacje i wykonuje instrukcje. Bez konkretnego języka programowania. Najpierw musisz zrozumieć sposób myślenia maszyny.',
          },
          {
            type: 'list',
            items: [
              'czym jest program i instrukcja',
              'jak komputer przetwarza dane',
              'czym jest algorytm',
              'dlaczego kolejność ma znaczenie',
            ],
          },

          {
            type: 'heading',
            id: 'computer-and-program',
            level: 2,
            text: 'Czym jest program',
          },
          {
            type: 'paragraph',
            text: 'Program to zestaw instrukcji zapisanych w określonej kolejności. Komputer wykonuje je po kolei, od pierwszej do ostatniej. Nie pomija kroków i nie poprawia błędów za ciebie.',
          },
          {
            type: 'paragraph',
            text: 'Jeśli jedna instrukcja jest błędna albo nielogiczna, cały program może przestać działać albo dawać złe wyniki.',
          },

          {
            type: 'heading',
            id: 'data',
            level: 2,
            text: 'Dane: jedyne, na czym operuje komputer',
          },
          {
            type: 'paragraph',
            text: 'Dla komputera wszystko jest danymi: liczby, tekst, obrazy, kliknięcia myszą. Dane są przechowywane w pamięci i mają określony typ.',
          },
          {
            type: 'list',
            items: ['liczby (np. 1, 42, 3.14)', 'wartości logiczne (prawda / fałsz)', 'tekst (ciągi znaków)'],
          },
          {
            type: 'paragraph',
            text: 'Typ danych określa, jakie operacje można na nich wykonać. Nie da się sensownie dodać liczby do tekstu bez jasnego określenia, co to ma znaczyć.',
          },

          {
            type: 'heading',
            id: 'instructions',
            level: 2,
            text: 'Instrukcje: co komputer potrafi robić',
          },
          {
            type: 'paragraph',
            text: 'Na bardzo podstawowym poziomie komputer potrafi wykonywać trzy rodzaje operacji:',
          },
          {
            type: 'list',
            items: [
              'wykonać instrukcje po kolei (sekwencja)',
              'podjąć decyzję (warunek)',
              'powtórzyć fragment instrukcji (pętla)',
            ],
          },

          {
            type: 'heading',
            id: 'algorithm',
            level: 2,
            text: 'Algorytm: przepis na rozwiązanie problemu',
          },
          {
            type: 'paragraph',
            text: 'Algorytm to skończony zestaw kroków prowadzących do rozwiązania problemu. Nie jest jeszcze kodem. To plan.',
          },
          {
            type: 'paragraph',
            text: 'Dobry algorytm jest jednoznaczny. Każdy krok musi być tak opisany, żeby komputer (albo inny programista) wiedział dokładnie, co zrobić.',
          },

          {
            type: 'heading',
            id: 'example',
            level: 3,
            text: 'Przykład algorytmu (bez języka programowania)',
          },
          {
            type: 'code',
            title: 'Algorytm: sprawdzenie pełnoletności',
            language: 'text',
            code: '1. Pobierz wiek użytkownika\n2. Jeśli wiek jest większy lub równy 18:\n   - wypisz "pełnoletni"\n3. W przeciwnym razie:\n   - wypisz "niepełnoletni"\n',
          },

          {
            type: 'heading',
            id: 'errors',
            level: 2,
            text: 'Błędy: logiczne vs techniczne',
          },
          {
            type: 'paragraph',
            text: 'Na tym etapie ważne jest rozróżnienie dwóch typów błędów:',
          },
          {
            type: 'list',
            items: [
              'błędy techniczne — komputer nie może wykonać instrukcji',
              'błędy logiczne — komputer wykonuje instrukcje poprawnie, ale wynik jest zły',
            ],
          },
          {
            type: 'paragraph',
            text: 'Początkujący najczęściej walczą z błędami technicznymi. Doświadczeni programiści — z logicznymi.',
          },

          {
            type: 'callout',
            tone: 'info',
            title: 'Dlaczego to takie ważne?',
            text: 'Jeśli nie potrafisz rozpisać algorytmu bez kodu, to nie masz jeszcze rozwiązania problemu — masz tylko zgadywanie.',
          },
          {
            type: 'callout',
            tone: 'tip',
            title: 'Jak się uczyć',
            text: 'Zanim napiszesz kod, spróbuj rozpisać rozwiązanie w punktach. Jeśli nie potrafisz tego zrobić, kod też nie będzie działał.',
          },
          {
            type: 'callout',
            tone: 'highlight',
            title: 'Najważniejsza myśl',
            text: 'Programowanie to precyzyjne myślenie, a nie znajomość składni.',
          },
        ] as Prisma.InputJsonArray,
        summary: [
          'Komputer wykonuje instrukcje krok po kroku, bez domyślania się intencji.',
          'Program to uporządkowany zestaw instrukcji operujących na danych.',
          'Algorytm jest planem rozwiązania problemu, niezależnym od języka.',
          'Bez zrozumienia logiki nie da się skutecznie programować.',
        ],
      },
      {
        missionId: SEED_IDS.id_mission_article2_sprint1_moduleBase,
        tags: ['seed', 'article', 'basics', 'algorithms'],
        blocks: [
          {
            type: 'heading',
            id: 'intro',
            level: 2,
            text: 'Algorytm: myślenie zanim napiszesz kod',
          },
          {
            type: 'paragraph',
            text: 'Kod nie rozwiązuje problemów. Kod jedynie zapisuje rozwiązania, które już istnieją w twojej głowie. Jeśli nie masz algorytmu, to nie programujesz — zgadujesz.',
          },
          {
            type: 'paragraph',
            text: 'Ten artykuł nauczy cię, jak opisywać rozwiązania w sposób jednoznaczny i zrozumiały, zanim użyjesz jakiegokolwiek języka programowania.',
          },

          {
            type: 'heading',
            id: 'what-is-algorithm',
            level: 2,
            text: 'Czym naprawdę jest algorytm',
          },
          {
            type: 'paragraph',
            text: 'Algorytm to skończony zestaw kroków, który dla tych samych danych wejściowych zawsze prowadzi do tego samego wyniku. Musi być precyzyjny, kompletny i logiczny.',
          },
          {
            type: 'list',
            items: [
              'ma jasno określony początek i koniec',
              'każdy krok jest jednoznaczny',
              'nie zostawia miejsca na interpretację',
            ],
          },

          {
            type: 'heading',
            id: 'bad-algorithms',
            level: 2,
            text: 'Jak wygląda zły algorytm',
          },
          {
            type: 'paragraph',
            text: 'Początkujący często piszą algorytmy w stylu: „jeśli coś nie działa, popraw”. Dla komputera to bezużyteczne.',
          },
          {
            type: 'code',
            title: 'Zły algorytm',
            language: 'text',
            code: '1. Pobierz liczbę\n2. Zrób z nią coś\n3. Jeśli wynik jest zły, popraw\n',
          },

          {
            type: 'heading',
            id: 'good-algorithms',
            level: 2,
            text: 'Jak wygląda dobry algorytm',
          },
          {
            type: 'paragraph',
            text: 'Dobry algorytm rozbija problem na proste decyzje i operacje, które da się wykonać mechanicznie.',
          },
          {
            type: 'code',
            title: 'Dobry algorytm',
            language: 'text',
            code: '1. Pobierz dwie liczby\n2. Dodaj je\n3. Zapisz wynik\n4. Wyświetl wynik\n',
          },

          {
            type: 'heading',
            id: 'pseudocode',
            level: 2,
            text: 'Pseudokod: most między myśleniem a kodem',
          },
          {
            type: 'paragraph',
            text: 'Pseudokod to zapis algorytmu przypominający kod, ale bez składni konkretnego języka. Ma być czytelny dla człowieka, nie dla komputera.',
          },
          {
            type: 'paragraph',
            text: 'Dzięki pseudokodowi możesz skupić się na logice, zamiast walczyć ze składnią.',
          },

          {
            type: 'heading',
            id: 'pseudocode-example',
            level: 3,
            text: 'Przykład pseudokodu',
          },
          {
            type: 'code',
            title: 'Pseudokod: suma liczb',
            language: 'text',
            code: 'weź a\nweź b\nwynik = a + b\nwypisz wynik\n',
          },

          {
            type: 'heading',
            id: 'step-by-step',
            level: 2,
            text: 'Myślenie krok po kroku',
          },
          {
            type: 'paragraph',
            text: 'Komputer wykonuje tylko jeden krok naraz. Jeśli w jednym kroku próbujesz zrobić za dużo, algorytm przestaje być jasny.',
          },
          {
            type: 'list',
            items: ['jedna instrukcja = jedna czynność', 'brak skrótów myślowych', 'brak „oczywistych” kroków'],
          },

          {
            type: 'heading',
            id: 'logic-errors',
            level: 2,
            text: 'Błędy logiczne zaczynają się w algorytmie',
          },
          {
            type: 'paragraph',
            text: 'Jeśli algorytm jest zły, poprawny kod nadal będzie dawał złe wyniki. Debugowanie zaczyna się na kartce, nie w edytorze.',
          },

          {
            type: 'callout',
            tone: 'info',
            title: 'Fakt',
            text: 'Doświadczeni programiści częściej rysują lub piszą algorytm, niż od razu kodują.',
          },
          {
            type: 'callout',
            tone: 'tip',
            title: 'Ćwiczenie',
            text: 'Spróbuj opisać algorytm sprawdzania hasła bez użycia kodu. Jeśli utkniesz, problem jest w logice, nie w języku.',
          },
          {
            type: 'callout',
            tone: 'highlight',
            title: 'Sedno',
            text: 'Jeśli nie potrafisz opisać rozwiązania prostymi krokami, to jeszcze go nie masz.',
          },
        ] as Prisma.InputJsonArray,
        summary: [
          'Algorytm to precyzyjny plan rozwiązania problemu.',
          'Zły algorytm nie nadaje się do zapisania w kodzie.',
          'Pseudokod pomaga skupić się na logice zamiast składni.',
          'Błędy logiczne powstają przed napisaniem kodu.',
        ],
      },
      // Sprint 2
      {
        missionId: SEED_IDS.id_mission_article1_sprint2_moduleBase,
        tags: ['seed', 'article', 'cs', 'runtime'],
        blocks: [
          { type: 'heading', id: 'intro', level: 2, text: 'Co dzieje się pod spodem: CPU, RAM, dysk i procesy' },
          {
            type: 'paragraph',
            text: 'Jeśli na tym etapie uczysz się programowania, to prędzej czy później trafisz na klasyczne problemy: „program się zawiesza”, „zjada pamięć”, „nie zapisuje plików”, „działa u mnie, a u kogoś nie”. To nie jest magia. To konsekwencja tego, jak działa komputer i system operacyjny.',
          },
          {
            type: 'paragraph',
            text: 'W tym artykule poznasz minimalny zestaw pojęć, które realnie pomagają debugować: CPU, RAM, dysk, proces oraz wejście/wyjście (I/O). Bez wchodzenia w elektronikę i akademickie definicje.',
          },
          {
            type: 'list',
            items: [
              'CPU wykonuje instrukcje',
              'RAM trzyma dane „na teraz”',
              'dysk trzyma dane „na później”',
              'proces to uruchomiony program',
              'I/O to komunikacja ze światem (plik, sieć, konsola)',
            ],
          },

          { type: 'heading', id: 'cpu', level: 2, text: 'CPU: wykonawca instrukcji' },
          {
            type: 'paragraph',
            text: 'CPU (procesor) to element, który wykonuje instrukcje programu. Kiedy mówisz „program działa wolno”, często oznacza to, że CPU ma dużo pracy (np. liczy w pętli) albo czeka na I/O (np. dysk/sieć).',
          },
          {
            type: 'callout',
            tone: 'info',
            title: 'Ważne rozróżnienie',
            text: 'Wolny program nie zawsze oznacza „za mało CPU”. Czasem CPU się nudzi i czeka na dysk albo sieć.',
          },

          { type: 'heading', id: 'ram', level: 2, text: 'RAM: pamięć robocza' },
          {
            type: 'paragraph',
            text: 'RAM to pamięć operacyjna używana podczas działania programu. Zmienne, listy, obiekty — wszystko ląduje w RAM. RAM jest szybki, ale ograniczony. Jeśli programu „nie stać” na tyle RAM, zaczyna się problem.',
          },
          {
            type: 'list',
            items: [
              'RAM = szybko, ale mało',
              'dysk = wolniej, ale dużo',
              'dane w RAM znikają po zakończeniu programu (chyba że je zapiszesz)',
            ],
          },
          {
            type: 'callout',
            tone: 'tip',
            title: 'Praktyczna intuicja',
            text: 'Jeśli trzymasz wszystko w pamięci „bo wygodnie”, to przy większych danych aplikacja padnie albo zacznie mielić.',
          },

          { type: 'heading', id: 'disk', level: 2, text: 'Dysk: trwałość danych' },
          {
            type: 'paragraph',
            text: 'Dysk (SSD/HDD) przechowuje dane trwale: pliki, bazy danych, konfiguracje. Operacje dyskowe są dużo wolniejsze niż operacje w RAM, ale za to dane nie znikają po wyłączeniu programu.',
          },
          {
            type: 'paragraph',
            text: 'Klasyczny błąd początkujących: mylenie „mam dane w zmiennej” z „mam dane zapisane”. Zmienna w RAM nie jest zapisem na dysku.',
          },

          { type: 'heading', id: 'process', level: 2, text: 'Proces: uruchomiony program' },
          {
            type: 'paragraph',
            text: 'Program jako plik na dysku to tylko „przepis”. Dopiero po uruchomieniu staje się procesem: system operacyjny przydziela mu pamięć, czas CPU i pozwala korzystać z zasobów (plików, sieci itd.).',
          },
          {
            type: 'list',
            items: [
              'jeden plik programu może uruchomić wiele procesów',
              'proces ma własną pamięć i stan',
              'proces może się zakończyć normalnie albo przez błąd',
            ],
          },

          { type: 'heading', id: 'io', level: 2, text: 'I/O: wejście/wyjście i czekanie' },
          {
            type: 'paragraph',
            text: 'I/O (Input/Output) to wszystko, co wymaga komunikacji z czymś „poza CPU”: zapis/odczyt pliku, pobranie danych z sieci, wypisanie na ekran, odczyt z klawiatury.',
          },
          {
            type: 'paragraph',
            text: 'I/O jest zwykle wolniejsze niż obliczenia. Dlatego program może „stać” — bo czeka. To normalne, ale trzeba to rozumieć, żeby nie optymalizować złej rzeczy.',
          },

          { type: 'heading', id: 'mini-scenarios', level: 3, text: 'Trzy typowe sytuacje (i co znaczą)' },
          {
            type: 'list',
            items: [
              'Program zużywa coraz więcej pamięci → trzymasz dane w RAM bez kontroli albo nie zwalniasz zasobów.',
              'Program „wisi” przy zapisie/odczycie → czeka na dysk/sieć (I/O), a nie „myśli”.',
              'Dane znikają po zamknięciu aplikacji → były tylko w RAM, nie zostały zapisane na dysku.',
            ],
          },

          {
            type: 'callout',
            tone: 'highlight',
            title: 'Najważniejsza myśl',
            text: 'CPU liczy, RAM trzyma stan, dysk utrwala, a proces to uruchomiony program. Większość problemów „dlaczego to nie działa” da się zmapować na jeden z tych elementów.',
          },
        ] as Prisma.InputJsonArray,
        summary: [
          'CPU wykonuje instrukcje, ale często czeka na I/O (dysk/sieć).',
          'RAM to szybka pamięć robocza na dane w trakcie działania programu.',
          'Dysk zapewnia trwałość danych, ale operacje na nim są wolniejsze.',
          'Proces to uruchomiony program zarządzany przez system operacyjny.',
          'Wiele problemów z wydajnością i błędami wynika z niezrozumienia RAM/dysku/I/O.',
        ],
      },
      // Sprint 3
      {
        missionId: SEED_IDS.id_mission_article1_sprint3_moduleBase,
        tags: ['seed', 'article', 'basics', 'debugging'],
        blocks: [
          { type: 'heading', id: 'intro', level: 2, text: 'Od algorytmu do kodu: składnia, znaczenie i debugowanie' },
          {
            type: 'paragraph',
            text: 'W tym sprincie chodzi o „most”: umiesz już myśleć krokami i rozumiesz, co dzieje się pod spodem. Teraz uczysz się pisać kod tak, żeby nie walczyć godzinami z głupimi błędami. Klucz to rozróżnienie: składnia (czy kod da się uruchomić) vs znaczenie (czy robi to, co ma robić).',
          },
          {
            type: 'list',
            items: [
              'składnia vs semantyka',
              'return vs print',
              'funkcje i kontrakt (wejście → wyjście)',
              'scope: co jest widoczne gdzie',
              'czytanie błędów i minimalny debugging',
              'przypadki brzegowe i testy',
            ],
          },

          { type: 'heading', id: 'syntax-semantics', level: 2, text: 'Składnia vs semantyka' },
          {
            type: 'paragraph',
            text: 'Błąd składni oznacza: interpreter nie rozumie zapisu. Błąd semantyczny/logiczny oznacza: kod się uruchamia, ale wynik jest zły. Początkujący często mylą jedno z drugim.',
          },
          {
            type: 'code',
            title: 'Przykład: błąd składni',
            language: 'python',
            code: 'def add(a, b)\n    return a + b\n',
          },
          {
            type: 'code',
            title: 'Przykład: błąd logiczny (uruchamia się, ale jest źle)',
            language: 'python',
            code: 'def add(a, b):\n    return a - b\n',
          },

          { type: 'heading', id: 'return-print', level: 2, text: 'return vs print' },
          {
            type: 'paragraph',
            text: 'return zwraca wartość z funkcji do miejsca wywołania. print tylko wypisuje tekst. W zadaniach z testami zwykle musisz zwrócić wartość, nie wypisywać.',
          },
          {
            type: 'code',
            title: 'return zwraca wynik',
            language: 'python',
            code: 'def solve(a, b):\n    return a + b\n',
          },
          {
            type: 'code',
            title: 'print nie zwraca wyniku (zwykle błąd w taskach funkcji)',
            language: 'python',
            code: 'def solve(a, b):\n    print(a + b)\n    return 0\n',
          },

          { type: 'heading', id: 'functions-contract', level: 2, text: 'Funkcja jako kontrakt' },
          {
            type: 'paragraph',
            text: 'Myśl o funkcji jak o kontrakcie: jakie przyjmuje argumenty, co zwraca i w jakich przypadkach. To ogranicza chaos i ułatwia testowanie.',
          },
          {
            type: 'list',
            items: [
              'Wejście: typy i format argumentów',
              'Wyjście: typ i znaczenie zwracanej wartości',
              'Zachowanie na brzegach: puste dane, zakresy, wartości ekstremalne',
            ],
          },

          { type: 'heading', id: 'scope', level: 2, text: 'Scope: co jest widoczne gdzie' },
          {
            type: 'paragraph',
            text: 'Zmienna zdefiniowana wewnątrz funkcji żyje tylko w funkcji. To najczęstsza przyczyna „NameError” i dziwnych zależności w kodzie.',
          },
          {
            type: 'code',
            title: 'Przykład: zmienna lokalna',
            language: 'python',
            code: 'def f():\n    x = 10\n    return x\n\n# x tutaj nie istnieje\n',
          },

          { type: 'heading', id: 'reading-errors', level: 2, text: 'Czytanie błędów: minimalna higiena' },
          {
            type: 'paragraph',
            text: 'Komunikat błędu to nie „kara”. To informacja: co się stało i gdzie. Szukaj typu błędu (np. IndexError) i linii, w której wystąpił.',
          },
          {
            type: 'list',
            items: [
              'TypeError → zły typ danych do operacji',
              'NameError → używasz zmiennej, która nie istnieje w tym scope',
              'IndexError → indeks poza zakresem listy',
              'ValueError → poprawny typ, ale zła wartość (np. int("a"))',
            ],
          },

          { type: 'heading', id: 'edge-cases', level: 2, text: 'Przypadki brzegowe i testy' },
          {
            type: 'paragraph',
            text: 'Najwięcej bugów siedzi na brzegach: puste dane, indeks 0, ostatni element, wartości ujemne, bardzo duże liczby. Testy powinny to łapać.',
          },
          {
            type: 'callout',
            tone: 'tip',
            title: 'Zasada',
            text: 'Zanim uznasz, że działa: dodaj test na puste dane i na „za duży” indeks. To wycina masę problemów.',
          },
          {
            type: 'callout',
            tone: 'highlight',
            title: 'Sedno sprintu 3',
            text: 'Pisanie kodu to głównie kontrola znaczenia: kontrakt funkcji, brzegowe przypadki, czytanie błędów i szybkie poprawki.',
          },
        ] as Prisma.InputJsonArray,
        summary: [
          'Składnia decyduje, czy kod się uruchomi; semantyka, czy wynik jest poprawny.',
          'W zadaniach funkcyjnych zwykle zwracasz wynik (return), nie wypisujesz (print).',
          'Funkcja to kontrakt: wejście, wyjście i zachowanie na brzegach.',
          'Scope tłumaczy, czemu zmienne „nie istnieją” poza funkcją.',
          'Czytanie typów błędów i testowanie brzegów skraca debugging.',
        ],
      },
      // Module: Python Entry
      // Sprint 1
      {
        missionId: SEED_IDS.id_mission_article1_sprint1_modulePythonEntry,
        tags: ['seed', 'article', 'python', 'entry'],
        blocks: [
          { type: 'heading', id: 'intro', level: 2, text: 'Start w Pythonie: zmienne, typy i operatory' },
          {
            type: 'paragraph',
            text: 'Sprint 1 to absolutne podstawy Pythona. Cel jest prosty: pisać krótkie funkcje, które działają i zwracają poprawne typy. Bez klas, bez bibliotek, bez „magii”.',
          },
          {
            type: 'list',
            items: [
              'zmienne i przypisanie',
              'typy: int, float, str, bool',
              'operatory: arytmetyczne i porównania',
              'konwersje typów: int(), float(), str()',
              'return (a nie print)',
            ],
          },

          { type: 'heading', id: 'variables', level: 2, text: 'Zmienne: etykieta na wartość' },
          {
            type: 'paragraph',
            text: 'Zmienna to nazwa wskazująca na wartość w pamięci. W Pythonie nie deklarujesz typu — typ wynika z przypisanej wartości.',
          },
          {
            type: 'code',
            title: 'Przypisanie wartości',
            language: 'python',
            code: 'x = 10\nname = "Ala"\nis_active = True\n',
          },

          { type: 'heading', id: 'types', level: 2, text: 'Typy danych: co trzymasz w zmiennej' },
          {
            type: 'paragraph',
            text: 'Typ danych określa, jakie operacje mają sens. Najczęściej na starcie: int, float, str, bool.',
          },
          {
            type: 'list',
            items: [
              'int — liczby całkowite (np. 7, -2)',
              'float — liczby zmiennoprzecinkowe (np. 3.14)',
              'str — tekst (np. "hello")',
              'bool — True/False',
            ],
          },
          {
            type: 'callout',
            tone: 'info',
            title: 'Pułapka',
            text: 'Tekst "123" to str, a liczba 123 to int. Wyglądają podobnie, ale zachowują się inaczej.',
          },

          { type: 'heading', id: 'operators', level: 2, text: 'Operatory: podstawowe działania' },
          {
            type: 'paragraph',
            text: 'Masz operatory arytmetyczne (np. +, -, *, /) i porównania (np. ==, !=, <, <=). Porównania zwracają bool.',
          },
          {
            type: 'code',
            title: 'Przykłady operatorów',
            language: 'python',
            code: 'a = 5\nb = 2\n\nsum_ = a + b      # 7\nmul = a * b       # 10\ndiv = a / b       # 2.5\n\nis_ok = a <= b    # False\n',
          },

          { type: 'heading', id: 'conversions', level: 2, text: 'Konwersje typów: kiedy musisz zmienić typ' },
          {
            type: 'paragraph',
            text: 'Czasem musisz jawnie zmienić typ danych. Konwersja to nie „widzimisię” — to narzędzie, żeby dane miały sens w obliczeniach.',
          },
          {
            type: 'code',
            title: 'Konwersje',
            language: 'python',
            code: 'x = int("123")      # 123\npi = float("3.14") # 3.14\ns = str(10)         # "10"\n',
          },
          {
            type: 'callout',
            tone: 'tip',
            title: 'Dobra praktyka',
            text: 'Jeśli funkcja ma zwracać liczbę — zwracaj liczbę, nie string. Typ wyniku ma znaczenie w testach.',
          },

          { type: 'heading', id: 'return', level: 2, text: 'return vs print' },
          {
            type: 'paragraph',
            text: 'W zadaniach opartych o funkcje testy sprawdzają wartość zwracaną. print nic nie zwraca — tylko wypisuje. Jeśli masz zwrócić wynik, używasz return.',
          },
          {
            type: 'code',
            title: 'Poprawnie: return',
            language: 'python',
            code: 'def solve(a, b):\n    return a + b\n',
          },
          {
            type: 'callout',
            tone: 'highlight',
            title: 'Takeaway',
            text: 'W Sprint 1 najczęstszy błąd to zwracanie złego typu albo używanie print zamiast return.',
          },
        ] as Prisma.InputJsonArray,
        summary: [
          'Zmienna wskazuje na wartość, a typ wynika z przypisania.',
          'Podstawowe typy to int, float, str i bool.',
          'Porównania zwracają bool (True/False).',
          'Konwersje int()/float()/str() są potrzebne, gdy typ danych nie pasuje do operacji.',
          'W zadaniach funkcyjnych zwykle używasz return, nie print.',
        ],
      },
      // Sprint 2
      {
        missionId: SEED_IDS.id_mission_article1_sprint2_modulePythonEntry,
        tags: ['seed', 'article', 'python', 'entry'],
        blocks: [
          { type: 'heading', id: 'intro', level: 2, text: 'Warunki i logika: if, porównania i booleany' },
          {
            type: 'paragraph',
            text: 'Sprint 2 to podejmowanie decyzji w kodzie. Uczysz się instrukcji if/elif/else, operatorów porównania i logiki boolean. Cel: pisać funkcje, które zwracają poprawny wynik dla różnych przypadków, zamiast działać „dla jednego przykładu”.',
          },
          {
            type: 'list',
            items: [
              'if / elif / else',
              'operatory porównania: ==, !=, <, <=, >, >=',
              'bool: True/False',
              'logika: and / or / not',
              'najczęstsze pułapki: kolejność warunków i == vs =',
            ],
          },

          { type: 'heading', id: 'comparisons', level: 2, text: 'Porównania zwracają bool' },
          {
            type: 'paragraph',
            text: 'Wyrażenia porównujące zawsze zwracają True albo False. To podstawowy budulec warunków.',
          },
          {
            type: 'code',
            title: 'Porównania',
            language: 'python',
            code: 'a = 3\nb = 5\n\nx = a < b    # True\ny = a == b   # False\nz = a <= 3   # True\n',
          },

          { type: 'heading', id: 'if', level: 2, text: 'Instrukcja if/elif/else' },
          {
            type: 'paragraph',
            text: 'if wykonuje blok kodu tylko wtedy, gdy warunek jest True. elif to kolejne sprawdzenie, a else działa, gdy żaden warunek wcześniej nie zadziałał.',
          },
          {
            type: 'code',
            title: 'if/elif/else',
            language: 'python',
            code: 'def grade(points):\n    if points >= 90:\n        return "A"\n    elif points >= 70:\n        return "B"\n    else:\n        return "C"\n',
          },
          {
            type: 'callout',
            tone: 'info',
            title: 'Kolejność ma znaczenie',
            text: 'Jeśli najpierw dasz warunek „points >= 70”, to „points >= 90” nigdy nie zadziała, bo 90 też spełnia >= 70.',
          },

          { type: 'heading', id: 'boolean-ops', level: 2, text: 'Logika: and / or / not' },
          {
            type: 'paragraph',
            text: 'Operatory logiczne łączą warunki. and wymaga, żeby oba były True. or wymaga, żeby przynajmniej jeden był True. not odwraca wartość logiczną.',
          },
          {
            type: 'code',
            title: 'and / or / not',
            language: 'python',
            code: 'age = 20\nhas_id = True\n\ncan_enter = (age >= 18) and has_id\nis_child = not (age >= 18)\n',
          },

          { type: 'heading', id: 'pitfalls', level: 2, text: 'Typowe błędy początkujących' },
          {
            type: 'list',
            items: [
              'Mylenie = (przypisanie) z == (porównanie)',
              'Zła kolejność warunków w if/elif',
              'Zwracanie złego typu (np. "True" jako string zamiast True jako bool)',
              'Brak else, gdy potrzebujesz obsłużyć przypadek „w przeciwnym razie”',
            ],
          },
          {
            type: 'callout',
            tone: 'highlight',
            title: 'Takeaway',
            text: 'Warunki są proste, ale bez testów łatwo pominąć przypadek. Pisz tak, żeby działało dla różnych wejść, nie dla jednego przykładu.',
          },
        ] as Prisma.InputJsonArray,
        summary: [
          'Porównania zwracają wartości logiczne True/False.',
          'if/elif/else pozwala podejmować decyzje w kodzie; kolejność warunków ma znaczenie.',
          'Operatory and/or/not służą do łączenia i negowania warunków.',
          'Typowe błędy to = vs == oraz zwracanie złego typu.',
        ],
      },
      // Sprint 3
      {
        missionId: SEED_IDS.id_mission_article1_sprint3_modulePythonEntry,
        tags: ['seed', 'article', 'python', 'entry'],
        blocks: [
          { type: 'heading', id: 'intro', level: 2, text: 'Pętle i iteracja: for, while i range' },
          {
            type: 'paragraph',
            text: 'Sprint 3 wprowadza pętle, czyli sposób na wykonywanie tej samej operacji wiele razy. Zamiast pisać ten sam kod w kółko, używasz for albo while. Cel: umieć przejść po danych i policzyć, zliczyć albo znaleźć wynik.',
          },
          {
            type: 'list',
            items: [
              'pętla for',
              'pętla while',
              'range()',
              'iteracja po stringach i listach',
              'zliczanie i sumowanie',
              'break i continue',
            ],
          },

          { type: 'heading', id: 'for-loop', level: 2, text: 'Pętla for: iteracja po elementach' },
          {
            type: 'paragraph',
            text: 'Pętla for służy do przechodzenia po elementach kolekcji albo po zakresie liczb. Wykonuje się raz dla każdego elementu.',
          },
          {
            type: 'code',
            title: 'for z range',
            language: 'python',
            code: 'for i in range(3):\n    print(i)\n# 0, 1, 2\n',
          },
          {
            type: 'code',
            title: 'for po stringu',
            language: 'python',
            code: 'text = "abc"\nfor ch in text:\n    print(ch)\n',
          },

          { type: 'heading', id: 'range', level: 2, text: 'range(): kontrola liczby iteracji' },
          {
            type: 'paragraph',
            text: 'range(n) generuje liczby od 0 do n-1. To bardzo częste źródło błędów off-by-one u początkujących.',
          },
          {
            type: 'code',
            title: 'range przykłady',
            language: 'python',
            code: 'range(5)      # 0,1,2,3,4\nrange(1, 5)   # 1,2,3,4\n',
          },

          { type: 'heading', id: 'while-loop', level: 2, text: 'Pętla while: dopóki warunek jest True' },
          {
            type: 'paragraph',
            text: 'while wykonuje się tak długo, jak warunek jest True. Zła kontrola warunku prowadzi do nieskończonej pętli.',
          },
          {
            type: 'code',
            title: 'while',
            language: 'python',
            code: 'x = 0\nwhile x < 3:\n    print(x)\n    x += 1\n',
          },
          {
            type: 'callout',
            tone: 'info',
            title: 'Uwaga',
            text: 'Jeśli warunek nigdy nie stanie się False, pętla while nigdy się nie skończy.',
          },

          { type: 'heading', id: 'count-sum', level: 2, text: 'Zliczanie i sumowanie' },
          {
            type: 'paragraph',
            text: 'Najczęstsze zastosowanie pętli to zliczanie elementów albo sumowanie wartości.',
          },
          {
            type: 'code',
            title: 'Sumowanie',
            language: 'python',
            code: 'numbers = [1, 2, 3]\ntotal = 0\nfor n in numbers:\n    total += n\n',
          },

          { type: 'heading', id: 'break-continue', level: 2, text: 'break i continue' },
          {
            type: 'paragraph',
            text: 'break przerywa pętlę, continue pomija aktualną iterację i przechodzi do następnej.',
          },
          {
            type: 'code',
            title: 'break / continue',
            language: 'python',
            code: 'for i in range(5):\n    if i == 2:\n        continue\n    if i == 4:\n        break\n    print(i)\n',
          },

          {
            type: 'callout',
            tone: 'highlight',
            title: 'Takeaway',
            text: 'Pętle służą do pracy na wielu elementach. Najpierw for, potem while. Zawsze pilnuj warunku zakończenia.',
          },
        ] as Prisma.InputJsonArray,
        summary: [
          'Pętla for iteruje po elementach lub zakresie.',
          'range() generuje liczby od 0 do n-1.',
          'while działa dopóki warunek jest True.',
          'Pętle często służą do zliczania i sumowania.',
          'break przerywa pętlę, continue pomija iterację.',
        ],
      },
      // Sprint 4
      {
        missionId: SEED_IDS.id_mission_article1_sprint4_modulePythonEntry,
        tags: ['seed', 'article', 'python', 'entry'],
        blocks: [
          { type: 'heading', id: 'intro', level: 2, text: 'Funkcje i scope: jak porządkować kod' },
          {
            type: 'paragraph',
            text: 'Sprint 4 to przejście z „piszę kod w jednym miejscu” do „piszę funkcje”. Funkcja to kontrakt: bierze argumenty, zwraca wynik i nie powinna mieć ukrytych efektów ubocznych. Do tego dochodzi scope: gdzie zmienne istnieją i czemu czasem „znikają”.',
          },
          {
            type: 'list',
            items: [
              'def i wywołanie funkcji',
              'argumenty i wartości domyślne',
              'return (zwracanie wartości)',
              'scope: zmienne lokalne vs globalne',
              'czyste funkcje (bez efektów ubocznych)',
            ],
          },

          { type: 'heading', id: 'def-call', level: 2, text: 'Definiowanie i wywoływanie funkcji' },
          {
            type: 'paragraph',
            text: 'Funkcja to blok kodu nazwany po to, żeby używać go wielokrotnie. Definiujesz ją raz, a potem wywołujesz z różnymi argumentami.',
          },
          {
            type: 'code',
            title: 'def i wywołanie',
            language: 'python',
            code: 'def add(a, b):\n    return a + b\n\nx = add(2, 3)  # 5\n',
          },

          { type: 'heading', id: 'args', level: 2, text: 'Argumenty i wartości domyślne' },
          {
            type: 'paragraph',
            text: 'Argumenty to dane wejściowe funkcji. Możesz też ustawić wartości domyślne, gdy argument nie zostanie podany.',
          },
          {
            type: 'code',
            title: 'Wartość domyślna',
            language: 'python',
            code: 'def greet(name, prefix="Hi"):\n    return prefix + " " + name\n\ns1 = greet("Ala")\ns2 = greet("Ala", "Cześć")\n',
          },

          { type: 'heading', id: 'return', level: 2, text: 'return: zwracanie wyniku' },
          {
            type: 'paragraph',
            text: 'return kończy funkcję i zwraca wartość. Jeśli nie użyjesz return, Python zwróci None. W zadaniach testowanych prawie zawsze musisz coś zwrócić.',
          },
          {
            type: 'code',
            title: 'Brak return → None',
            language: 'python',
            code: 'def f():\n    x = 10\n\n# f() zwraca None\n',
          },
          {
            type: 'callout',
            tone: 'info',
            title: 'Najczęstszy błąd',
            text: 'Użytkownik myśli, że funkcja „zwróciła”, bo coś wypisał printem. Testy sprawdzają return, nie print.',
          },

          { type: 'heading', id: 'scope', level: 2, text: 'Scope: gdzie żyją zmienne' },
          {
            type: 'paragraph',
            text: 'Zmienna zdefiniowana wewnątrz funkcji jest lokalna — istnieje tylko w tej funkcji. Poza nią nie jest dostępna.',
          },
          {
            type: 'code',
            title: 'Zmienna lokalna',
            language: 'python',
            code: 'def g():\n    y = 5\n    return y\n\n# y tutaj nie istnieje\n',
          },

          { type: 'heading', id: 'clean', level: 2, text: 'Czyste funkcje: mniej chaosu' },
          {
            type: 'paragraph',
            text: 'Na start warto pisać funkcje „czyste”: wynik zależy tylko od argumentów i funkcja nie zmienia niczego na zewnątrz. Takie funkcje łatwo testować.',
          },
          {
            type: 'callout',
            tone: 'highlight',
            title: 'Takeaway',
            text: 'Funkcja = kontrakt. Zwracaj wartości przez return i pilnuj scope. To jest fundament czytelnego kodu.',
          },
        ] as Prisma.InputJsonArray,
        summary: [
          'Funkcje pomagają porządkować kod i używać logiki wielokrotnie.',
          'Argumenty są wejściem funkcji; można stosować wartości domyślne.',
          'return zwraca wynik; brak return oznacza None.',
          'Zmienne lokalne istnieją tylko wewnątrz funkcji (scope).',
          'Czyste funkcje są łatwiejsze do testowania i utrzymania.',
        ],
      },
      // Sprint 5
      {
        missionId: SEED_IDS.id_mission_article1_sprint5_modulePythonEntry,
        tags: ['seed', 'article', 'python', 'entry'],
        blocks: [
          { type: 'heading', id: 'intro', level: 2, text: 'Kolekcje w Pythonie: listy, krotki, słowniki i zbiory' },
          {
            type: 'paragraph',
            text: 'Sprint 5 to praca na wielu wartościach naraz. Poznasz podstawowe kolekcje Pythona: listy, krotki, słowniki i zbiory. Celem nie jest „znać wszystko”, tylko umieć dobrać strukturę danych i wykonać typowe operacje.',
          },
          {
            type: 'list',
            items: [
              'list: kolejność, duplikaty, modyfikowalna',
              'tuple: kolejność, duplikaty, niemodyfikowalna',
              'dict: pary klucz → wartość',
              'set: unikalne elementy',
            ],
          },

          { type: 'heading', id: 'list', level: 2, text: 'Lista (list): najczęstsza struktura' },
          {
            type: 'paragraph',
            text: 'Lista przechowuje elementy w kolejności. Możesz dodawać, usuwać i zmieniać elementy. Indeksy zaczynają się od 0.',
          },
          {
            type: 'code',
            title: 'Listy: podstawy',
            language: 'python',
            code: 'arr = [10, 20, 30]\narr.append(40)\nfirst = arr[0]      # 10\nlength = len(arr)   # 4\n',
          },
          {
            type: 'callout',
            tone: 'info',
            title: 'Pułapka',
            text: 'arr[3] jest poprawne tylko jeśli lista ma co najmniej 4 elementy. Inaczej będzie IndexError.',
          },

          { type: 'heading', id: 'tuple', level: 2, text: 'Krotka (tuple): jak lista, ale stała' },
          {
            type: 'paragraph',
            text: 'Tuple jest podobna do listy, ale nie możesz jej modyfikować. Przydaje się, gdy chcesz dane „stałe”.',
          },
          {
            type: 'code',
            title: 'Tuple',
            language: 'python',
            code: 'point = (3, 7)\nx = point[0]\n',
          },

          { type: 'heading', id: 'dict', level: 2, text: 'Słownik (dict): klucz → wartość' },
          {
            type: 'paragraph',
            text: 'Dict przechowuje mapowanie: klucz do wartości. Klucze są unikalne. To podstawowa struktura do zliczania, wyszukiwania i przechowywania „właściwości”.',
          },
          {
            type: 'code',
            title: 'Dict: podstawy',
            language: 'python',
            code: 'user = {"name": "Ala", "age": 20}\nage = user["age"]\nuser["age"] = 21\n',
          },
          {
            type: 'code',
            title: 'Dict: bezpieczne pobieranie',
            language: 'python',
            code: 'value = user.get("city")      # None jeśli brak\nvalue2 = user.get("city", "N/A")\n',
          },
          {
            type: 'callout',
            tone: 'tip',
            title: 'Dobra praktyka',
            text: 'Gdy klucza może nie być, używaj .get(). Unikasz KeyError.',
          },

          { type: 'heading', id: 'set', level: 2, text: 'Zbiór (set): unikalne elementy' },
          {
            type: 'paragraph',
            text: 'Set przechowuje tylko unikalne wartości. Nie ma sensu mówić o „kolejności” w zbiorze. Świetny do usuwania duplikatów i szybkiego sprawdzania „czy element istnieje”.',
          },
          {
            type: 'code',
            title: 'Set',
            language: 'python',
            code: 's = {1, 2, 2, 3}\n# s to {1, 2, 3}\nexists = 2 in s  # True\n',
          },

          { type: 'heading', id: 'choose', level: 2, text: 'Jak dobrać strukturę danych' },
          {
            type: 'list',
            items: [
              'Chcesz kolejność i duplikaty → list',
              'Chcesz „stałą” sekwencję → tuple',
              'Chcesz mapowania klucz→wartość → dict',
              'Chcesz unikalności / szybkiego sprawdzania membership → set',
            ],
          },

          {
            type: 'callout',
            tone: 'highlight',
            title: 'Takeaway',
            text: 'Najczęściej w praktyce używasz list i dict. Set jest świetny do unikalności, a tuple do „stałych” danych.',
          },
        ] as Prisma.InputJsonArray,
        summary: [
          'Listy są modyfikowalne i trzymają kolejność.',
          'Tuple są niemodyfikowalne, dobre na „stałe” dane.',
          'Dict przechowuje mapowanie klucz → wartość i jest świetny do zliczania i wyszukiwania.',
          'Set przechowuje unikalne elementy i ułatwia usuwanie duplikatów.',
          'Dobór struktury zależy od wymagań: kolejność, unikalność, mapowanie.',
        ],
      },
    ],
    skipDuplicates: true,
  })
}

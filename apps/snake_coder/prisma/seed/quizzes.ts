import type { Prisma, PrismaClient } from '../../src/generated/prisma/client'

import { SEED_IDS } from './ids'

export const seedQuizzes = async (prisma: PrismaClient) => {
  await prisma.quiz.createMany({
    data: [
      // module: Basics
      // sprint 1
      {
        missionId: SEED_IDS.id_mission_quiz1_sprint1_moduleBase,
        questions: [
          {
            id: 'q1',
            order: 1,
            title: 'Komputer a intencje',
            prompt: 'Które stwierdzenie najlepiej opisuje, jak komputer wykonuje program?',
            options: [
              {
                id: 'opt-1',
                order: 1,
                label: 'Komputer domyśla się brakujących kroków, jeśli są oczywiste.',
                isCorrect: false,
              },
              {
                id: 'opt-2',
                order: 2,
                label: 'Komputer wykonuje instrukcje dokładnie w kolejności, w jakiej zostały zapisane.',
                isCorrect: true,
              },
              {
                id: 'opt-3',
                order: 3,
                label: 'Komputer interpretuje instrukcje zależnie od kontekstu, jak człowiek.',
                isCorrect: false,
              },
              {
                id: 'opt-4',
                order: 4,
                label: 'Komputer poprawia błędy logiczne, jeśli widzi „zły wynik”.',
                isCorrect: false,
              },
            ],
          },
          {
            id: 'q2',
            order: 2,
            title: 'Czym są dane?',
            prompt: 'Co jest najlepszą definicją „danych” z perspektywy komputera?',
            options: [
              { id: 'opt-1', order: 1, label: 'Tylko liczby i tekst; obrazy to nie dane.', isCorrect: false },
              {
                id: 'opt-2',
                order: 2,
                label: 'Wszystko, na czym program operuje: liczby, tekst, kliknięcia, pliki.',
                isCorrect: true,
              },
              {
                id: 'opt-3',
                order: 3,
                label: 'Dane to tylko to, co użytkownik wpisze z klawiatury.',
                isCorrect: false,
              },
              { id: 'opt-4', order: 4, label: 'Dane to to samo co algorytm.', isCorrect: false },
            ],
          },
          {
            id: 'q3',
            order: 3,
            title: 'Trzy podstawowe mechanizmy',
            prompt: 'Który zestaw najlepiej opisuje podstawowe „klocki” wykonywania programu?',
            options: [
              { id: 'opt-1', order: 1, label: 'Funkcje, klasy, moduły', isCorrect: false },
              { id: 'opt-2', order: 2, label: 'Bazy danych, API, UI', isCorrect: false },
              { id: 'opt-3', order: 3, label: 'Sekwencja, warunek, pętla', isCorrect: true },
              { id: 'opt-4', order: 4, label: 'Kompilacja, wdrożenie, hosting', isCorrect: false },
            ],
          },
          {
            id: 'q4',
            order: 4,
            title: 'Błąd logiczny',
            prompt: 'Co oznacza „błąd logiczny” w programowaniu?',
            options: [
              { id: 'opt-1', order: 1, label: 'Program nie uruchamia się, bo ma złą składnię.', isCorrect: false },
              {
                id: 'opt-2',
                order: 2,
                label: 'Komputer wykonuje instrukcje, ale wynik jest niezgodny z oczekiwaniem.',
                isCorrect: true,
              },
              { id: 'opt-3', order: 3, label: 'Program nie ma dostępu do internetu.', isCorrect: false },
              { id: 'opt-4', order: 4, label: 'Komputer nie rozumie typów danych.', isCorrect: false },
            ],
          },
          {
            id: 'q5',
            order: 5,
            title: 'Precyzja instrukcji',
            prompt: 'Która instrukcja jest problematyczna z perspektywy komputera (bo jest niejednoznaczna)?',
            options: [
              { id: 'opt-1', order: 1, label: 'Jeśli wiek >= 18, wypisz "pełnoletni".', isCorrect: false },
              { id: 'opt-2', order: 2, label: 'Dodaj a i b, zapisz w wynik.', isCorrect: false },
              { id: 'opt-3', order: 3, label: 'Popraw wynik, jeśli jest zły.', isCorrect: true },
              { id: 'opt-4', order: 4, label: 'Wczytaj liczbę z wejścia.', isCorrect: false },
            ],
          },
        ] as Prisma.InputJsonArray,
      },
      {
        missionId: SEED_IDS.id_mission_quiz2_sprint1_moduleBase,
        questions: [
          {
            id: 'q1',
            order: 1,
            title: 'Algorytm vs zgadywanie',
            prompt: 'Które stwierdzenie najlepiej opisuje algorytm?',
            options: [
              {
                id: 'opt-1',
                order: 1,
                label: 'Opis rozwiązania, który może mieć niejasne kroki, bo „wiadomo o co chodzi”.',
                isCorrect: false,
              },
              {
                id: 'opt-2',
                order: 2,
                label: 'Skończony i jednoznaczny zestaw kroków prowadzący do wyniku.',
                isCorrect: true,
              },
              { id: 'opt-3', order: 3, label: 'Dowolny fragment kodu w wybranym języku.', isCorrect: false },
              { id: 'opt-4', order: 4, label: 'Lista bibliotek potrzebnych do projektu.', isCorrect: false },
            ],
          },
          {
            id: 'q2',
            order: 2,
            title: 'Pseudokod',
            prompt: 'Po co używa się pseudokodu?',
            options: [
              {
                id: 'opt-1',
                order: 1,
                label: 'Żeby komputer mógł uruchomić program bez kompilatora.',
                isCorrect: false,
              },
              {
                id: 'opt-2',
                order: 2,
                label: 'Żeby skupić się na logice bez walki ze składnią języka.',
                isCorrect: true,
              },
              { id: 'opt-3', order: 3, label: 'Żeby zastąpić testy jednostkowe.', isCorrect: false },
              { id: 'opt-4', order: 4, label: 'Żeby przyspieszyć działanie programu.', isCorrect: false },
            ],
          },
          {
            id: 'q3',
            order: 3,
            title: 'Jedna instrukcja = jedna czynność',
            prompt: 'Który zapis lepiej spełnia zasadę „krok jest jednoznaczny i mały”?',
            options: [
              { id: 'opt-1', order: 1, label: 'Zrób walidację i zapisz do bazy.', isCorrect: false },
              {
                id: 'opt-2',
                order: 2,
                label: 'Wczytaj email. Sprawdź czy ma znak "@". Jeśli nie, zwróć błąd.',
                isCorrect: true,
              },
              { id: 'opt-3', order: 3, label: 'Napraw dane, jeśli są niepoprawne.', isCorrect: false },
              { id: 'opt-4', order: 4, label: 'Ogarnij logowanie użytkownika.', isCorrect: false },
            ],
          },
          {
            id: 'q4',
            order: 4,
            title: 'Skąd biorą się błędy logiczne',
            prompt: 'Dlaczego poprawny kod może dawać zły wynik?',
            options: [
              { id: 'opt-1', order: 1, label: 'Bo komputer czasem działa losowo.', isCorrect: false },
              { id: 'opt-2', order: 2, label: 'Bo algorytm (logika kroków) jest błędny.', isCorrect: true },
              { id: 'opt-3', order: 3, label: 'Bo pseudokod nie jest kompilowany.', isCorrect: false },
              { id: 'opt-4', order: 4, label: 'Bo typy danych zawsze powodują crash.', isCorrect: false },
            ],
          },
          {
            id: 'q5',
            order: 5,
            title: 'Cecha algorytmu',
            prompt: 'Która cecha jest wymagana, żeby coś nazwać algorytmem?',
            options: [
              { id: 'opt-1', order: 1, label: 'Musi być zapisane w Pythonie.', isCorrect: false },
              { id: 'opt-2', order: 2, label: 'Może mieć nieskończoną liczbę kroków.', isCorrect: false },
              { id: 'opt-3', order: 3, label: 'Musi być skończone (mieć koniec).', isCorrect: true },
              { id: 'opt-4', order: 4, label: 'Musi używać klas i obiektów.', isCorrect: false },
            ],
          },
        ] as Prisma.InputJsonArray,
      },
      // sprint 2
      {
        missionId: SEED_IDS.id_mission_quiz1_sprint2_moduleBase,
        questions: [
          {
            id: 'q1',
            order: 1,
            title: 'RAM vs dysk',
            prompt: 'Które stwierdzenie jest prawdziwe?',
            options: [
              {
                id: 'opt-1',
                order: 1,
                label: 'Dane w RAM znikają po zakończeniu programu, jeśli nie zostaną zapisane.',
                isCorrect: true,
              },
              {
                id: 'opt-2',
                order: 2,
                label: 'Dane w RAM są trwale zapisane nawet po wyłączeniu komputera.',
                isCorrect: false,
              },
              { id: 'opt-3', order: 3, label: 'Dysk jest szybszy od RAM przy pracy na zmiennych.', isCorrect: false },
              {
                id: 'opt-4',
                order: 4,
                label: 'RAM służy do długoterminowego przechowywania plików.',
                isCorrect: false,
              },
            ],
          },
          {
            id: 'q2',
            order: 2,
            title: 'Czym jest proces',
            prompt: 'Co najlepiej opisuje „proces”?',
            options: [
              { id: 'opt-1', order: 1, label: 'Plik programu zapisany na dysku.', isCorrect: false },
              {
                id: 'opt-2',
                order: 2,
                label: 'Uruchomiony program z przydzielonymi zasobami (pamięć, czas CPU).',
                isCorrect: true,
              },
              { id: 'opt-3', order: 3, label: 'Zawsze pojedyncza funkcja w programie.', isCorrect: false },
              { id: 'opt-4', order: 4, label: 'Synonim pamięci RAM.', isCorrect: false },
            ],
          },
          {
            id: 'q3',
            order: 3,
            title: 'I/O',
            prompt: 'Który przykład jest operacją I/O?',
            options: [
              { id: 'opt-1', order: 1, label: 'Dodanie dwóch liczb w zmiennej.', isCorrect: false },
              { id: 'opt-2', order: 2, label: 'Wykonanie pętli for liczącej sumę.', isCorrect: false },
              { id: 'opt-3', order: 3, label: 'Odczyt pliku z dysku.', isCorrect: true },
              { id: 'opt-4', order: 4, label: 'Porównanie dwóch wartości (==).', isCorrect: false },
            ],
          },
          {
            id: 'q4',
            order: 4,
            title: '„Program wisi”',
            prompt:
              'Program wygląda na „zawieszony”, ale CPU jest prawie bezczynne. Najbardziej prawdopodobne wyjaśnienie to:',
            options: [
              { id: 'opt-1', order: 1, label: 'Program czeka na I/O (np. dysk albo sieć).', isCorrect: true },
              { id: 'opt-2', order: 2, label: 'CPU liczy zbyt szybko i dlatego wygląda jakby stał.', isCorrect: false },
              { id: 'opt-3', order: 3, label: 'RAM jest zawsze szybszy od CPU i go blokuje.', isCorrect: false },
              {
                id: 'opt-4',
                order: 4,
                label: 'System operacyjny nie pozwala na wykonywanie instrukcji.',
                isCorrect: false,
              },
            ],
          },
          {
            id: 'q5',
            order: 5,
            title: 'Trwałość danych',
            prompt:
              'Masz dane w zmiennej, zamykasz aplikację i po ponownym uruchomieniu danych nie ma. Najlepsza diagnoza:',
            options: [
              {
                id: 'opt-1',
                order: 1,
                label: 'Dane były tylko w RAM i nie zostały zapisane na dysku.',
                isCorrect: true,
              },
              { id: 'opt-2', order: 2, label: 'CPU usunęło dane, bo były niepotrzebne.', isCorrect: false },
              {
                id: 'opt-3',
                order: 3,
                label: 'Proces zapisał dane automatycznie, ale system je ukrył.',
                isCorrect: false,
              },
              { id: 'opt-4', order: 4, label: 'I/O nie ma wpływu na trwałość danych.', isCorrect: false },
            ],
          },
        ] as Prisma.InputJsonArray,
      },
      // sprint 3
      {
        missionId: SEED_IDS.id_mission_quiz1_sprint3_moduleBase,
        questions: [
          {
            id: 'q1',
            order: 1,
            title: 'Składnia vs semantyka',
            prompt: 'Kod uruchamia się bez błędu, ale zwraca zły wynik. To najczęściej:',
            options: [
              { id: 'opt-1', order: 1, label: 'Błąd składni', isCorrect: false },
              { id: 'opt-2', order: 2, label: 'Błąd logiczny / semantyczny', isCorrect: true },
              { id: 'opt-3', order: 3, label: 'Błąd kompilatora', isCorrect: false },
              { id: 'opt-4', order: 4, label: 'Brak RAM', isCorrect: false },
            ],
          },
          {
            id: 'q2',
            order: 2,
            title: 'return vs print',
            prompt: 'W zadaniu, gdzie testy wywołują solve(a, b) i porównują wynik, poprawne jest:',
            options: [
              { id: 'opt-1', order: 1, label: 'Wypisać wynik printem i zwrócić 0', isCorrect: false },
              { id: 'opt-2', order: 2, label: 'Zwrócić wynik przez return', isCorrect: true },
              { id: 'opt-3', order: 3, label: 'Zwrócić zawsze string "ok"', isCorrect: false },
              { id: 'opt-4', order: 4, label: 'Nie zwracać nic (None)', isCorrect: false },
            ],
          },
          {
            id: 'q3',
            order: 3,
            title: 'Scope',
            prompt: 'Zmienna zdefiniowana wewnątrz funkcji jest zwykle:',
            options: [
              { id: 'opt-1', order: 1, label: 'Widoczna w całym programie', isCorrect: false },
              { id: 'opt-2', order: 2, label: 'Widoczna tylko w tej funkcji (lokalna)', isCorrect: true },
              { id: 'opt-3', order: 3, label: 'Automatycznie zapisywana na dysku', isCorrect: false },
              { id: 'opt-4', order: 4, label: 'Tym samym co argument funkcji', isCorrect: false },
            ],
          },
          {
            id: 'q4',
            order: 4,
            title: 'IndexError',
            prompt: 'IndexError najczęściej oznacza:',
            options: [
              { id: 'opt-1', order: 1, label: 'Dzielenie przez zero', isCorrect: false },
              { id: 'opt-2', order: 2, label: 'Odwołanie do indeksu poza zakresem listy', isCorrect: true },
              { id: 'opt-3', order: 3, label: 'Zły typ danych w dodawaniu', isCorrect: false },
              { id: 'opt-4', order: 4, label: 'Brak uprawnień do pliku', isCorrect: false },
            ],
          },
          {
            id: 'q5',
            order: 5,
            title: 'Przypadki brzegowe',
            prompt: 'Który test najlepiej sprawdza przypadek brzegowy dla funkcji pracującej na liście?',
            options: [
              { id: 'opt-1', order: 1, label: 'Lista z 100 elementami', isCorrect: false },
              { id: 'opt-2', order: 2, label: 'Pusta lista', isCorrect: true },
              { id: 'opt-3', order: 3, label: 'Lista z losowymi liczbami', isCorrect: false },
              { id: 'opt-4', order: 4, label: 'Lista posortowana rosnąco', isCorrect: false },
            ],
          },
        ] as Prisma.InputJsonArray,
      },
      // python-entry
      // sprint 1
      {
        missionId: SEED_IDS.id_mission_quiz1_sprint1_modulePythonEntry,
        questions: [
          {
            id: 'q1',
            order: 1,
            title: 'Typ zmiennej',
            prompt: 'Jaki typ ma wartość przypisana do x po wykonaniu: x = 10 ?',
            options: [
              { id: 'opt-1', order: 1, label: 'int', isCorrect: true },
              { id: 'opt-2', order: 2, label: 'str', isCorrect: false },
              { id: 'opt-3', order: 3, label: 'float', isCorrect: false },
              { id: 'opt-4', order: 4, label: 'bool', isCorrect: false },
            ],
          },
          {
            id: 'q2',
            order: 2,
            title: 'String vs liczba',
            prompt: 'Które stwierdzenie jest prawdziwe?',
            options: [
              { id: 'opt-1', order: 1, label: '"123" to str, a 123 to int', isCorrect: true },
              { id: 'opt-2', order: 2, label: '"123" i 123 to zawsze ten sam typ', isCorrect: false },
              { id: 'opt-3', order: 3, label: '123 to str, bo nie ma kropki', isCorrect: false },
              { id: 'opt-4', order: 4, label: '"123" to liczba, bo wygląda jak liczba', isCorrect: false },
            ],
          },
          {
            id: 'q3',
            order: 3,
            title: 'Porównania',
            prompt: 'Co zwraca wyrażenie (5 <= 5)?',
            options: [
              { id: 'opt-1', order: 1, label: 'True', isCorrect: true },
              { id: 'opt-2', order: 2, label: 'False', isCorrect: false },
              { id: 'opt-3', order: 3, label: '5', isCorrect: false },
              { id: 'opt-4', order: 4, label: '"True"', isCorrect: false },
            ],
          },
          {
            id: 'q4',
            order: 4,
            title: 'Konwersja typu',
            prompt: 'Jak poprawnie zamienić tekst "7" na liczbę całkowitą?',
            options: [
              { id: 'opt-1', order: 1, label: 'int("7")', isCorrect: true },
              { id: 'opt-2', order: 2, label: 'str(7)', isCorrect: false },
              { id: 'opt-3', order: 3, label: 'bool("7")', isCorrect: false },
              { id: 'opt-4', order: 4, label: '"7".to_int()', isCorrect: false },
            ],
          },
          {
            id: 'q5',
            order: 5,
            title: 'return vs print',
            prompt: 'W zadaniu, gdzie testy wywołują solve(a, b) i porównują wynik, co jest poprawne?',
            options: [
              { id: 'opt-1', order: 1, label: 'Zwrócić wynik przez return', isCorrect: true },
              { id: 'opt-2', order: 2, label: 'Wypisać wynik print i nic nie zwracać', isCorrect: false },
              { id: 'opt-3', order: 3, label: 'Zwrócić zawsze 0, a wynik wypisać', isCorrect: false },
              { id: 'opt-4', order: 4, label: 'Zwrócić string "ok"', isCorrect: false },
            ],
          },
        ] as Prisma.InputJsonArray,
      },
      // sprint 2
      {
        missionId: SEED_IDS.id_mission_quiz1_sprint2_modulePythonEntry,
        questions: [
          {
            id: 'q1',
            order: 1,
            title: 'Porównanie',
            prompt: 'Co zwraca wyrażenie: (3 <= 3)?',
            options: [
              { id: 'opt-1', order: 1, label: 'True', isCorrect: true },
              { id: 'opt-2', order: 2, label: 'False', isCorrect: false },
              { id: 'opt-3', order: 3, label: '3', isCorrect: false },
              { id: 'opt-4', order: 4, label: '"True"', isCorrect: false },
            ],
          },
          {
            id: 'q2',
            order: 2,
            title: '= vs ==',
            prompt: 'Który operator służy do porównania równości?',
            options: [
              { id: 'opt-1', order: 1, label: '==', isCorrect: true },
              { id: 'opt-2', order: 2, label: '=', isCorrect: false },
              { id: 'opt-3', order: 3, label: '=>', isCorrect: false },
              { id: 'opt-4', order: 4, label: '!=', isCorrect: false },
            ],
          },
          {
            id: 'q3',
            order: 3,
            title: 'and',
            prompt: 'Kiedy wyrażenie (A and B) jest True?',
            options: [
              { id: 'opt-1', order: 1, label: 'Tylko gdy A i B są True', isCorrect: true },
              { id: 'opt-2', order: 2, label: 'Gdy A jest True, niezależnie od B', isCorrect: false },
              { id: 'opt-3', order: 3, label: 'Gdy B jest True, niezależnie od A', isCorrect: false },
              { id: 'opt-4', order: 4, label: 'Gdy A lub B jest True', isCorrect: false },
            ],
          },
          {
            id: 'q4',
            order: 4,
            title: 'Kolejność elif',
            prompt: 'Dlaczego kolejność warunków w if/elif ma znaczenie?',
            options: [
              {
                id: 'opt-1',
                order: 1,
                label: 'Bo sprawdzane są po kolei i pierwszy pasujący kończy wybór gałęzi',
                isCorrect: true,
              },
              { id: 'opt-2', order: 2, label: 'Bo Python losowo wybiera, który warunek wykona', isCorrect: false },
              { id: 'opt-3', order: 3, label: 'Bo elif działa tylko w pętli', isCorrect: false },
              { id: 'opt-4', order: 4, label: 'Bo else zawsze nadpisuje wynik', isCorrect: false },
            ],
          },
          {
            id: 'q5',
            order: 5,
            title: 'Typ wyniku',
            prompt: 'Funkcja ma zwracać boolean. Która wartość ma poprawny typ?',
            options: [
              { id: 'opt-1', order: 1, label: 'True', isCorrect: true },
              { id: 'opt-2', order: 2, label: '"True"', isCorrect: false },
              { id: 'opt-3', order: 3, label: '"false"', isCorrect: false },
              { id: 'opt-4', order: 4, label: '1', isCorrect: false },
            ],
          },
        ] as Prisma.InputJsonArray,
      },
      // sprint 3
      {
        missionId: SEED_IDS.id_mission_quiz1_sprint3_modulePythonEntry,
        questions: [
          {
            id: 'q1',
            order: 1,
            title: 'range',
            prompt: 'Jakie liczby wygeneruje range(3)?',
            options: [
              { id: 'opt-1', order: 1, label: '0, 1, 2', isCorrect: true },
              { id: 'opt-2', order: 2, label: '1, 2, 3', isCorrect: false },
              { id: 'opt-3', order: 3, label: '0, 1, 2, 3', isCorrect: false },
              { id: 'opt-4', order: 4, label: '3, 2, 1', isCorrect: false },
            ],
          },
          {
            id: 'q2',
            order: 2,
            title: 'for',
            prompt: 'Do czego najczęściej używa się pętli for?',
            options: [
              { id: 'opt-1', order: 1, label: 'Do iteracji po elementach lub zakresie', isCorrect: true },
              { id: 'opt-2', order: 2, label: 'Do deklarowania zmiennych', isCorrect: false },
              { id: 'opt-3', order: 3, label: 'Do definiowania funkcji', isCorrect: false },
              { id: 'opt-4', order: 4, label: 'Do obsługi błędów', isCorrect: false },
            ],
          },
          {
            id: 'q3',
            order: 3,
            title: 'while',
            prompt: 'Kiedy pętla while się kończy?',
            options: [
              { id: 'opt-1', order: 1, label: 'Gdy warunek stanie się False', isCorrect: true },
              { id: 'opt-2', order: 2, label: 'Po jednej iteracji', isCorrect: false },
              { id: 'opt-3', order: 3, label: 'Gdy użyjesz continue', isCorrect: false },
              { id: 'opt-4', order: 4, label: 'Automatycznie po 10 iteracjach', isCorrect: false },
            ],
          },
          {
            id: 'q4',
            order: 4,
            title: 'break',
            prompt: 'Co robi instrukcja break?',
            options: [
              { id: 'opt-1', order: 1, label: 'Natychmiast przerywa pętlę', isCorrect: true },
              { id: 'opt-2', order: 2, label: 'Pomija jedną iterację', isCorrect: false },
              { id: 'opt-3', order: 3, label: 'Kończy program', isCorrect: false },
              { id: 'opt-4', order: 4, label: 'Resetuje licznik pętli', isCorrect: false },
            ],
          },
          {
            id: 'q5',
            order: 5,
            title: 'continue',
            prompt: 'Co robi instrukcja continue?',
            options: [
              { id: 'opt-1', order: 1, label: 'Pomija aktualną iterację i przechodzi dalej', isCorrect: true },
              { id: 'opt-2', order: 2, label: 'Kończy pętlę', isCorrect: false },
              { id: 'opt-3', order: 3, label: 'Kończy funkcję', isCorrect: false },
              { id: 'opt-4', order: 4, label: 'Zatrzymuje program', isCorrect: false },
            ],
          },
        ] as Prisma.InputJsonArray,
      },
      // sprint 4
      {
        missionId: SEED_IDS.id_mission_quiz1_sprint4_modulePythonEntry,
        questions: [
          {
            id: 'q1',
            order: 1,
            title: 'Po co są funkcje',
            prompt: 'Jaki jest główny sens używania funkcji?',
            options: [
              { id: 'opt-1', order: 1, label: 'Porządkowanie kodu i możliwość wielokrotnego użycia', isCorrect: true },
              { id: 'opt-2', order: 2, label: 'Przyspieszenie programu w każdym przypadku', isCorrect: false },
              { id: 'opt-3', order: 3, label: 'Zastąpienie pętli', isCorrect: false },
              { id: 'opt-4', order: 4, label: 'Automatyczne zapisywanie danych na dysku', isCorrect: false },
            ],
          },
          {
            id: 'q2',
            order: 2,
            title: 'return',
            prompt: 'Co zwróci funkcja, jeśli nie ma w niej instrukcji return?',
            options: [
              { id: 'opt-1', order: 1, label: 'None', isCorrect: true },
              { id: 'opt-2', order: 2, label: '0', isCorrect: false },
              { id: 'opt-3', order: 3, label: 'True', isCorrect: false },
              { id: 'opt-4', order: 4, label: 'Pusty string', isCorrect: false },
            ],
          },
          {
            id: 'q3',
            order: 3,
            title: 'Wartość domyślna',
            prompt: 'Po co ustawia się wartości domyślne argumentów?',
            options: [
              { id: 'opt-1', order: 1, label: 'Aby argument mógł być pominięty przy wywołaniu', isCorrect: true },
              { id: 'opt-2', order: 2, label: 'Aby Python szybciej działał', isCorrect: false },
              { id: 'opt-3', order: 3, label: 'Aby zmienna była globalna', isCorrect: false },
              { id: 'opt-4', order: 4, label: 'Aby nie trzeba było używać return', isCorrect: false },
            ],
          },
          {
            id: 'q4',
            order: 4,
            title: 'Scope',
            prompt: 'Zmienna zdefiniowana wewnątrz funkcji jest zwykle:',
            options: [
              { id: 'opt-1', order: 1, label: 'Lokalna (widoczna tylko w funkcji)', isCorrect: true },
              { id: 'opt-2', order: 2, label: 'Globalna (widoczna wszędzie)', isCorrect: false },
              { id: 'opt-3', order: 3, label: 'Zapisana automatycznie na dysku', isCorrect: false },
              { id: 'opt-4', order: 4, label: 'Dostępna tylko w pętlach', isCorrect: false },
            ],
          },
          {
            id: 'q5',
            order: 5,
            title: 'print vs return',
            prompt: 'W zadaniu testującym wynik funkcji, co jest poprawne?',
            options: [
              { id: 'opt-1', order: 1, label: 'Zwrócić wynik przez return', isCorrect: true },
              { id: 'opt-2', order: 2, label: 'Wypisać wynik print i zwrócić 0', isCorrect: false },
              { id: 'opt-3', order: 3, label: 'Nie zwracać nic i liczyć, że test to przeczyta', isCorrect: false },
              { id: 'opt-4', order: 4, label: 'Zwrócić zawsze True', isCorrect: false },
            ],
          },
        ] as Prisma.InputJsonArray,
      },
      // sprint 5
      {
        missionId: SEED_IDS.id_mission_quiz1_sprint5_modulePythonEntry,
        questions: [
          {
            id: 'q1',
            order: 1,
            title: 'Lista',
            prompt: 'Które stwierdzenie najlepiej opisuje listę (list)?',
            options: [
              { id: 'opt-1', order: 1, label: 'Ma kolejność i można ją modyfikować', isCorrect: true },
              { id: 'opt-2', order: 2, label: 'Nie ma duplikatów', isCorrect: false },
              { id: 'opt-3', order: 3, label: 'Jest niemodyfikowalna', isCorrect: false },
              { id: 'opt-4', order: 4, label: 'Zawsze używa kluczy', isCorrect: false },
            ],
          },
          {
            id: 'q2',
            order: 2,
            title: 'Tuple',
            prompt: 'Po co używa się tuple?',
            options: [
              { id: 'opt-1', order: 1, label: 'Gdy chcesz sekwencję, której nie modyfikujesz', isCorrect: true },
              { id: 'opt-2', order: 2, label: 'Gdy potrzebujesz duplikatów i modyfikacji', isCorrect: false },
              { id: 'opt-3', order: 3, label: 'Gdy potrzebujesz mapowania klucz → wartość', isCorrect: false },
              { id: 'opt-4', order: 4, label: 'Gdy chcesz automatycznie sortować dane', isCorrect: false },
            ],
          },
          {
            id: 'q3',
            order: 3,
            title: 'Dict',
            prompt: 'Która struktura najlepiej pasuje do mapowania klucz → wartość?',
            options: [
              { id: 'opt-1', order: 1, label: 'dict', isCorrect: true },
              { id: 'opt-2', order: 2, label: 'list', isCorrect: false },
              { id: 'opt-3', order: 3, label: 'tuple', isCorrect: false },
              { id: 'opt-4', order: 4, label: 'set', isCorrect: false },
            ],
          },
          {
            id: 'q4',
            order: 4,
            title: 'Set',
            prompt: 'Jaki jest główny sens używania set?',
            options: [
              { id: 'opt-1', order: 1, label: 'Przechowywanie unikalnych elementów', isCorrect: true },
              { id: 'opt-2', order: 2, label: 'Przechowywanie elementów w kolejności', isCorrect: false },
              { id: 'opt-3', order: 3, label: 'Mapowanie klucz → wartość', isCorrect: false },
              { id: 'opt-4', order: 4, label: 'Możliwość indeksowania jak w liście', isCorrect: false },
            ],
          },
          {
            id: 'q5',
            order: 5,
            title: 'Bezpieczne pobieranie z dict',
            prompt: 'Jak bezpiecznie pobrać wartość z dict, jeśli klucz może nie istnieć?',
            options: [
              { id: 'opt-1', order: 1, label: 'Użyć .get(key)', isCorrect: true },
              { id: 'opt-2', order: 2, label: 'Zawsze użyć nawiasów dict[key]', isCorrect: false },
              { id: 'opt-3', order: 3, label: 'Użyć append()', isCorrect: false },
              { id: 'opt-4', order: 4, label: 'Użyć range()', isCorrect: false },
            ],
          },
        ] as Prisma.InputJsonArray,
      },
    ],
    skipDuplicates: true,
  })
}

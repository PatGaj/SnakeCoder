import type { PrismaClient } from '../../src/generated/prisma/client'

import { SEED_IDS } from './ids'

export const seedSprints = async (prisma: PrismaClient) => {
  await prisma.sprint.createMany({
    data: [
      // module: Basics
      {
        id: SEED_IDS.id_sprint1_moduleBase,
        moduleId: SEED_IDS.id_moduleBase,
        name: 'sprint-1',
        order: 1,
        title: 'Jak myśli komputer',
        description:
          'Sprint wprowadzający w sposób działania komputera i myślenie algorytmiczne. Skupia się na danych, instrukcjach oraz rozpisywaniu problemów krok po kroku, bez użycia konkretnego języka programowania.',
      },
      {
        id: SEED_IDS.id_sprint2_moduleBase,
        moduleId: SEED_IDS.id_moduleBase,
        name: 'sprint-2',
        order: 2,
        title: 'Co dzieje się pod spodem',
        description:
          'Sprint wyjaśnia, jak działa komputer „od kuchni”: CPU, RAM i dysk, podstawy pamięci (zmienne jako miejsca w pamięci), pliki i ścieżki oraz rola systemu operacyjnego (procesy, uruchamianie programów, I/O). Celem jest zrozumienie, skąd biorą się typowe problemy jak brak pamięci, zawieszki czy błędne odczyty/zapisy.',
      },
      {
        id: SEED_IDS.id_sprint3_moduleBase,
        moduleId: SEED_IDS.id_moduleBase,
        name: 'sprint-3',
        order: 3,
        title: 'Od algorytmu do kodu',
        description:
          'Sprint buduje most między logiką a pisaniem programów: składnia vs znaczenie, zmienne, funkcje i zakres (scope), czytanie komunikatów błędów, podstawy debugowania oraz myślenie testami i przypadkami brzegowymi. Po tym sprincie użytkownik jest gotowy wejść w konkretny język (np. Python) bez uczenia się na ślepo.',
      },
      // module: Python Entry
      {
        id: SEED_IDS.id_sprint1_modulePythonEntry,
        moduleId: SEED_IDS.id_modulePythonEntry,
        name: 'sprint-1',
        order: 1,
        title: 'Składnia, zmienne i typy',
        description:
          'Pierwsze kroki w Pythonie: składnia, zmienne, typy danych (int, float, str, bool), operatory oraz proste wyrażenia. Celem jest pisanie krótkich funkcji bez błędów składniowych.',
      },
      {
        id: SEED_IDS.id_sprint2_modulePythonEntry,
        moduleId: SEED_IDS.id_modulePythonEntry,
        name: 'sprint-2',
        order: 2,
        title: 'Warunki i logika',
        description:
          'Instrukcje if/elif/else, porównania, logika boolean (and, or, not) oraz proste walidacje danych. Celem jest podejmowanie decyzji w kodzie i poprawne zwracanie wartości logicznych.',
      },
      {
        id: SEED_IDS.id_sprint3_modulePythonEntry,
        moduleId: SEED_IDS.id_modulePythonEntry,
        name: 'sprint-3',
        order: 3,
        title: 'Pętle i iteracja',
        description:
          'Pętle for i while, range, iterowanie po napisach i listach, zliczanie i sumowanie. Celem jest przetwarzanie wielu elementów oraz unikanie typowych błędów w pętlach.',
      },
      {
        id: SEED_IDS.id_sprint4_modulePythonEntry,
        moduleId: SEED_IDS.id_modulePythonEntry,
        name: 'sprint-4',
        order: 4,
        title: 'Funkcje i scope',
        description:
          'Definiowanie funkcji, argumenty, return, wartości domyślne oraz zakres widoczności zmiennych (scope). Celem jest porządkowanie kodu i dzielenie problemów na mniejsze funkcje.',
      },
      {
        id: SEED_IDS.id_sprint5_modulePythonEntry,
        moduleId: SEED_IDS.id_modulePythonEntry,
        name: 'sprint-5',
        order: 5,
        title: 'Kolekcje w praktyce',
        description:
          'Podstawowe kolekcje Pythona: listy, krotki, słowniki i zbiory. Operacje na kolekcjach, iteracja i proste transformacje danych bez budowania pełnego projektu.',
      },
    ],
    skipDuplicates: true,
  })
}

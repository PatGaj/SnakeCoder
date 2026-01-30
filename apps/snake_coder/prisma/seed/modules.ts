import type { PrismaClient } from '../../src/generated/prisma/client'

import { SEED_IDS } from './ids'

export const seedModules = async (prisma: PrismaClient) => {
  await prisma.module.createMany({
    data: [
      {
        id: SEED_IDS.id_moduleBase,
        name: 'basics',
        code: 'BASICS',
        title: 'Podstawy informatyki',
        description:
          'Moduł wprowadzający w fundamenty programowania: sposób myślenia komputera, dane, algorytmy i logiczne rozwiązywanie problemów. Przygotowuje do nauki dowolnego języka programowania, w tym Pythona.',
        requirements: ['Chęć do nauki'],
        category: 'CERTIFICATIONS',
        difficulty: 'BEGINNER',
        imagePath: '/images/module-basics.png',
        isBuilding: false,
      },
      {
        id: SEED_IDS.id_modulePythonEntry,
        name: 'python-entry',
        code: 'PY_ENTRY',
        title: 'Python dla początkujących',
        description:
          'Moduł wprowadzający do Pythona od zera: składnia, typy danych, warunki, pętle, funkcje oraz podstawowe kolekcje. Skupia się na krótkich zadaniach i stopniowym budowaniu poprawnych nawyków programistycznych.',
        requirements: ['Chęć do nauki programowania'],
        category: 'CERTIFICATIONS',
        difficulty: 'BEGINNER',
        imagePath: '/images/module-python-entry.png',
        isBuilding: false,
      },
      {
        id: SEED_IDS.id_modulePythonAdvanced,
        name: 'python-advanced',
        code: 'PY_ADV',
        title: 'Python średnio-zaawansowany',
        description:
          'Moduł rozwija praktyczne umiejętności Pythona: pracę z bardziej złożonymi strukturami danych, funkcjami wyższego rzędu, wyjątkami, modułami oraz czytaniem i analizą cudzego kodu. Skupia się na pisaniu czytelnego, poprawnego i skalowalnego kodu.',
        requirements: ['Python podstawy', 'Funkcje', 'Pętle', 'Kolekcje', 'Warunki'],
        category: 'CERTIFICATIONS',
        difficulty: 'INTERMEDIATE',
        imagePath: '/images/module-python-advanced.png',
        isBuilding: true,
      },
      {
        id: SEED_IDS.id_moduleNumPy,
        name: 'numpy',
        code: 'NUMPY',
        title: 'NumPy',
        description:
          'Wprowadzenie do biblioteki NumPy: tablice wielowymiarowe, operacje wektorowe, broadcasting oraz podstawowe obliczenia numeryczne. Moduł pokazuje, jak efektywnie pracować na danych liczbowych w Pythonie.',
        requirements: ['Python podstawy', 'Listy', 'Pętle', 'Podstawy matematyki'],
        category: 'LIBRARIES',
        difficulty: 'BEGINNER',
        imagePath: '/images/module-numpy.png',
        isBuilding: true,
      },
    ],
    skipDuplicates: true,
  })
}

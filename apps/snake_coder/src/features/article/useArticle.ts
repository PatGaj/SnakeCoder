import type { ArticleContentData, ArticleHeaderData, ArticleTocItem } from './components'

export type UseArticleData = {
  header: ArticleHeaderData
  toc: ArticleTocItem[]
  content: ArticleContentData
}

const buildToc = (content: ArticleContentData): ArticleTocItem[] => {
  return content.blocks
    .filter((block) => block.type === 'heading')
    .map((block) => ({ id: block.id, label: block.text, level: block.level }))
}

const useArticle = (id: string): UseArticleData => {
  const hardData: Record<string, { header: ArticleHeaderData; content: ArticleContentData }> = {
    'pcep-3-article-1': {
      header: {
        title: 'Funkcje w Pythonie: argumenty, return i walidacja',
        desc: 'W tym artykule uporządkujesz podstawy funkcji: jak przekazywać argumenty, co zwracać i jak walidować dane wejściowe.',
        readTimeMinutes: 7,
        tags: ['PCEP', 'funkcje', 'walidacja', 'return'],
      },
      content: {
        blocks: [
          { type: 'heading', id: 'wprowadzenie', level: 2, text: 'Wprowadzenie' },
          {
            type: 'paragraph',
            text: 'Funkcje pozwalają opakować logikę w czytelne, powtarzalne bloki. W praktyce najważniejsze są: podpis funkcji (argumenty), zwracanie wartości oraz walidacja danych wejściowych.',
          },
          {
            type: 'callout',
            tone: 'highlight',
            title: 'Zasada',
            text: 'Funkcja powinna robić jedną rzecz, zwracać przewidywalny wynik i jasno komunikować błędy (np. przez wyjątki).',
          },

          { type: 'heading', id: 'argumenty', level: 2, text: 'Argumenty funkcji' },
          {
            type: 'paragraph',
            text: 'Najczęściej spotkasz argumenty pozycyjne i nazwane. Możesz też ustawić wartości domyślne (default), ale pamiętaj: wartości domyślne powinny być „bezpieczne”.',
          },
          {
            type: 'code',
            language: 'python',
            title: 'Przykład argumentów',
            code: `def greet(name: str, punctuation: str = "!") -> str:\n    return f"Hello, {name}{punctuation}"\n\nprint(greet("Julia"))\nprint(greet("Julia", punctuation="!!!"))`,
          },
          {
            type: 'callout',
            tone: 'tip',
            title: 'Uwaga na mutable defaults',
            text: 'Nie ustawiaj listy/słownika jako wartości domyślnej. Użyj None i utwórz obiekt w środku funkcji.',
          },
          {
            type: 'code',
            language: 'python',
            title: 'Bezpieczny default',
            code: `def add_item(item: str, items: list[str] | None = None) -> list[str]:\n    if items is None:\n        items = []\n    items.append(item)\n    return items`,
          },

          { type: 'heading', id: 'return', level: 2, text: 'Return i wartości zwracane' },
          {
            type: 'paragraph',
            text: 'Zwracaj wynik zamiast printować. To ułatwia testowanie, ponowne użycie i ocenę kodu. Jeśli funkcja nic nie zwraca, w Pythonie zwraca None.',
          },
          { type: 'list', items: ['Zwracaj dane, nie side-effecty', 'Unikaj print w logice zadania', 'Testy sprawdzają return'] },
          {
            type: 'code',
            language: 'python',
            title: 'Return zamiast print',
            code: `def double(x: int) -> int:\n    return x * 2\n\nresult = double(21)\nprint(result)`,
          },

          { type: 'heading', id: 'walidacja', level: 2, text: 'Walidacja danych wejściowych' },
          {
            type: 'paragraph',
            text: 'Walidacja to sprawdzanie typu, zakresu i warunków brzegowych. Dzięki temu funkcja jest stabilna i przewidywalna.',
          },
          {
            type: 'code',
            language: 'python',
            title: 'Przykład walidacji',
            code: `def safe_divide(a: float, b: float) -> float:\n    if not isinstance(a, (int, float)) or not isinstance(b, (int, float)):\n        raise TypeError("a i b muszą być liczbami")\n    if b == 0:\n        raise ValueError("dzielenie przez zero")\n    return a / b`,
          },
          {
            type: 'callout',
            tone: 'info',
            title: 'Co sprawdzać w zadaniach?',
            text: 'Najczęściej: None, pusty string, złe typy, wartości ujemne, granice zakresu i format danych.',
          },

          { type: 'heading', id: 'podsumowanie', level: 2, text: 'Podsumowanie' },
          {
            type: 'paragraph',
            text: 'Dobra funkcja ma czytelny podpis, zwraca wartość (a nie drukuje) i waliduje wejście. To fundament pod testy oraz ocenę jakości kodu.',
          },
        ],
        summary: [
          'Argumenty: pozycyjne, nazwane, wartości domyślne (uważaj na mutable).',
          'Return: zwracaj wynik, unikaj print w logice zadania.',
          'Walidacja: typy, zakresy i edge-case’y → stabilny kod.',
        ],
      },
    },
  }

  const fallback = {
    header: {
      title: `Artykuł: ${id}`,
      desc: 'Ten artykuł jest w przygotowaniu. Wkrótce dodamy pełną treść z bazy.',
      readTimeMinutes: 5,
      tags: ['Python'],
    },
    content: {
      blocks: [
        { type: 'heading', id: 'wstep', level: 2, text: 'Wstęp' },
        {
          type: 'paragraph',
          text: 'Treść artykułu będzie zwracana z bazy danych. Na razie jest to widok przykładowy (mock).',
        },
      ],
      summary: [],
    },
  } satisfies { header: ArticleHeaderData; content: ArticleContentData }

  const data = hardData[id] ?? fallback
  const toc = buildToc(data.content)

  return { header: data.header, content: data.content, toc }
}

export default useArticle


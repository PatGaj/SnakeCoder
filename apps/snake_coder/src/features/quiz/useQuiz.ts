import type { QuizHeaderData, QuizQuestionData } from './components'

export type UseQuizData = {
  header: QuizHeaderData
  questions: QuizQuestionData[]
  timeLimitSeconds: number
}

const useQuiz = (id: string): UseQuizData => {
  const header: QuizHeaderData = {
    title: 'Podstawy składni',
    desc: 'Krótki quiz z podstaw Pythona: zmienne, typy i proste operatory.',
    xp: 30,
    passPercent: 80,
  }

  const questions: QuizQuestionData[] = [
    {
      id: `${id}-q1`,
      title: 'Pytanie 1',
      prompt: 'Który zapis jest poprawnym komentarzem w Pythonie?',
      options: [
        { id: 'a', label: '// komentarz' },
        { id: 'b', label: '# komentarz' },
        { id: 'c', label: '/* komentarz */' },
        { id: 'd', label: '<!-- komentarz -->' },
      ],
      correctOptionId: 'b',
    },
    {
      id: `${id}-q2`,
      title: 'Pytanie 2',
      prompt: 'Jaki będzie wynik wyrażenia: 3 * "ab" ?',
      options: [
        { id: 'a', label: '"ababab"' },
        { id: 'b', label: '"ab3"' },
        { id: 'c', label: 'błąd typu' },
        { id: 'd', label: '"ab ab ab"' },
      ],
      correctOptionId: 'a',
    },
    {
      id: `${id}-q3`,
      title: 'Pytanie 3',
      prompt: 'Która wartość jest typu bool w Pythonie?',
      options: [
        { id: 'a', label: '"True"' },
        { id: 'b', label: '1' },
        { id: 'c', label: 'True' },
        { id: 'd', label: 'None' },
      ],
      correctOptionId: 'c',
    },
    {
      id: `${id}-q4`,
      title: 'Pytanie 4',
      prompt: 'Który operator oznacza dzielenie całkowite (floor division)?',
      options: [
        { id: 'a', label: '/' },
        { id: 'b', label: '//' },
        { id: 'c', label: '%' },
        { id: 'd', label: '**' },
      ],
      correctOptionId: 'b',
    },
    {
      id: `${id}-q5`,
      title: 'Pytanie 5',
      prompt: 'Jaki będzie wynik: bool("") ?',
      options: [
        { id: 'a', label: 'True' },
        { id: 'b', label: 'False' },
        { id: 'c', label: '""' },
        { id: 'd', label: 'None' },
      ],
      correctOptionId: 'b',
    },
  ]

  return { header, questions, timeLimitSeconds: 6 * 60 }
}

export default useQuiz

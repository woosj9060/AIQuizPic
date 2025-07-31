export interface QuizDetail {
  id: number;
  img: string;
  word1: string;
  word2: string;
  word3: string;
  validate: boolean;
  description?: string;
  createdAt?: string;
  difficulty?: string;
}

// export interface QuizValidationWrapper {
//   result: number;
//   message: string;
//   quiz: QuizDetail;
//   failedWords: string[];
// }

export interface SolvedQuiz {
  id: number;
  img: string;
}

export interface SubmitQuizProps {
  quizId: number;
  onSubmit: (matchCount: any) => void;
  onCelebrate: (value: boolean) => void;
}

export interface QuizCreationPopupProps {
  open: boolean;
  onClose: () => void;
  quiz: QuizDetail;
  result: number; // result 상태 추가
  failedWords: string[]; // 실패한 단어 리스트
}

export interface ValidationPopupProps {
  quiz: QuizDetail,
  open: boolean;
  onClose: () => void;
}
// src/api/quiz.ts
import { getToken } from '../tokenUtils/tokenUtils';
import type { QuizDetail, SolvedQuiz } from '../types/Quiz';

export const fetchQuizList = async (): Promise<QuizDetail[]> => {
  const token = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/quiz`, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    throw new Error('퀴즈를 찾을 수 없습니다.');
  }

  return response.json();
};


export const fetchDeleteQuiz = async (id: number): Promise<{ success: boolean; message: string }> => {
  const token = getToken();
  if (!token) {
    return Promise.reject(new Error("로그인이 필요한 기능입니다."));
  }

  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/quiz/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const message = await response.text();

    if (response.ok) { // HTTP 상태 코드가 200-299 범위인 경우
      return { success: true, message: message };
    } else {
      // 2xx 범위가 아닌 경우 (4xx, 5xx), 실패로 처리하고 받은 메시지를 반환
      return { success: false, message: message || `오류 코드: ${response.status}` };
    }
  } catch (err: any) {
    console.error('퀴즈 삭제 중 네트워크 오류:', err);
    // 네트워크 오류는 response 객체 자체를 받지 못하는 경우이므로, 별도 처리
    return { success: false, message: err.message || "네트워크 오류가 발생했습니다." };
  }
};

export const fetchSolvedQuizzes = async (): Promise<SolvedQuiz[]> => {
    const token = getToken();
    if (!token) {
    throw new Error("로그인이 필요한 기능입니다.");
  }
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/stats/solved`, {
        method: 'GET',
        headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        }
    });

    if (!response.ok) {
        throw new Error('퀴즈 목록 불러오기 실패');
    }

    return response.json();

}

export const fetchQuizById = async (id: number): Promise<QuizDetail> => {
  const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/quiz/${id}`);

  if (!response.ok) {
    throw new Error('퀴즈를 찾을 수 없습니다.');
  }

  return response.json();
};


export const fetchSubmitQuiz = async (quizId: number, word1: string, word2: string, word3: string): Promise<number> => {
  const token = getToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/quiz/${quizId}/submit`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ word1, word2, word3 }),
  });

  if (!response.ok) {
    throw new Error('서버 오류');
  }

  const result = await response.text();
  return parseInt(result);
};

export const fetchCreateQuiz = async (
  word1: string,
  word2: string,
  word3: string
): Promise<QuizDetail> => { // ✅ 퀴즈를 반환하는 Promise로 변경
  const token = getToken();
  if (!token) {
    throw new Error("로그인이 필요한 기능입니다."); 
  }
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/quiz/generate`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ word1, word2, word3 }),
  });

  if (!response.ok) {
    throw new Error('서버 오류');
  }

  const quiz: QuizDetail = await response.json();
  return quiz;
};

export const fetchLogin = async (username: string, password: string): Promise<string> => {
  const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error('로그인 실패');
  }

  const data = await response.json();
  return data.token;
};

export const fetchSignup = async (username: string, password: string): Promise<void> => {
  const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `HTTP error! status: ${response.status}`);
  }
};

export const fetchValidateQuiz = async (
  quizId: number | string, // ID 타입에 맞게 수정
  validateValue: number
): Promise<{ success: boolean; message: string }> => {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else {
    throw new Error("로그인이 필요합니다.");
  }

  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/quiz/validate/${quizId}/${validateValue}`, {
      method: 'POST',
      headers,
    });

    if (!response.ok) {
      // ❗ 서버 응답이 성공(2xx)이 아닐 경우
      // JSON 파싱을 시도하되, 실패하면 일반 텍스트로 읽습니다.
      let errorMessage = `퀴즈 검증 실패: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        // 백엔드에서 에러 메시지를 JSON 형태로 보낼 경우
        errorMessage = errorData.message || errorMessage;
      } catch (jsonError) {
        // 서버가 JSON이 아닌 일반 텍스트 에러 메시지를 보낼 경우
        const textError = await response.text();
        // 'Gemini 응답 파싱 실패1'과 같은 메시지는 여기서 잡힐 가능성이 높습니다.
        errorMessage = textError || errorMessage;
      }
      throw new Error(errorMessage);
    }

    // 성공적인 응답의 경우 JSON으로 파싱합니다.
    const data = await response.json();
    // 백엔드가 항상 { message: "..." } 형태를 준다고 가정
    return { success: true, message: data.message || "퀴즈 검증이 성공적으로 처리되었습니다." };

  } catch (error: any) {
    console.error('fetchValidateQuiz API 호출 중 오류 발생:', error);
    // 원래 에러 메시지가 없다면 일반적인 메시지 반환
    throw new Error(error.message || '퀴즈 검증 중 알 수 없는 오류가 발생했습니다.');
  }
};

export const checkUnvalidatedQuizzesExist = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/quiz/unvalidated/exists`);
    if (!response.ok) {
      // 에러 발생 시 처리
      console.error('Validate 여부 확인 실패:', response.statusText);
      return false; // 오류 발생 시 false 반환
    }
    const exists = await response.json(); // 백엔드가 Boolean 값을 JSON으로 보냄
    return exists;
  } catch (error) {
    console.error('Validate 여부 확인 중 네트워크 오류:', error);
    return false; // 네트워크 오류 시 false 반환
  }
};

export const fetchUnvalidatedQuizzesList = async (): Promise<QuizDetail[]> => {
  const token = getToken();
  if (!token) {
    throw new Error("로그인이 필요한 기능입니다."); 
  }
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/quiz/unvalidated`, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    throw new Error('퀴즈를 찾을 수 없습니다.');
  }

  return response.json();
};
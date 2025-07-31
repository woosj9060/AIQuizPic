// src/context/QuizNotificationContext.tsx (이전 응답과 동일)

import React, { createContext, useContext, type ReactNode, useRef } from 'react'; // useRef 추가

// Context의 타입 정의
interface QuizNotificationContextType {
  refreshNotifications: React.MutableRefObject<() => void>; // useRef로 감싸서 전달
}

// Context 생성
const QuizNotificationContext = createContext<QuizNotificationContextType | undefined>(undefined);

// Context Provider 컴포넌트
interface QuizNotificationProviderProps {
  children: ReactNode;
}

export const QuizNotificationProvider: React.FC<QuizNotificationProviderProps> = ({ children }) => {
  // useRef를 사용하여 변경 가능한 참조를 만듭니다.
  // 이 참조는 TopToolbar에서 실제 함수로 업데이트됩니다.
  const refreshNotificationsRef = useRef(() => {
    console.warn("refreshNotifications 펑션이 아직 TopToolbar에 의해 오버라이드되지 않았습니다.");
  });

  const value = { refreshNotifications: refreshNotificationsRef };

  return (
    <QuizNotificationContext.Provider value={value}>
      {children}
    </QuizNotificationContext.Provider>
  );
};

// Context를 사용하기 위한 커스텀 훅
export const useQuizNotifications = () => {
  const context = useContext(QuizNotificationContext);
  if (context === undefined) {
    throw new Error('useQuizNotifications must be used within a QuizNotificationProvider');
  }
  return context;
};
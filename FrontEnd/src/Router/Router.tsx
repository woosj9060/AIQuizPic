import { Routes, Route } from 'react-router-dom';
import QuizList from '../features/quiz/QuizList.tsx';
import Quiz from '../features/quiz/Quiz.tsx';
import CreateQuiz from '../features/quiz/CreateQuiz.tsx';
import Signup from '../features/auth/Signup.tsx';
import Login from '../features/auth/Login.tsx';
import QuizStatsPage from '../features/stats/QuizStatsPage.tsx';
import Layout from '../layouts/Layout.tsx';
import UnvalidatedQuizList from '../features/quiz/UnvalidatedQuizList.tsx';
import { QuizNotificationProvider } from '../context/QuizNotificationContext'; // 임포트 유지

const Router = () => {
  return (
    // ❗❗❗ QuizNotificationProvider를 Routes 전체를 감싸도록 변경 ❗❗❗
    // 이렇게 하면 Layout (및 그 안에 있는 TopToolbar)과 모든 하위 라우트가 Context에 접근할 수 있습니다.
    <QuizNotificationProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<QuizList />} />
          <Route path="quiz/:id" element={<Quiz />} />
          <Route path="Signup" element={<Signup />} />
          <Route path="Login" element={<Login />} />
          <Route path="QuizStatsPage" element={<QuizStatsPage />} />

          {/* CreateQuiz와 UnvalidatedQuizList는 이제 개별적으로 Provider로 감쌀 필요가 없습니다. */}
          {/* 이미 상위에서 모든 라우트를 감싸고 있기 때문입니다. */}
          <Route path="CreateQuiz" element={<CreateQuiz />} />
          <Route path="UnvalidatedQuizList" element={<UnvalidatedQuizList />} />

          {/* 추가적인 라우트가 있다면 여기에 계속 추가하세요 */}
        </Route>
      </Routes>
    </QuizNotificationProvider>
  );
};

export default Router;
import React, { useState, useEffect } from 'react'; // React, useState, useEffect 명시적으로 임포트
import type { QuizDetail } from '../../types/Quiz';
import { fetchUnvalidatedQuizzesList } from '../../api/quiz';
import { Typography } from '@mui/joy';
import Card from '@mui/joy/Card';
import AspectRatio from '@mui/joy/AspectRatio';
import Sheet from '@mui/joy/Sheet';
import Grid from '@mui/joy/Grid';

// ValidationPopup 컴포넌트를 임포트합니다.
import ValidationPopup from './ValidationPopup'; // ValidationPopup 컴포넌트의 실제 경로에 맞게 수정

const UnvalidatedQuizList: React.FC = () => {
  const [quizzes, setQuizzes] = useState<QuizDetail[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 팝업 열림/닫힘 상태
  const [popupOpen, setPopupOpen] = useState(false);
  // 팝업에 보여줄 선택된 퀴즈 데이터
  const [selectedQuiz, setSelectedQuiz] = useState<QuizDetail | null>(null);

  useEffect(() => {
    const getQuizzes = async () => {
      try {
        const data = await fetchUnvalidatedQuizzesList();
        setQuizzes(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    getQuizzes();
  }, []);

  // 퀴즈 카드 클릭 핸들러
  const handleCardClick = (quiz: QuizDetail) => {
    setSelectedQuiz(quiz); // 클릭한 퀴즈를 선택된 퀴즈로 설정
    setPopupOpen(true);   // 팝업 열기
  };

  // 팝업 닫기 핸들러
  const handlePopupClose = () => {
    setPopupOpen(false);
    setSelectedQuiz(null); // 팝업 닫을 때 선택된 퀴즈 초기화
    // 필요하다면, 팝업에서 퀴즈를 검증한 후 목록을 새로고침할 수도 있습니다.
    // getQuizzes(); // 퀴즈 목록을 다시 불러와서 변경된 validate 상태를 반영
  };

  if (loading) {
    return (
      <Sheet
        variant="plain"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '300px',
        }}
      >
        <Typography level="body-md">로딩 중...</Typography>
      </Sheet>
    );
  }

  return (
    <Sheet
      sx={{
        width: '100%',
        maxWidth: '100%',
        display: 'flex',
        justifyContent: 'center',
        p: 4,
      }}
    >
      <Sheet
        sx={{
          width: '100%',
          maxWidth: '1200px',
        }}
      >
        <Typography level="h2" sx={{ mb: 2 }}>
          미승인 퀴즈 목록
        </Typography>

        <Grid container spacing={2}>
          {quizzes.map((quiz) => (
            <Grid key={quiz.id} xs={12} sm={6} md={4} lg={3}>
              <Card
                variant="outlined"
                sx={{
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.03)',
                    cursor: 'pointer', // 클릭 가능함을 표시
                  },
                }}
                // Card 자체에 클릭 이벤트 추가
                onClick={() => handleCardClick(quiz)} 
              >
                {/* Link 컴포넌트 제거 또는 주석 처리 */}
                {/* <Link to={`/quiz/${quiz.id}`} style={{ textDecoration: 'none' }}> */}
                  <AspectRatio ratio="1" sx={{ borderRadius: 'md' }}>
                    <img
                      src={`${import.meta.env.VITE_SERVER_URL}${quiz.img}`}
                      alt={`Quiz ${quiz.id}`}
                      loading="lazy"
                    />
                  </AspectRatio>
                {/* </Link> */}
              </Card>
            </Grid>
          ))}
        </Grid>
      </Sheet>

      {/* ValidationPopup 컴포넌트 렌더링 */}
      {selectedQuiz && ( // 선택된 퀴즈가 있을 때만 팝업 렌더링
        <ValidationPopup
          open={popupOpen}
          onClose={handlePopupClose} // 닫기 핸들러 전달
          quiz={selectedQuiz} // 선택된 퀴즈 정보 전달
          // 필요하다면 result, failedWords 등 추가 데이터 전달
        />
      )}
    </Sheet>
  );
};

export default UnvalidatedQuizList;
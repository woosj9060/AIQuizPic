import * as React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SubmitQuiz from './SubmitQuiz.tsx';
import type { QuizDetail } from '../../types/Quiz.ts';
import { fetchDeleteQuiz, fetchQuizById } from '../../api/quiz.ts';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Typography,
  Alert,
  Link,
} from '@mui/joy';

const Quiz: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quiz, setQuiz] = React.useState<QuizDetail | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [celebrate, setCelebrate] = React.useState(false); // 축하 애니메이션 상태 관리
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    loadQuiz();
  }, [id]);
  
  React.useEffect(() => {
    if (celebrate) {
      const timer = setTimeout(() => {
        setCelebrate(true);  // DOM 표시
        setTimeout(() => setVisible(true), 10);
        setTimeout(() => setVisible(false), 1800); 
        setTimeout(() => setCelebrate(false), 2300); 
      });
      return () => clearTimeout(timer); // 클린업 함수 추가
    }
  }, [celebrate]);

  const deleteQuiz = async () => {
    const shouldDelete = confirm("퀴즈를 삭제하면 되돌릴 수 없습니다. 계속 하시겠습니까?");
    if(shouldDelete){
      if (!id) {
        alert('퀴즈 ID가 없습니다.'); // 브라우저 alert() 사용
        return;
      }
      try {
        const result = await fetchDeleteQuiz(parseInt(id, 10)); // 결과 객체 받기
        
        if (result.success) {
          alert(result.message); // 성공 메시지 alert()
          navigate('/'); // 성공 시 목록으로 이동
        } else {
          alert(result.message); // 실패 메시지 alert()
        }
      } catch (err: any) {
        alert(`퀴즈 삭제 중 오류 발생: ${err.message || '알 수 없는 오류'}`); // 네트워크 오류 등
        console.error('퀴즈 삭제 요청 실패:', err);
      }
    } else{
    };
  }

  const loadQuiz = async () => {
    if (!id) {
      setError('퀴즈 ID가 없습니다.');
      setLoading(false);
      return;
    }

    try {
      const data = await fetchQuizById(parseInt(id, 10));
      setQuiz(data);
    } catch (err: any) {
      console.error('퀴즈 불러오기 실패:', err);
      setError(err.message || '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress size="lg" />
      </Box>
    );
  }

  if (error || !quiz) {
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
        <Alert color="danger" variant="soft">
          <Typography level="h4">오류 발생</Typography>
          <Typography>{error || '퀴즈를 불러올 수 없습니다.'}</Typography>
        </Alert>
        <Box mt={2}>
          <Link component="button" onClick={() => navigate('/')}>
            ← 목록으로 돌아가기
          </Link>
        </Box>
      </Box>
    );
  }


  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <Button variant="outlined" onClick={() => navigate(-1)}>
          ← 뒤로 가기
        </Button>
        <Button variant="soft" color="danger" onClick={deleteQuiz}>
          퀴즈 삭제
        </Button>
      </Box>

      <Card sx={{ width: '100%', height: '90%'}}>
        <CardContent>
          <Typography level="h2" sx={{ textAlign: 'center', mb: 2 }}>
            퀴즈 #{quiz.id}
          </Typography>
          <Box
            sx={{
              width: '100%',
              minHeight: 200,
              overflow: 'hidden',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 2,
            }}
          >
            <img
              src={`${import.meta.env.VITE_SERVER_URL}${quiz.img}`}
              alt={`Quiz ${quiz.id}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '3px'
              }}
            />
          </Box>
          <Box
            sx={{
              width: '80%',
              display: 'flex',
              justifyContent: 'center',
              mt: 2, // 위쪽 여백 (선택)
            }}
          >
            <Box sx={{ width: '100%', maxWidth: 600 }}>
              <SubmitQuiz
                quizId={quiz.id}
                onSubmit={(matchCount) => console.log(`일치 개수: ${matchCount}`)}
                onCelebrate={setCelebrate}
              />
            </Box>
          </Box>
          
        </CardContent>
      </Card>

      {/* 전체 화면 축하 애니메이션 */}
      {celebrate && <div className={`confetti ${visible ? 'visible' : ''}`}>
        <div className="confetti-piece"></div>
        <div className="confetti-piece"></div>
        <div className="confetti-piece"></div>
        <div className="confetti-piece"></div>
        <div className="confetti-piece"></div>
        <div className="confetti-piece"></div>
        <div className="confetti-piece"></div>
        <div className="confetti-piece"></div>
        <div className="confetti-piece"></div>
        <div className="confetti-piece"></div>
        <div className="confetti-piece"></div>
        <div className="confetti-piece"></div>
        <div className="confetti-piece"></div>
      </div>}
    </Box>
  );
};

export default Quiz;

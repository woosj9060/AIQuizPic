import { Box, Typography, Button, Modal, Sheet } from '@mui/joy';
import type {ValidationPopupProps } from '../../types/Quiz';
import { fetchDeleteQuiz, fetchValidateQuiz } from '../../api/quiz.ts';
import React from 'react';
import { useNavigate } from 'react-router-dom';
const ValidationPopup: React.FC<ValidationPopupProps> = ({ quiz, open, onClose }) => {
    const [, setIsLoading] = React.useState(false);
    const navigate = useNavigate();
    const quizUrl = `${window.location.origin}/quiz/${quiz.id}`;



    const handleDeleteAndClose = async () => {
        const shouldDelete = confirm("창을 닫으면 생성중이던 퀴즈가 삭제됩니다. 계속 하시겠습니까?");
        if (shouldDelete) {
            fetchDeleteQuiz(quiz.id);
            if (onClose) {
                onClose();
            }
            navigate('/');
        } else{
        }
    };
  const handleValidation = async () => {
    setIsLoading(true); // 로딩 시작
    try {
      // ❗ API 함수 호출
      const result = await fetchValidateQuiz(quiz.id, 1);
      alert(result.message); // 서버에서 받은 메시지 표시
      onClose(); // 성공 시 팝업 닫기
    } catch (error: any) {
      console.error('퀴즈 검증 오류:', error);
      alert(error.message); // API 함수에서 던진 에러 메시지 표시
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Sheet
        variant="outlined"
        sx={{
          maxWidth: 500,
          mx: 'auto',
          my: '10%',
          p: 3,
          borderRadius: 'md',
          boxShadow: 'lg',
        }}
      >
        <Typography level="h4" textAlign="center" gutterBottom>
          퀴즈 검증하기
        </Typography>

        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <img
            src={`${import.meta.env.VITE_SERVER_URL}${quiz.img}`}
            alt="퀴즈 이미지"
            style={{ maxWidth: '100%', borderRadius: '8px' }}
          />
        </Box>

        <Typography level="body-lg" textAlign="center" gutterBottom>
          단어: {quiz.word1}, {quiz.word2}, {quiz.word3}
        </Typography>

        <Typography level="body-md" textAlign="center" gutterBottom sx={{ wordBreak: 'break-all' }}>
          퀴즈 링크: <br /> {quizUrl}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button color="primary" onClick={handleValidation}>
            1차 검증 시작
          </Button>
          <Button variant="outlined" onClick={handleDeleteAndClose}>
            닫기
          </Button>
        </Box>
      </Sheet>
    </Modal>
  );
};

export default ValidationPopup;
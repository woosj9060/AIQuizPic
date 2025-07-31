import React, { useState } from 'react';
import { Box, Typography, Button, Modal, Sheet } from '@mui/joy';
import type { QuizDetail } from '../../types/Quiz';

interface QuizCreationPopupProps {
  open: boolean;
  onClose: () => void;
  quiz: QuizDetail;
}

const QuizCreationPopup: React.FC<QuizCreationPopupProps> = ({ open, onClose, quiz }) => {
  const quizUrl = `${window.location.origin}/quiz/${quiz.id}`;
  const [isValidated, setIsValidated] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(quizUrl);
      alert('링크가 복사되었습니다!');
    } catch (err) {
      console.error('복사 실패:', err);
      alert('복사에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  const handleFirstValidation = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/quiz/${quiz.id}/validate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await res.json();

      if (res.status === 200) {
        alert('검증 성공! 퀴즈가 사용 가능합니다.');
        setIsValidated(true);
        onClose();
      } else if (res.status === 202) {
        alert('2차 검증이 필요합니다.');
      } else {
        alert('검증 실패: ' + (data.message || '원인을 알 수 없음'));
      }
    } catch (err) {
      console.error('검증 중 오류 발생:', err);
      alert('서버 오류가 발생했습니다.');
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
          퀴즈 미리보기
        </Typography>

        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <img
            src={`${import.meta.env.VITE_SERVER_URL}${quiz.img}`}
            alt="생성된 퀴즈"
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
          <Button color="primary" onClick={handleFirstValidation} disabled={isValidated}>
            {isValidated ? '검증 완료' : '1차 검증'}
          </Button>
          <Button variant="outlined" onClick={handleCopy}>
            링크 복사
          </Button>
          <Button variant="soft" onClick={handleGoHome}>
            홈으로 이동
          </Button>
        </Box>
      </Sheet>
    </Modal>
  );
};

export default QuizCreationPopup;

// SubmitQuiz.tsx
import * as React from 'react';
import Button from '@mui/joy/Button';
import Input from '@mui/joy/Input';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import { Snackbar, Alert } from '@mui/joy';
import type { SubmitQuizProps } from '../../types/Quiz'  // 타입이 정의된 곳을 가져옵니다.
import { fetchSubmitQuiz } from '../../api/quiz';
import './CelebrateEffect.css';

const SubmitQuiz: React.FC<SubmitQuizProps> = ({ quizId, onSubmit, onCelebrate }) => {
  const [word1, setWord1] = React.useState('');
  const [word2, setWord2] = React.useState('');
  const [word3, setWord3] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');

  const handleSubmit = async () => {
    if (!word1.trim() || !word2.trim() || !word3.trim()) {
      setSnackbarMessage('모든 단어를 입력해주세요!');
      setOpenSnackbar(true);
      return;
    }

    setIsLoading(true);

    try {
      const matchCount = await fetchSubmitQuiz(quizId, word1, word2, word3);
      if (matchCount === 3) {
        setSnackbarMessage("정답입니다!");
        onCelebrate(true);
      } else {
        setSnackbarMessage(`${matchCount}개 일치합니다!`);
      }

      setOpenSnackbar(true);

      if (onSubmit) {
        onSubmit(matchCount);
      }
    } catch (error) {
      console.error('전송 실패:', error);
      setSnackbarMessage('전송에 실패했습니다. 다시 시도해주세요.');
      setOpenSnackbar(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  return (
    <Stack spacing={2} sx={{ padding: 2, maxWidth: 400 }}>
      <Typography level="h3">단어 3개 입력</Typography>

      <Input
        placeholder="첫 번째 단어"
        value={word1}
        onChange={(e) => setWord1(e.target.value)}
        variant="outlined"
      />

      <Input
        placeholder="두 번째 단어"
        value={word2}
        onChange={(e) => setWord2(e.target.value)}
        variant="outlined"
      />

      <Input
        placeholder="세 번째 단어"
        value={word3}
        onChange={(e) => setWord3(e.target.value)}
        variant="outlined"
      />

      <Button
        variant="solid"
        onClick={handleSubmit}
        loading={isLoading}
        disabled={!word1.trim() || !word2.trim() || !word3.trim()}
      >
        전송하기
      </Button>

      {/* Snackbar 메시지 */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        sx={{
        }}
      >
        <Alert variant="soft" color="neutral"
        sx={{
          fontSize: '1.2rem',
          px: 3,
          py: 2,
          borderRadius: 'md',
          textAlign: 'center',
        }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Stack>
  );
};

export default SubmitQuiz;
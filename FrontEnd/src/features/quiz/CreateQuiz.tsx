import * as React from 'react';
import { Box, Typography, Stack, Input, Button, Sheet } from '@mui/joy';
import { fetchCreateQuiz } from '../../api/quiz';
import type { QuizDetail } from '../../types/Quiz';
import ValidationPopup from './ValidationPopup.tsx';

const CreateQuiz: React.FC = () => {
  const [word1, setWord1] = React.useState("");
  const [word2, setWord2] = React.useState("");
  const [word3, setWord3] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [createdQuiz, setCreatedQuiz] = React.useState<QuizDetail | null>(null);
  const [popupOpen, setPopupOpen] = React.useState(false);

const isValidWord = (word: string) => {
  const trimmed = word.trim();
  const isKoreanOnly = /^[가-힣]+$/.test(trimmed); // 한글만
  return trimmed.length <= 4 && isKoreanOnly;
};

const handleSubmit = async () => {
  if (!word1.trim() || !word2.trim() || !word3.trim()) {
    alert("모든 단어를 입력해주세요!");
    return;
  }

  if (!isValidWord(word1) || !isValidWord(word2) || !isValidWord(word3)) {
    alert("단어는 4글자 이하의 한글만 입력해주세요 (공백, 영어, 특수문자 금지)");
    return;
  }

  setIsLoading(true);

  try {
    const quiz = await fetchCreateQuiz(word1, word2, word3);
    setCreatedQuiz(quiz);
    setPopupOpen(true);
  } catch (error: any) {
    console.error('전송 실패:', error);
    alert(error.message);
  } finally {
    setIsLoading(false);
  }
};
  return (
    <div>
      <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh',
        backgroundColor: 'background.body',
      }}
    >
      <Sheet
        variant="outlined"
        sx={{
          padding: 4,
          borderRadius: 'lg',
          boxShadow: 'md',
          maxWidth: 400,
          width: '100%',
        }}
      >
        <Stack spacing={3}>
          <Typography level="h3" textAlign="center">
            단어 3개 입력
          </Typography>

          <Input
            placeholder="첫 번째 단어"
            value={word1}
            onChange={(e) => setWord1(e.target.value)}
            variant="soft"
            size="lg"
          />

          <Input
            placeholder="두 번째 단어"
            value={word2}
            onChange={(e) => setWord2(e.target.value)}
            variant="soft"
            size="lg"
          />

          <Input
            placeholder="세 번째 단어"
            value={word3}
            onChange={(e) => setWord3(e.target.value)}
            variant="soft"
            size="lg"
          />

          <Button
            variant="solid"
            size="lg"
            onClick={handleSubmit}
            loading={isLoading}
            disabled={!word1.trim() || !word2.trim() || !word3.trim()}
          >
            전송하기
          </Button>
        </Stack>
      </Sheet>
    </Box>
      {createdQuiz && (
        <ValidationPopup
          open={popupOpen}
          onClose={() => setPopupOpen(false)}
          quiz={createdQuiz}
          // result={createdQuiz.result}
          // failedWords={createdQuiz.failedWords}
        />
      )}
    </div>
    
    
  );
}

export default CreateQuiz;
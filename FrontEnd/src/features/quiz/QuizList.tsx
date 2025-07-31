import * as React from 'react';
import { Link } from 'react-router-dom';
import type { QuizDetail } from '../../types/Quiz';
import { fetchQuizList } from '../../api/quiz';
import { Typography } from '@mui/joy';
import Card from '@mui/joy/Card';
import AspectRatio from '@mui/joy/AspectRatio';
import Sheet from '@mui/joy/Sheet';
import Grid from '@mui/joy/Grid';

const QuizList: React.FC = () => {
  const [quizzes, setQuizzes] = React.useState<QuizDetail[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const getQuizzes = async () => {
      try {
        const data = await fetchQuizList();
        setQuizzes(data);
        setLoading(false);
      } catch (err) {
        console.error('퀴즈 불러오기 실패:', err);
        setLoading(false);
      }
    };

    getQuizzes();
  }, []);

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
          maxWidth: '1200px', // 중앙 정렬 + 최대폭 제한
        }}
      >
        <Typography level="h2" sx={{ mb: 2 }}>
          퀴즈 목록
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
                  },
                }}
              >
                <Link to={`/quiz/${quiz.id}`} style={{ textDecoration: 'none' }}>
                  <AspectRatio ratio="1" sx={{ borderRadius: 'md' }}>
                    <img
                      src={`${import.meta.env.VITE_SERVER_URL}${quiz.img}`}
                      alt={`Quiz ${quiz.id}`}
                      loading="lazy"
                    />
                  </AspectRatio>
                </Link>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Sheet>
    </Sheet>
  );
};

export default QuizList;

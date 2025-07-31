import * as React from 'react';
import { Card, CardCover, Typography, Grid } from '@mui/joy';
import { Link } from 'react-router-dom';
import type { SolvedQuiz } from '../../types/Quiz'
import { fetchSolvedQuizzes } from '../../api/quiz';

const SolvedQuizList: React.FC = () => {
  const [solvedQuizzes, setSolvedQuizzes] = React.useState<SolvedQuiz[]>([]);

  React.useEffect(() => {
    const getSolvedQuizzes = async () => {
      try {
        const data = await fetchSolvedQuizzes();
        setSolvedQuizzes(data);
      } catch (err) {
        console.error('퀴즈 불러오기 실패:',err);
      }
    }

    getSolvedQuizzes();
  }, []);

  return (
    <div>
      <Typography level="h4" sx={{ mb: 2 }}>
        내가 푼 퀴즈
      </Typography>
      <Grid container spacing={2}>
        {solvedQuizzes.map(quiz => (
          <Grid key={quiz.id} xs={12} sm={6} md={4}>
            <Card variant="outlined" sx={{ minHeight: 200 }}>
              <CardCover>
                <Link to={`/quiz/${quiz.id}`}>
                    <img
                    src={`${import.meta.env.VITE_SERVER_URL}${quiz.img}`} 
                    alt={`Quiz ${quiz.id}`} 
                    loading="lazy"
                    />
                </Link>
              </CardCover>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default SolvedQuizList;
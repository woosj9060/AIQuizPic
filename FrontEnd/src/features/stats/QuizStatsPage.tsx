import React from 'react';
import { Grid, Sheet } from '@mui/joy';
import SolvedQuizList from './SolvedQuizList';
import Ranking from './Ranking';

const QuizStatsPage: React.FC = () => {
  return (
    <Grid container spacing={2} sx={{ p: 4 }}>
      {/* 좌측 푼 퀴즈 */}
      <Grid xs={12} md={8}>
        <Sheet variant="outlined" sx={{ p: 2, borderRadius: 'md' }}>
          <SolvedQuizList />
        </Sheet>
      </Grid>

      {/* 우측 랭킹 */}
      <Grid xs={12} md={4}>
        <Sheet variant="outlined" sx={{ p: 2, borderRadius: 'md' }}>
          <Ranking />
        </Sheet>
      </Grid>
    </Grid>
  );
};

export default QuizStatsPage;

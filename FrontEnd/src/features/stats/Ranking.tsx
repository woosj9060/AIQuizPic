import React from 'react';
import { Box, Typography, List, ListItem, ListItemDecorator, Button, Divider } from '@mui/joy';
import type { UserRanking } from '../../types/User';
import { fetchUserRankings } from '../../api/user';

const Ranking: React.FC = () => {
  const [rankings, setRankings] = React.useState<UserRanking[]>([]);
  const [page, setPage] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(0);

  const loadRankings = async (pageNumber: number) => {
    try {
      const data = await fetchUserRankings(pageNumber);
      setRankings(data.content);
      setTotalPages(data.totalPages);
      setPage(data.number);
    } catch (error) {
      console.error('랭킹 불러오기 실패:', error);
    }
  };

  React.useEffect(() => {
    loadRankings(0);
  }, []);

  const handlePrevious = () => {
    if (page > 0) loadRankings(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages - 1) loadRankings(page + 1);
  };


  return (
    <Box sx={{ width: '100%', maxWidth: 400, margin: 'auto', p: 2 }}>
      <Typography level="h4" gutterBottom textAlign="center">
        유저 랭킹
      </Typography>

      <List>
        {rankings.map((ranking, index) => (
          <ListItem key={index}>
            <ListItemDecorator>{index + 1 + (page * 10)}위</ListItemDecorator>
            <Typography>{ranking.username} - {ranking.solvedCount} 문제</Typography>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="outlined" onClick={handlePrevious} disabled={page === 0}>
          이전
        </Button>
        <Typography level="body-md">
          {page + 1} / {totalPages} 페이지
        </Typography>
        <Button variant="outlined" onClick={handleNext} disabled={page === totalPages - 1}>
          다음
        </Button>
      </Box>
    </Box>
  );
};


export default Ranking;

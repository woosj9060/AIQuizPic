import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  Input,
  Stack,
  Typography
} from '@mui/joy';
import { fetchSignup } from '../../api/user';

const Signup: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      await fetchSignup(username, password);
      alert('회원가입 성공! 로그인 페이지로 이동합니다.');
      navigate('/Login');
    } catch (error) {
      console.error('회원가입 실패:', error);
      alert(`회원가입 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.body',
        p: 2,
      }}
    >
      <Card
        variant="outlined"
        sx={{
          width: 400,
          p: 4,
          boxShadow: 'md',
          borderRadius: 'lg',
        }}
      >
        <Typography level="h3" textAlign="center" mb={2}>
          회원가입
        </Typography>

        <Stack spacing={2}>
          <Input
            placeholder="아이디"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            size="lg"
            variant="outlined"
          />
          <Input
            placeholder="비밀번호"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            size="lg"
            variant="outlined"
          />
          <Button
            onClick={handleSignup}
            disabled={!username.trim() || !password.trim()}
            size="lg"
            variant="solid"
            color="primary"
          >
            가입하기
          </Button>
        </Stack>
      </Card>
    </Box>
  );
};

export default Signup;

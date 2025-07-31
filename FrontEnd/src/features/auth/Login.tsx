import * as React from 'react';
import {
  Box,
  Button,
  Card,
  Input,
  Stack,
  Typography
} from '@mui/joy';
import { useNavigate } from 'react-router-dom';
import { fetchLogin } from '../../api/quiz';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleLogin = async () => {
    try {
      const token = await fetchLogin(username, password);
      localStorage.setItem('token', token);
      alert('로그인 성공');
      navigate('/');
      window.location.reload();
    } catch (error) {
      console.error('로그인 실패:', error);
      alert('로그인 실패: 아이디 또는 비밀번호를 확인하세요.');
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
          로그인
        </Typography>

        <Stack spacing={2}>
          <Input
            placeholder="아이디"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            variant="outlined"
            size="lg"
          />
          <Input
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            variant="outlined"
            size="lg"
          />
          <Button
            variant="solid"
            color="primary"
            onClick={handleLogin}
            disabled={!username.trim() || !password.trim()}
            size="lg"
          >
            전송하기
          </Button>
        </Stack>
      </Card>
    </Box>
  );
};

export default Login;

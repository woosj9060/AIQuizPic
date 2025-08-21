import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sheet,
  Box,
  Typography,
  Avatar,
  Tooltip,
  IconButton,
  Stack,
  Divider,
} from '@mui/joy';
import {
  Login,
  PersonAdd,
  Logout,
  Person,
  WarningRounded,
  Leaderboard,
  Add,
} from '@mui/icons-material';

import { checkUnvalidatedQuizzesExist } from '../api/quiz';
import { useQuizNotifications } from '../context/QuizNotificationContext';

interface TopToolbarProps {}

const TopToolbar: React.FC<TopToolbarProps> = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [hasUnvalidatedQuizzes, setHasUnvalidatedQuizzes] = useState<boolean>(false);

  const { refreshNotifications: contextRefreshNotificationsRef } = useQuizNotifications();

  const updateUnvalidatedQuizStatus = useCallback(async () => {
    try {
      const exists = await checkUnvalidatedQuizzesExist();
      setHasUnvalidatedQuizzes(exists);
    } catch (error) {
      console.error('미승인 퀴즈 상태 확인 실패:', error);
      setHasUnvalidatedQuizzes(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUsername(token);
    }
    updateUnvalidatedQuizStatus();
  }, [isLoggedIn, updateUnvalidatedQuizStatus]);

  useEffect(() => {
    contextRefreshNotificationsRef.current = updateUnvalidatedQuizStatus;
  }, [updateUnvalidatedQuizStatus, contextRefreshNotificationsRef]);

  const fetchUsername = async (token: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/username`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const usernameData = await response.text();
        setUsername(usernameData);
        setIsLoggedIn(true);
      } else {
        console.error('사용자 정보 가져오기 실패:', response.statusText);
        localStorage.removeItem('token');
        setUsername(null);
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error('사용자 정보 가져오기 중 네트워크 오류:', error);
      localStorage.removeItem('token');
      setUsername(null);
      setIsLoggedIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUsername(null);
    setIsLoggedIn(false);
    updateUnvalidatedQuizStatus();
    navigate('/');
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleUnvalidatedQuizClick = () => {
    navigate('/UnvalidatedQuizList');
  };

  return (
    <Sheet
      component="header"
      variant="soft"
      color="primary"
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 1100,
        py: 1,
        px: 0,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: 1200,
          mx: 'auto',
          width: '100%',
        }}
      >
        {/* 좌측 로고 영역 */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/">
            <img src="/logo.png" alt="AIQuizpic Logo" style={{ width: '150px' }} />
          </Link>
        </Box>

        {/* 우측 버튼 영역 */}
        <Stack direction="row" spacing={1.5} alignItems="center">
          {isLoggedIn ? (
            <>
              {/* 미승인 퀴즈 알림 아이콘 */}
              {hasUnvalidatedQuizzes && (
                <Tooltip title="미승인 퀴즈가 있어요!" variant="solid" color="danger">
                  <IconButton
                    variant="plain"
                    color="danger"
                    onClick={handleUnvalidatedQuizClick}
                    size="sm"
                  >
                    <WarningRounded />
                  </IconButton>
                </Tooltip>
              )}

              {/* 퀴즈 만들기 버튼 */}
              <Tooltip title="퀴즈 만들기" variant="solid">
                <IconButton
                  variant="plain"
                  color="neutral"
                  onClick={() => handleNavigation('/CreateQuiz')}
                  size="sm"
                >
                  <Add />
                </IconButton>
              </Tooltip>

              {/* 랭킹 보기 버튼 */}
              <Tooltip title="랭킹 보기" variant="solid">
                <IconButton
                  variant="plain"
                  color="neutral"
                  onClick={() => navigate('/QuizStatsPage')}
                  size="sm"
                >
                  <Leaderboard />
                </IconButton>
              </Tooltip>

              <Divider orientation="vertical" />
              
              {/* 사용자 정보 및 로그아웃 */}
              <Stack direction="row" spacing={1} alignItems="center">
                <Avatar size="sm">
                  <Person />
                </Avatar>
                <Typography level="body-sm" fontWeight="lg" sx={{ display: { xs: 'none', md: 'block' } }}>
                  {username || '사용자'}
                </Typography>
                <Tooltip title="로그아웃" variant="solid">
                  <IconButton
                    variant="plain"
                    color="neutral"
                    onClick={handleLogout}
                    size="sm"
                  >
                    <Logout />
                  </IconButton>
                </Tooltip>
              </Stack>
            </>
          ) : (
            <>
              {/* 로그인되지 않은 상태 */}
              <Tooltip title="회원가입" variant="solid">
                <IconButton
                  variant="solid"
                  color="neutral"
                  onClick={() => handleNavigation('/Signup')}
                  size="sm"
                >
                  <PersonAdd />
                </IconButton>
              </Tooltip>

              <Tooltip title="로그인" variant="solid">
                <IconButton
                  variant="solid"
                  color="primary"
                  onClick={() => handleNavigation('/Login')}
                  size="sm"
                >
                  <Login />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Stack>
      </Box>
    </Sheet>
  );
};

export default TopToolbar;
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sheet,
  Box,
  Button,
  Typography,
  Avatar,
  Dropdown,
  MenuButton,
  Menu,
  MenuItem,
  Chip,
  Tooltip
} from '@mui/joy';
import {
  Quiz,
  Login,
  PersonAdd,
  Logout,
  Person,
  WarningRounded
} from '@mui/icons-material';

import { checkUnvalidatedQuizzesExist } from '../api/quiz';
import { useQuizNotifications } from '../context/QuizNotificationContext'; // ❗ Context 훅 임포트

interface TopToolbarProps {}

const TopToolbar: React.FC<TopToolbarProps> = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [hasUnvalidatedQuizzes, setHasUnvalidatedQuizzes] = useState<boolean>(false);

  // ❗ Context에서 refreshNotifications Ref를 가져옵니다.
  const { refreshNotifications: contextRefreshNotificationsRef } = useQuizNotifications();

  // 미승인 퀴즈 존재 여부를 확인하고 상태를 업데이트하는 함수
  const updateUnvalidatedQuizStatus = useCallback(async () => {
    try {
      const exists = await checkUnvalidatedQuizzesExist();
      setHasUnvalidatedQuizzes(exists);
    } catch (error) {
      console.error('미승인 퀴즈 상태 확인 실패:', error);
      // API 호출 실패 시 알림을 숨기거나 에러 처리
      setHasUnvalidatedQuizzes(false);
    }
  }, []); // 의존성이 없으므로 컴포넌트 마운트 시 한 번만 생성됩니다.

  // 컴포넌트 초기 로드 시 및 로그인 상태 변경 시 사용자 정보 및 알림 상태 확인
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUsername(token);
    }
    updateUnvalidatedQuizStatus(); // 초기 로드 시 알림 상태도 확인
  }, [isLoggedIn, updateUnvalidatedQuizStatus]); // isLoggedIn 변경 시 재실행

  // ❗ Context의 refreshNotifications Ref에 실제 함수를 할당합니다.
  // 이 useEffect는 컴포넌트 마운트 시 한 번만 실행됩니다.
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
    // 로그아웃 후 알림 상태도 재확인
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
      variant="outlined"
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 1100,
        borderRadius: 0,
        borderTop: 'none',
        borderLeft: 'none',
        borderRight: 'none',
        py: 1.5,
        px: 2
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mx: 'auto',
          width: '100%'
        }}
      >
        {/* 좌측 로고 영역 */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Link to={`/`}>
            <img src="/logo.png" alt="AIQuizpic Logo" style={{ width: '150px' }} />
          </Link>
        </Box>

        {/* 우측 버튼 영역 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {isLoggedIn ? (
            <>
              {/* 미승인 퀴즈 알림 아이콘 */}
              {hasUnvalidatedQuizzes && (
                <Tooltip title="미승인 퀴즈가 있습니다! 클릭하여 확인" variant="soft" color="warning">
                  <Button
                    variant="plain" 
                    color="danger" // Danger 색상으로 설정하여 경고 효과 유지
                    onClick={handleUnvalidatedQuizClick}
                    sx={{
                      minWidth: 0, 
                      padding: 0,  
                      '&:hover': {
                        backgroundColor: 'background.level1',
                      }
                    }}
                  >
                    <WarningRounded sx={{ color: 'error.500', fontSize: 'xl' }} />
                  </Button>
                </Tooltip>
              )}
              
              <Button
                variant="outlined"
                startDecorator={<Quiz />}
                onClick={() => handleNavigation('/CreateQuiz')}
                size="sm"
              >
                퀴즈 만들기
              </Button>
              <Button
                variant="plain"
                color="primary"
                size="sm"
                onClick={() => navigate('/QuizStatsPage')}
                sx={{
                  ml: 1,
                  fontWeight: 'md',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: 'background.level1',
                  },
                }}
              >
                랭킹 보기
              </Button>
              {/* 사용자 정보 및 드롭다운 메뉴 */}
              <Dropdown>
                <MenuButton
                  slots={{ root: Chip }}
                  slotProps={{
                    root: {
                      variant: 'outlined',
                      color: 'primary'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar size="sm">
                      <Person />
                    </Avatar>
                    <Typography level="body-sm">
                      {username || '사용자'}
                    </Typography>
                  </Box>
                </MenuButton>
                <Menu placement="bottom-end" size="sm" >
                  <MenuItem onClick={handleLogout} >
                    <Logout sx={{ mr: 1 }} />
                    로그아웃
                  </MenuItem>
                </Menu>
              </Dropdown>
            </>
          ) : (
            <>
              {/* 로그인되지 않은 상태 */}
              <Button
                variant="outlined"
                startDecorator={<PersonAdd />}
                onClick={() => handleNavigation('/Signup')}
                size="sm"
                color="neutral"
              >
                회원가입
              </Button>

              <Button
                variant="solid"
                startDecorator={<Login />}
                onClick={() => handleNavigation('/Login')}
                size="sm"
                color="primary"
              >
                로그인
              </Button>
            </>
          )}
        </Box>
      </Box>
    </Sheet>
  );
};

export default TopToolbar;
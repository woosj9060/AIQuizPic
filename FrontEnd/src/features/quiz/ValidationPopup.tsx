import { Box, Typography, Button, Modal, Sheet } from '@mui/joy';
import type {ValidationPopupProps } from '../../types/Quiz';
import { fetchDeleteQuiz, fetchValidateQuiz } from '../../api/quiz.ts';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ValidationPopup: React.FC<ValidationPopupProps> = ({ quiz, open, onClose }) => {
    const [, setIsLoading] = React.useState(false);
    const navigate = useNavigate();
    const quizUrl = `${window.location.origin}/quiz/${quiz.id}`;

    const handleDeleteAndClose = async () => {
        const shouldDelete = confirm("창을 닫으면 생성중이던 퀴즈가 삭제됩니다. 계속 하시겠습니까?");
        if (shouldDelete) {
            fetchDeleteQuiz(quiz.id);
            if (onClose) {
                onClose();
            }
            navigate('/');
        } else{
        }
    };

    const handleValidation = async () => {
        setIsLoading(true); // 로딩 시작
        try {
            // ❗ API 함수 호출
            const result = await fetchValidateQuiz(quiz.id, 1);
            alert(result.message); // 서버에서 받은 메시지 표시
            onClose(); // 성공 시 팝업 닫기
        } catch (error: any) {
            console.error('퀴즈 검증 오류:', error);
            alert(error.message); // API 함수에서 던진 에러 메시지 표시
        } finally {
            setIsLoading(false); // 로딩 종료
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Sheet
                variant="outlined"
                sx={{
                    maxWidth: 500,
                    width: '90%',
                    maxHeight: '90vh', // 화면 높이의 90%로 제한
                    mx: 'auto',
                    my: '5vh', // 상하 마진을 5vh로 조정
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 'md',
                    boxShadow: 'lg',
                    overflow: 'hidden', // Sheet 자체의 overflow 숨김
                }}
            >
                {/* 헤더 - 고정 */}
                <Box sx={{ p: 3, pb: 2, flexShrink: 0 }}>
                    <Typography level="h4" textAlign="center" gutterBottom>
                        퀴즈 검증하기
                    </Typography>
                </Box>

                {/* 스크롤 가능한 콘텐츠 영역 */}
                <Box 
                    sx={{ 
                        flex: 1,
                        overflowY: 'auto',
                        px: 3,
                        pb: 2,
                        // 스크롤바 스타일링 (선택사항)
                        '&::-webkit-scrollbar': {
                            width: '6px',
                        },
                        '&::-webkit-scrollbar-track': {
                            background: '#f1f1f1',
                            borderRadius: '3px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            background: '#c1c1c1',
                            borderRadius: '3px',
                        },
                        '&::-webkit-scrollbar-thumb:hover': {
                            background: '#a8a8a8',
                        },
                    }}
                >
                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                        <img
                            src={`${import.meta.env.VITE_SERVER_URL}${quiz.img}`}
                            alt="퀴즈 이미지"
                            style={{ 
                                maxWidth: '100%', 
                                height: 'auto',
                                borderRadius: '8px' 
                            }}
                        />
                    </Box>

                    <Typography level="body-lg" textAlign="center" gutterBottom>
                        단어: {quiz.word1}, {quiz.word2}, {quiz.word3}
                    </Typography>

                    <Typography 
                        level="body-md" 
                        textAlign="center" 
                        gutterBottom 
                        sx={{ wordBreak: 'break-all' }}
                    >
                        퀴즈 링크: <br /> {quizUrl}
                    </Typography>
                </Box>

                {/* 버튼 영역 - 고정 */}
                <Box 
                    sx={{ 
                        p: 3, 
                        pt: 2,
                        flexShrink: 0,
                        borderTop: '1px solid',
                        borderColor: 'divider',
                        backgroundColor: 'background.surface'
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                        <Button color="primary" onClick={handleValidation}>
                            1차 검증 시작
                        </Button>
                        <Button variant="outlined" onClick={handleDeleteAndClose}>
                            닫기
                        </Button>
                    </Box>
                </Box>
            </Sheet>
        </Modal>
    );
};

export default ValidationPopup;
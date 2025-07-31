package com.woosj9060.aiquizpic.ranking;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.woosj9060.aiquizpic.auth.*;
@Service
public class QuizRankingService {

    private final UserRepository userRepository;

    public QuizRankingService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<SolvedQuiz> getSolvedQuizzes(String username) {
        Users user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));

        return user.getSolvedQuizzes().stream()
                .map(quiz -> new SolvedQuiz(quiz.getId(), quiz.getImg())) // quiz 엔티티에 이미지 url 필드 있다고 가정
                .collect(Collectors.toList());
    }

    public int getSolvedQuizCount(String username) {
        Users user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));
        return user.getSolvedQuizzes().size();
    }

    public Page<UserRanking> getUserRankings(Pageable pageable) {
        return userRepository.findTopUserRankings(pageable);
    }
}

package com.woosj9060.aiquizpic.ranking;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.woosj9060.aiquizpic.auth.*;
@RestController
@RequestMapping("/api/stats")
public class QuizRankingController {

    private final QuizRankingService quizRankingService;

    public QuizRankingController(QuizRankingService quizRankingService) {
        this.quizRankingService = quizRankingService;
    }

    @GetMapping("/solved")
    public ResponseEntity<List<SolvedQuiz>> getSolvedQuizzes(Authentication authentication) {
        MyUserDetails userDetails = (MyUserDetails) authentication.getPrincipal();
        String username = userDetails.getUsername();

        return ResponseEntity.ok(quizRankingService.getSolvedQuizzes(username));
    }

    @GetMapping("/solved/count")
    public ResponseEntity<Integer> getSolvedQuizCount(Authentication authentication) {
        MyUserDetails userDetails = (MyUserDetails) authentication.getPrincipal();
        String username = userDetails.getUsername();

        return ResponseEntity.ok(quizRankingService.getSolvedQuizCount(username));
    }

    @GetMapping("/rankings")
    public ResponseEntity<Page<UserRanking>> getUserRankings(@PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(quizRankingService.getUserRankings(pageable));
    }
}

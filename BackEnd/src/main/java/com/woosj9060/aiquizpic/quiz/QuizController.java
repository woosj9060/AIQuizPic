package com.woosj9060.aiquizpic.quiz;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.woosj9060.aiquizpic.auth.MyUserDetails;
import com.woosj9060.aiquizpic.auth.Users;

import java.util.List;

@RestController
@RequestMapping("/api/quiz")
@CrossOrigin(origins = "http://localhost:5173")
public class QuizController {

    private final QuizService quizService;

    public QuizController(QuizService quizService) {
        this.quizService = quizService;
    }

    @GetMapping("")
    public List<Quiz> getValidatedQuiz() {
        List<Quiz> result = quizService.getValidatedQuizzes();
        System.out.println("여기까지 잘됨" + result);
        return result;
    }

    @GetMapping("/unvalidated")
    public List<?> getUnvalidatedQuiz(Authentication authentication) {
        if (authentication != null && authentication.isAuthenticated() 
            && !authentication.getName().equals("anonymousUser")) {
            // 로그인한 사용자
            MyUserDetails userDetails = (MyUserDetails) authentication.getPrincipal();
            Users user = userDetails.getUser();
            return quizService.getUnvalidatedQuizzes(user);}
        else{
            return (List<?>) ResponseEntity.status(HttpStatus.UNAUTHORIZED);
        }
    }

    @GetMapping("/{id}")
    public Quiz getQuiz(@PathVariable Integer id) {
        return quizService.getQuizById(id);
    }

    @PostMapping("/{id}/submit")
    public int CheckQuiz(@PathVariable Integer id, @RequestBody WordsRequest requestWords,Authentication authentication){
        String[] words = requestWords.getWords();
        if (authentication != null && authentication.isAuthenticated() 
            && !authentication.getName().equals("anonymousUser")) {
            // 로그인한 사용자
            MyUserDetails userDetails = (MyUserDetails) authentication.getPrincipal();
            int userId = userDetails.getId();
            return quizService.markingQuiz(id, words, userId);
        } else {
            // 비로그인 사용자
            return quizService.markingQuiz(id, words);
        }
    }

    @GetMapping("/{id}/image")
    public ResponseEntity<String> getQuizImage(@PathVariable Integer id) {
        String imageUrl = quizService.getImagePathById(id);
        if (imageUrl == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(imageUrl);
    }

    @PostMapping("/generate")
    public ResponseEntity<?> generateQuiz(@RequestBody WordsRequest requestWords, @AuthenticationPrincipal MyUserDetails userDetails) {
        if (userDetails == null){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }
        Users user = userDetails.getUser();
        return quizService.generateQuiz(requestWords, user);
    }

    @PostMapping("/validate/{id}/1")
    public ResponseEntity<?> validateFirst(@PathVariable Integer id, Authentication authentication) {
        MyUserDetails userDetails = (MyUserDetails) authentication.getPrincipal();
        Users user = userDetails.getUser();
        if (user == null){
            return (ResponseEntity<?>) ResponseEntity.status(HttpStatus.BAD_REQUEST);
        }
        return quizService.validateQuiz(id, user);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteQuiz(@PathVariable Integer id, Authentication authentication) {
        try {
            MyUserDetails userDetails = (MyUserDetails) authentication.getPrincipal();
            Users user = userDetails.getUser();
            if (user == null){
                return (ResponseEntity<?>) ResponseEntity.status(HttpStatus.BAD_REQUEST);
            }
            boolean deleted = quizService.deleteQuizById(id, user);
            if (deleted) {
                return ResponseEntity.ok("퀴즈가 성공적으로 삭제되었습니다.");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("퀴즈 생성자와 삭제 시도 유저가 일치하지 않습니다.");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("서버 오류: " + e.getMessage());
        }
    }

    @GetMapping("/unvalidated/exists")
    public ResponseEntity<Boolean> checkUnvalidatedQuizzesExist() {
        boolean exists = quizService.hasUnvalidatedQuizzes();
        return ResponseEntity.ok(exists);
    }
}
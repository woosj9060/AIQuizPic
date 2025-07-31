package com.woosj9060.aiquizpic.quiz;

import java.io.File;
import java.io.IOException;
import java.io.FileOutputStream;
import java.util.*;


import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import com.woosj9060.aiquizpic.auth.UserRepository;
import com.woosj9060.aiquizpic.auth.Users;
import com.woosj9060.aiquizpic.util.ImageUtils;

@Service
public class QuizService {
    private final QuizRepository quizRepository;
    private final UserRepository userRepository;
    private final RestTemplate restTemplate;

    private static final String API_KEY = System.getenv("GOOGLE_API_KEY");
    private static final String genURL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent?key=" + API_KEY;
    private static final String valURL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + API_KEY;
    public QuizService(QuizRepository quizRepository, UserRepository userRepository) {
        this.quizRepository = quizRepository;
        this.userRepository = userRepository;
        this.restTemplate = new RestTemplate();
    }

    public void saveQuiz(Quiz quiz, Users user) {
        quiz.setCreator(user);
        quizRepository.save(quiz);
    }

    public List<Quiz> getValidatedQuizzes() {
        try {
            // 1. 전체 데이터 조회 테스트
            List<Quiz> allQuizzes = quizRepository.findAll();
            System.out.println(">>> 전체 quiz 개수: " + allQuizzes.size());
            
            // 2. validate=true 조회 테스트
            List<Quiz> result = quizRepository.findByValidateTrue();
            System.out.println(">>> validate==true quiz 개수: " + result.size());
            
            return result;
        } catch (Exception e) {
            System.out.println(">>> 에러: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

     public boolean hasUnvalidatedQuizzes() {
        // validate 필드가 0인 퀴즈가 최소 하나 존재하는지 확인
        return quizRepository.existsByValidateFalse();
    }

    public List<Quiz> getUnvalidatedQuizzes(Users user) {
        return quizRepository.findByValidateFalseAndCreator(user);
    }

    public Quiz getQuizById(Integer id){
        
        Quiz quiz = quizRepository.findById(id).orElseThrow(() -> new RuntimeException("해당 퀴즈 없음"));

        if (!quiz.getValidate()) {
            return null; //비검증 퀴즈
        }

        return quiz;
    }

        public String getImagePathById(Integer id) {
        return quizRepository.findById(id)
                .map(Quiz::getImg) // Quiz 엔티티에서 img 필드 가져오기
                .orElse(null);
    }

    public Quiz createQuizWithImage(byte[] imageBytes, String word1, String word2, String word3, Users user) throws IOException {
        // Step 1: 먼저 빈 퀴즈 저장 (ID 확보)
        Quiz quiz = new Quiz();
        quiz.setWords(word1, word2, word3);
        saveQuiz(quiz, user);

        // Step 2: 이미지 저장
        String imageName = "image_" + quiz.getId() + ".png";
        // Step 3: DB의 img 필드 업데이트
        quiz.setImg("/images/" + imageName); // 정적 리소스 경로
        saveQuiz(quiz, user);
        return quiz;
    }

    public int markingQuiz(int id, String[] receivedWords, int userId){ 
        int matchCount = calculateScore(id, receivedWords);
        if (matchCount == 3){
            Users user = userRepository.findById(userId).orElseThrow();
            Quiz quiz = quizRepository.findById(id).orElseThrow();

            user.getSolvedQuizzes().add(quiz);
            userRepository.save(user);
        }
        return matchCount;
    }
    public int markingQuiz(int id, String[] receivedWords){
        int matchCount = calculateScore(id, receivedWords);
        return matchCount;
    }
    private int calculateScore(Integer id, String [] receivedWords){
        String[] correctWords = quizRepository.findById(id) //정답 단어
                    .map(Quiz::getWords)
                    .orElseThrow(() -> new RuntimeException("퀴즈를 찾을 수 없습니다."));

        Set<String> receivedSet = new HashSet<>();
        for (String word : receivedWords) {
            receivedSet.add(word.trim().toLowerCase()); // 공백 제거 및 소문자 통일
        }

        int matchCount = 0;
        for (String correct : correctWords) {
            if (receivedSet.contains(correct.trim().toLowerCase())) {
                matchCount++;
            }
        }
        return matchCount;
    }

    public boolean deleteQuizById(Integer id, Users user) {
        return quizRepository.findById(id).map(quiz -> {
            if(quiz.getCreator().getId() == user.getId() || user.getId() == 0){ //0은 관리자 유저
                quizRepository.delete(quiz);
                deleteQuizImage(quiz.getImg()); // 이미지 파일도 삭제
                return true;
            }
            else{
                return false;
            }
        }).orElse(false);
    }

    private void deleteQuizImage(String imgPath) {
        try {
            String fullPath = "./images" + imgPath;
            File file = new File(fullPath);
            if (file.exists()) {
                file.delete();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public ResponseEntity<?> generateQuiz(WordsRequest requestWords, Users user) {
        if (API_KEY == null || API_KEY.isBlank()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("GOOGLE_API_KEY 환경변수가 설정되어 있지 않습니다.");
        }

        try {
            String[] words = requestWords.getWords();
            if (words.length != 3) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("단어 개수가 일치하지 않습니다.");
            }

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> textPart = Map.of("text", "Create a photo that mixes the following keywords." + requestWords.getCombinedWords() + " People should be able to guess the keywords when they look at the photo.");
            Map<String, Object> content = Map.of("parts", List.of(textPart));
            Map<String, Object> generationConfig = Map.of("responseModalities", List.of("TEXT", "IMAGE"));
            Map<String, Object> requestBody = Map.of(
                    "contents", List.of(content),
                    "generationConfig", generationConfig
            );

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
            ResponseEntity<String> genResponse = restTemplate.postForEntity(genURL, request, String.class);

            ObjectMapper mapper = new ObjectMapper();
            String prettyRequest = mapper.writerWithDefaultPrettyPrinter().writeValueAsString(requestBody);
            System.out.println("=== Request Body ===");
            System.out.println(prettyRequest);

            // 응답 로그 출력
            System.out.println("=== Raw Response Body ===");
            System.out.println(genResponse.getBody());

            // JSON 파싱
            JsonNode root = mapper.readTree(genResponse.getBody());
            JsonNode dataNode = root.findValue("data");

            if (dataNode != null) {
                byte[] imageBytes = Base64.getDecoder().decode(dataNode.asText());

                Quiz createdQuiz = createQuizWithImage(imageBytes, words[0], words[1], words[2], user);

                try (FileOutputStream fos = new FileOutputStream("./images/image_" + createdQuiz.getId() + ".png")) {
                    fos.write(imageBytes);
                }

                return ResponseEntity.ok(createdQuiz);
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("이미지 생성 실패: 데이터가 비어 있습니다.");
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("퀴즈 생성 중 오류 발생: " + e.getMessage());
        }
    }

    public ResponseEntity<?> validateQuiz(int quizId, Users user) {
    try {
        Quiz quiz = quizRepository.findById(quizId).orElseThrow();
        String imagePath = "./images/image_" + quiz.getId() + ".png";
        String base64Image = ImageUtils.convertToBase64Compressed(imagePath, 128, 128, 0.6f);
        System.out.println("이미지 텍스트파일" + base64Image);
        String prompt = buildPrompt(quiz);

        JsonNode geminiResponse = callGemini(prompt, base64Image, "image/jpeg");
        System.out.println(geminiResponse);
        if (geminiResponse == null) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "Gemini 응답 파싱 실패1 (내부 오류)"));
        }

                List<String> failedWords = parseGeminiResponse(geminiResponse);
                if (failedWords == null) {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                         .body(Map.of("message", "Gemini 응답 파싱 실패2 (내부 오류)"));
                }

                if (!failedWords.isEmpty()) {
                    deleteQuizById(quiz.getId(), user);
                    return ResponseEntity.ok(Map.of(
                        "result", 0,
                        "message", "이미지와 관련성이 낮은 단어 존재",
                        "failedWords", failedWords,
                        "imageBase64", base64Image
                    ));
                }

        quiz.setValidate(true);
        quizRepository.save(quiz);
        return ResponseEntity.ok(Map.of(
                "result", 2,
                "message", "퀴즈 검증 성공",
                "quiz", quiz
        ));
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("검증 실패: " + e.getMessage());
    }
}
    private String buildPrompt(Quiz quiz) {
        return String.format(
                "Evaluate how well each of the following Korean words matches the image. " +
                "Give each word a score from 0 to 10. Respond ONLY in JSON with format: " +
                "{\"word1\": 점수, \"word2\": 점수, \"word3\": 점수}. " +
                "Words: %s, %s, %s.",
                quiz.getWord1(), quiz.getWord2(), quiz.getWord3()
        );
    }

    private JsonNode callGemini(String textPrompt, String base64Image, String mimeType) { // 반환 타입을 JsonNode로 유지
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // parts 리스트를 curl 예제와 동일한 JSON 구조로 구성:
            // "inline_data"가 "image" 필드 없이 "parts" 바로 아래에 옵니다.
            List<Map<String, Object>> parts = List.of(
                Map.of("inline_data", Map.of(    // <--- "image" 필드를 "inline_data"로 직접 변경
                    "mime_type", mimeType, 
                    "data", base64Image
                )),
                Map.of("text", textPrompt) // 텍스트 파트
            );

            Map<String, Object> body = Map.of(
                "contents", List.of(
                    Map.of("parts", parts) // 구성된 parts 리스트 사용
                )
            );
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

            System.out.println("Gemini API 호출 시도 중...");
            System.out.println("요청 URL: " + valURL);
            // 디버깅을 위해 실제 전송될 JSON 본문 출력 (생략 가능, 너무 길 수 있음)
            // System.out.println("요청 본문 (JSON): " + new ObjectMapper().writeValueAsString(body));

            ResponseEntity<String> response = restTemplate.postForEntity(valURL, request, String.class);
            
            System.out.println("Gemini 응답 상태 코드: " + response.getStatusCode());
            System.out.println("Gemini의 응답 본문: " + response.getBody());

            if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
                System.err.println("Gemini API 응답 실패 또는 본문 없음: " + response.getStatusCode());
                return null;
            }

            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response.getBody());
            JsonNode jsonPart = root.findValue("text"); // Gemini 응답에서 "text" 필드 추출

            if (jsonPart != null && jsonPart.isTextual()) {
                return mapper.readTree(jsonPart.asText()); // "text" 필드 안의 JSON 문자열을 다시 파싱
            }
            return null;

        } catch (Exception e) {
            System.err.println("Gemini API 호출 중 오류 발생: " + e.getClass().getName());
            System.err.println("오류 메시지: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }

    private List<String> parseGeminiResponse(JsonNode geminiResponse) {
        if (geminiResponse == null || !geminiResponse.isObject()) {
            System.err.println("파싱할 JsonNode가 유효한 객체가 아닙니다: " + (geminiResponse == null ? "null" : geminiResponse.getNodeType()));
            return null;
        }
        try {
            List<String> failedWords = new ArrayList<>();
            // JsonNode의 필드들을 순회하며 각 단어와 점수를 가져옵니다.
            geminiResponse.fields().forEachRemaining(entry -> {
                String word = entry.getKey(); // "word1", "word2" 등 단어 이름
                int score = entry.getValue().asInt(); // 해당 단어의 점수

                if (score <= 7) { // 점수가 7 이하면 실패한 단어로 간주
                    failedWords.add(word);
                }
            });

            return failedWords;

        } catch (Exception e) {
            // JsonNode를 직접 받아서 처리하므로 JsonProcessingException은 덜 발생하지만,
            // 예상치 못한 구조이거나 값이 숫자가 아닐 경우를 대비하여 일반 Exception 처리
            System.err.println("Gemini 응답 JsonNode 파싱 중 오류 발생: " + e.getClass().getName());
            System.err.println("오류 메시지: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }
}

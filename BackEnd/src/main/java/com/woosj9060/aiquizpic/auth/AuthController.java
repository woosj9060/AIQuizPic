package com.woosj9060.aiquizpic.auth;

import java.util.Collections;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.woosj9060.aiquizpic.security.JwtUtil;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(UserRepository userRepository,PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }
    @GetMapping("/username")
    public ResponseEntity<String> getUsername(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("인증 실패");
        }

        MyUserDetails userDetails = (MyUserDetails) authentication.getPrincipal();
        String username = userDetails.getUsername();

        return ResponseEntity.ok(username);
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Users user = userRepository.findByUsername(request.getUsername())
                .orElse(null);
        if (user == null) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("사용자 없음");
        }
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("비밀번호 틀림");
        }

        MyUserDetails userDetails = new MyUserDetails(user);
        String token = jwtUtil.generateToken(userDetails);
        return ResponseEntity.ok(Collections.singletonMap("token", token));
    }
    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody SignupRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("이미 존재하는 사용자입니다.");
        }

        // 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(request.getPassword());
        Users newUser = new Users(request.getUsername(), encodedPassword);
        userRepository.save(newUser);
        return ResponseEntity.ok("회원가입 성공");
    }
}
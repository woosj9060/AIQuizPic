package com.woosj9060.aiquizpic.auth;

import org.springframework.security.crypto.password.PasswordEncoder;

public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public void signup(String username, String rawPassword) {
        String encodedPassword = passwordEncoder.encode(rawPassword);
        userRepository.save(new Users(username, encodedPassword));
    }
}
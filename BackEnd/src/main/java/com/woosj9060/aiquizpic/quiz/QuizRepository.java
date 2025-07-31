package com.woosj9060.aiquizpic.quiz;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.woosj9060.aiquizpic.auth.Users;


public interface QuizRepository extends JpaRepository<Quiz, Integer> {
    List<Quiz> findByValidateTrue();
    List<Quiz> findByValidateFalseAndCreator(Users user);
    Boolean existsByValidateFalse();
}
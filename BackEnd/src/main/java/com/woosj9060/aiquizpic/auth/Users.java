package com.woosj9060.aiquizpic.auth;

import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.woosj9060.aiquizpic.quiz.Quiz;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;

@Entity
public class Users {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String username;

    @JsonIgnore
    private String password; // 반드시 암호화해서 저장

    @Column(nullable = false)
    private boolean isAdmin = false;

    @JsonIgnore
    @OneToMany(mappedBy = "creator")
    private Set<Quiz> createdQuizzes = new HashSet<>();

    

    public Users() {}
    public Users(String username, String password) {
        this.username = username;
        this.password = password;
    }
    
    @JsonIgnore
    @ManyToMany
    @JoinTable(
        name = "solved_quiz",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "quiz_id")
    )
    private Set<Quiz> solvedQuizzes = new HashSet<>();
    

    public Set<Quiz> getSolvedQuizzes() {
        return solvedQuizzes;
    }

    public int getId(){
        return this.id;
    }
    public String getUsername() {
        return this.username;
    }
    public String getPassword() {
        return this.password;
    }
    public Set<Quiz> getCreatedQuizzes() {
        return createdQuizzes;
    }
    public void setSolvedQuizzes(Set<Quiz> solvedQuizzes) {
        this.solvedQuizzes = solvedQuizzes;
    }
    public void setId(int id){
        this.id = id;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    public void setCreatedQuizzes(Set<Quiz> createdQuizzes) {
        this.createdQuizzes = createdQuizzes;
    }
}

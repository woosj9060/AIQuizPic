package com.woosj9060.aiquizpic.quiz;

import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.woosj9060.aiquizpic.auth.Users;

import jakarta.persistence.*;

@Entity
@Table(name = "quiz")
public class Quiz {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String url;
    private String img;
    private String word_1;
    private String word_2;
    private String word_3;
    private boolean validate = false;
    @ManyToMany(mappedBy = "solvedQuizzes")
    private Set<Users> usersWhoSolved = new HashSet<>();
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "creator", nullable = false)
    @JsonIgnore
    private Users creator;

    // 기본 생성자
    public Quiz() {}
    
    // 생성자, 게터, 세터
    public Quiz(Integer id, String img, String url, String word_1, String word_2, String word_3, Users creator) {
        this.img = img;
        this.url = url;
        this.word_1 = word_1;
        this.word_2 = word_2;
        this.word_3 = word_3;
        this.creator = creator;
    }

    public Integer getId() {
        return id;
    }

    public String getImg() {
        return img;
    }

    public String getUrl(){
        return url;
    }

    public String getWord1() {
        return word_1;
    }    

    public String getWord2() {
        return word_2;
    }

    public String getWord3() {
        return word_3;
    }

    public Boolean getValidate() {
        return validate;
    }
    
    public String[] getWords() {
        String[] words = {word_1, word_2, word_3};
        return words;
    }

    public Users getCreator() {
        return creator;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setImg(String img) {
        this.img = img;
    }

    public void setUrl(String url) {
        this.url = url;
    }
    public void setWords(String word_1, String word_2, String word_3){
        this.word_1 = word_1;
        this.word_2 = word_2;
        this.word_3 = word_3;
    }

    public void setValidate(boolean validate) {
        this.validate = validate;
    }
    
    public void setCreator(Users creator) {
        this.creator = creator;
    }
}
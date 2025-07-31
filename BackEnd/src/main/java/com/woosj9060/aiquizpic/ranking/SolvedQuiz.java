package com.woosj9060.aiquizpic.ranking;

public class SolvedQuiz {
    private int id;
    private String img;

    public SolvedQuiz(int id, String img) {
        this.id = id;
        this.img = img;
    }

    public int getId(){
        return id;
    }

    public String getImg(){
        return img;
    }

    public void setId(int id){
        this.id = id;
    }

    public void setImg(String img){
        this.img = img;
    }
}

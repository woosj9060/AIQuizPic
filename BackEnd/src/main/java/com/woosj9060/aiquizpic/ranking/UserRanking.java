package com.woosj9060.aiquizpic.ranking;

public class UserRanking {
    private String username;
    private int solvedCount;

    public UserRanking(String username, int solvedCount) {
        this.username = username;
        this.solvedCount = solvedCount;
    }

    public String getUsername(){
        return username;
    }

    public int getSolvedCount(){
        return solvedCount;
    }

    public void setUsername(String username){
        this.username = username;
    }

    public void setSolvedCount(int solvedCount){
        this.solvedCount = solvedCount;
    }
}

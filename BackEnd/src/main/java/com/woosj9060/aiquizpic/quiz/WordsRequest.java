package com.woosj9060.aiquizpic.quiz;

import com.fasterxml.jackson.annotation.JsonProperty;

public class WordsRequest {
    @JsonProperty("word1")
    private String word1;
    @JsonProperty("word2")
    private String word2;
    @JsonProperty("word3")
    private String word3;

    private String combinedWords;
    private String[] words;
    public WordsRequest() {}

    public WordsRequest(String word1, String word2, String word3) {
        this.word1 = word1;
        this.word2 = word2;
        this.word3 = word3;
        this.combinedWords = String.join(", ", word1, word2, word3);
        this.words = new String[] {word1, word2, word3};
    }

    public String getCombinedWords() {
        return combinedWords;
    }
    public String getWord1(){
        return word1;
    }
    public String getWord2(){
        return word2;
    }
    public String getWord3(){
        return word3;
    }
    public String[] getWords(){
        return words;
    }

public void setWord1(String word1) {
    this.word1 = word1;
    updateDerivedFields();
}

public void setWord2(String word2) {
    this.word2 = word2;
    updateDerivedFields();
}

public void setWord3(String word3) {
    this.word3 = word3;
    updateDerivedFields();
}

private void updateDerivedFields() {
    if (word1 != null && word2 != null && word3 != null) {
        this.combinedWords = String.join(", ", word1, word2, word3);
        this.words = new String[]{word1, word2, word3};
    }
}

}
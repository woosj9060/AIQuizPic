package com.woosj9060.aiquizpic.quiz;

public class QuizMarking {
    private String[] words = new String[3];
    private boolean[] correct = new boolean[3];

    public QuizMarking(String word1, String word2, String word3) {
        this.words[0] = word1;
        this.words[1] = word2;
        this.words[2] = word3;
    }
    public QuizMarking(String[] words) {
        this.words[0] = words[0];
        this.words[1] = words[1];
        this.words[2] = words[2];
    }

    // words 배열의 getter/setter
    public String[] getWords() {
        return words;
    }

    public void setWords(String[] words) {
        this.words = words;
    }

    // 개별 단어 getter/setter
    public String getWord1() {
        return words[0];
    }

    public void setWord1(String word1) {
        this.words[0] = word1;
    }

    public String getWord2() {
        return words[1];
    }

    public void setWord2(String word2) {
        this.words[1] = word2;
    }

    public String getWord3() {
        return words[2];
    }

    public void setWord3(String word3) {
        this.words[2] = word3;
    }

    // correct 배열의 getter/setter
    public boolean[] getCorrect() {
        return correct;
    }

    public void setCorrect(boolean[] correct) {
        this.correct = correct;
    }

    // 개별 정답 여부 getter/setter
    public boolean isCorrect1() {
        return correct[0];
    }

    public void setCorrect1(boolean correct1) {
        this.correct[0] = correct1;
    }

    public boolean isCorrect2() {
        return correct[1];
    }

    public void setCorrect2(boolean correct2) {
        this.correct[1] = correct2;
    }

    public boolean isCorrect3() {
        return correct[2];
    }

    public void setCorrect3(boolean correct3) {
        this.correct[2] = correct3;
    }

    // 유틸리티 메서드들
    public String getWord(int index) {
        if (index >= 0 && index < words.length) {
            return words[index];
        }
        return null;
    }

    public void setWord(int index, String word) {
        if (index >= 0 && index < words.length) {
            this.words[index] = word;
        }
    }

    public boolean isCorrect(int index) {
        if (index >= 0 && index < correct.length) {
            return correct[index];
        }
        return false;
    }

    public void setCorrect(int index, boolean isCorrect) {
        if (index >= 0 && index < correct.length) {
            this.correct[index] = isCorrect;
        }
    }

    // 전체 점수 계산 메서드
    public int getScore() {
        int score = 0;
        for (boolean isCorrect : correct) {
            if (isCorrect) {
                score++;
            }
        }
        return score;
    }

    // 정답률 계산 메서드 (0.0 ~ 1.0)
    public double getAccuracy() {
        return (double) getScore() / words.length;
    }

    // 모든 답이 정답인지 확인
    public boolean isAllCorrect() {
        for (boolean isCorrect : correct) {
            if (!isCorrect) {
                return false;
            }
        }
        return true;
    }

    @Override
    public String toString() {
        return "QuizMarking{" +
                "words=[" + String.join(", ", words) + "]" +
                ", correct=[" + correct[0] + ", " + correct[1] + ", " + correct[2] + "]" +
                ", score=" + getScore() +
                "}";
    }
}
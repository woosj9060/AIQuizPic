package com.woosj9060.aiquizpic.auth;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.woosj9060.aiquizpic.ranking.*;

public interface UserRepository extends JpaRepository<Users, Integer> {
     Optional<Users> findByUsername(String username);
     @Query("SELECT new com.woosj9060.aiquizpic.ranking.UserRanking(u.username, SIZE(u.solvedQuizzes)) FROM Users u ORDER BY SIZE(u.solvedQuizzes) DESC")
     Page<UserRanking> findTopUserRankings(Pageable pageable);
}
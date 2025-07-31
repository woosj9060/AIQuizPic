package com.woosj9060.aiquizpic;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class HelloController {
    private static final Logger log = LoggerFactory.getLogger(HelloController.class);
    @GetMapping("/hello")
    public String hello() {
        log.info("Hello 요청 들어옴");
        log.debug("디버그용 로그입니다.");
        log.warn("경고 메시지입니다.");
        log.error("에러 발생!");
        return "Spring is working!";
    }
}
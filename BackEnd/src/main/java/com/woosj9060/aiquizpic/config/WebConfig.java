package com.woosj9060.aiquizpic.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:\\d+")
                .allowedMethods("*")
                .allowedHeaders("*")
                .allowCredentials(true);
     }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // /image/** 패턴으로 요청이 오면 classpath:/static/image/ 에서 파일을 찾음
        registry.addResourceHandler("/images/**")
                .addResourceLocations("file:/app/images/")
                .setCachePeriod(3600); // 1시간 캐시
        
    }
}
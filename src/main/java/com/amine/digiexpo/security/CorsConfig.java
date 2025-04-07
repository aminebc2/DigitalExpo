package com.amine.digiexpo.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer webMvcConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedMethods("GET", "POST", "PUT", "DELETE")
                        .allowedOrigins("*") // Vous pouvez restreindre aux domaines spécifiques ici
                        .allowedHeaders("*") // Permet toutes les en-têtes
                        .allowCredentials(true); // Si vous devez accepter les cookies/credentials
            }
        };
    }
}

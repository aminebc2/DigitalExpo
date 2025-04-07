package com.amine.digiexpo.security;

import com.amine.digiexpo.service.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private CustomUserDetailsService customUserDetailsService;
    @Autowired
    private JWTAuthFilter jwtAuthFilter;

    // Configuration de la chaîne de sécurité
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity.csrf(AbstractHttpConfigurer::disable)  // Désactive la protection CSRF
                .cors(Customizer.withDefaults())  // Active la gestion CORS
                .authorizeHttpRequests(request -> request
                        .requestMatchers("/auth/**", "/associations/**", "/aboutus/**","/accueil/**").permitAll()  // Permet l'accès aux endpoints d'authentification et aux ressources publiques
                        .anyRequest().authenticated())  // Toute autre requête nécessite une authentification
                .sessionManagement(manager -> manager.sessionCreationPolicy(SessionCreationPolicy.STATELESS))  // Utilise un modèle stateless (sans session)
                .authenticationProvider(authenticationProvider())  // Fournit un provider d'authentification
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);  // Ajoute le filtre JWT avant le filtre d'authentification classique

        return httpSecurity.build();
    }

    // Configuration du provider d'authentification
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider daoAuthenticationProvider = new DaoAuthenticationProvider();
        daoAuthenticationProvider.setUserDetailsService(customUserDetailsService);  // Service qui charge les utilisateurs
        daoAuthenticationProvider.setPasswordEncoder(passwordEncoder());  // Encodeur de mots de passe
        return daoAuthenticationProvider;
    }

    // Configuration de l'encodeur de mot de passe
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();  // Utilise l'algorithme BCrypt pour l'encodeur de mot de passe
    }

    // Fourniture de l'AuthenticationManager
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();  // Récupère le gestionnaire d'authentification
    }
}

package com.amine.digiexpo.security;

import com.amine.digiexpo.service.CustomUserDetailsService;
import com.amine.digiexpo.utils.JWTUtils;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JWTAuthFilter extends OncePerRequestFilter {

    @Autowired
    private JWTUtils jwtUtils;

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        final String jwtToken;
        final String username;

        // Si l'en-tête Authorization est vide ou nul, on continue le filtre
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        jwtToken = authHeader.substring(7);  // Extrait le token sans "Bearer "
        username = jwtUtils.extractUsername(jwtToken);  // Extrait le nom d'utilisateur du token

        // Si l'utilisateur est authentifié mais que le contexte de sécurité est vide
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = customUserDetailsService.loadUserByUsername(username);

            // Si le token est valide, on crée une nouvelle authentification
            if (jwtUtils.isValidToken(jwtToken, userDetails)) {
                SecurityContext securityContext = SecurityContextHolder.createEmptyContext();

                // Crée un token d'authentification
                UsernamePasswordAuthenticationToken authenticationToken =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

                // Ajoute les détails de l'authentification à la requête
                authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // Place le token d'authentification dans le contexte de sécurité
                securityContext.setAuthentication(authenticationToken);
                SecurityContextHolder.setContext(securityContext);
            }
        }

        // Continue le filtrage de la requête
        filterChain.doFilter(request, response);
    }
}

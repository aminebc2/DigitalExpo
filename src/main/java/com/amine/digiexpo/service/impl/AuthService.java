package com.amine.digiexpo.service.impl;

import com.amine.digiexpo.DTO.LoginRequest;
import com.amine.digiexpo.DTO.RegisterRequest;
import com.amine.digiexpo.DTO.UserDTO;
import com.amine.digiexpo.Repository.UserRepository;
import com.amine.digiexpo.entity.Admin;
import com.amine.digiexpo.entity.Association;
import com.amine.digiexpo.entity.User;
import com.amine.digiexpo.entity.Volunteer;
import com.amine.digiexpo.service.interfac.IAuthService;
import com.amine.digiexpo.utils.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService implements IAuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    @Autowired
    public AuthService(UserRepository userRepository,
                           PasswordEncoder passwordEncoder,
                           AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
    }

    @Override
    public UserDTO login(LoginRequest loginRequest) {
        // Authentification avec Spring Security
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(), // ou loginRequest.getEmail() selon ta logique
                        loginRequest.getPassword()
                )
        );

        // Définir le contexte de sécurité
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Récupérer l'utilisateur authentifié
        User user = userRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Mapper l'entité vers DTO avec Utils
        return Utils.mapUserEntityToUserDTO(user);
    }

    @Override
    public UserDTO register(RegisterRequest registerRequest) {
        // Vérifier si l'utilisateur existe déjà
        if (userRepository.findByUsername(registerRequest.getUsername()).isPresent() ||
                userRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
            throw new RuntimeException("Username or email already exists");
        }

        // Créer l'utilisateur selon le rôle
        User user;
        switch (registerRequest.getRole()) {
            case ADMIN:
                user = new Admin();
                break;
            case ASSOCIATION:
                user = new Association();
                break;
            case BENEVOLE: // ou VOLUNTEER selon ton choix final
                user = new Volunteer();
                break;
            default:
                throw new IllegalArgumentException("Invalid role");
        }

        // Remplir les champs communs
        user.setUsername(registerRequest.getUsername());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setRole(registerRequest.getRole());

        // Sauvegarder l'utilisateur
        User savedUser = userRepository.save(user);

        // Mapper l'entité vers DTO avec Utils
        return Utils.mapUserEntityToUserDTO(savedUser);
    }
}
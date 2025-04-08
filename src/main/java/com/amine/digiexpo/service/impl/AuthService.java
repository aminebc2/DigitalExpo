package com.amine.digiexpo.service.impl;

import com.amine.digiexpo.DTO.LoginRequest;
import com.amine.digiexpo.DTO.RegisterRequest;
import com.amine.digiexpo.DTO.Response;
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
    public Response login(LoginRequest loginRequest) {
        try {
            // Authentication with Spring Security
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(), // or loginRequest.getEmail() depending on your logic
                            loginRequest.getPassword()
                    )
            );

            // Set security context
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Retrieve authenticated user
            User user = userRepository.findByUsernameOrEmail(loginRequest.getUsername(), loginRequest.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));


            // Map entity to DTO with Utils
            UserDTO userDTO = Utils.mapUserToDTO(user);

            // Return successful response
            return new Response(200, "Login successful", userDTO);
        } catch (Exception e) {
            // Handle exceptions and return error response
            return new Response(500, "Authentication failed: " + e.getMessage(), null);
        }
    }

    @Override
    public Response register(RegisterRequest registerRequest) {
        try {
            // Check if the user already exists
            if (userRepository.findByUsername(registerRequest.getUsername()).isPresent() ||
                    userRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
                return new Response(400, "Username or email already exists", null);
            }

            // Create user based on role
            User user;
            switch (registerRequest.getRole()) {
                case ADMIN:
                    user = new Admin();
                    break;
                case ASSOCIATION:
                    user = new Association();
                    break;
                case BENEVOLE: // or VOLUNTEER depending on your choice
                    user = new Volunteer();
                    break;
                default:
                    return new Response(400, "Invalid role", null);
            }

            // Fill common fields
            user.setUsername(registerRequest.getUsername());
            user.setEmail(registerRequest.getEmail());
            user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
            user.setRole(registerRequest.getRole());

            // Save the user
            User savedUser = userRepository.save(user);

            // Map entity to DTO
            UserDTO userDTO = Utils.mapUserToDTO(savedUser);

            // Return successful response
            return new Response(201, "Registration successful", userDTO);
        } catch (Exception e) {
            // Handle exceptions and return error response
            return new Response(500, "Registration failed: " + e.getMessage(), null);
        }
    }
}

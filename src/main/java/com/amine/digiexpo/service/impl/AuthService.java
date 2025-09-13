package com.amine.digiexpo.service.impl;

import com.amine.digiexpo.DTO.*;
import com.amine.digiexpo.Repository.UserRepository;
import com.amine.digiexpo.entity.Admin;
import com.amine.digiexpo.entity.Association;
import com.amine.digiexpo.entity.User;
import com.amine.digiexpo.entity.Volunteer;
import com.amine.digiexpo.enumeration.Role;
import com.amine.digiexpo.service.interfac.IAuthService;
import com.amine.digiexpo.utils.JWTUtils;
import com.amine.digiexpo.utils.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService implements IAuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    @Autowired
    private JWTUtils jwtService;

    @Autowired
    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager, JWTUtils jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @Override
    public Response login(LoginRequest loginRequest) {
        try {
            // Authenticate using Spring Security
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            User user = userRepository.findByUsernameOrEmail(loginRequest.getUsername(), loginRequest.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            String token = jwtService.generateToken(user); // Generate JWT

            UserDTO userDTO = Utils.mapUserToDTO(user);

            // Return both token and user info
            Map<String, Object> data = new HashMap<>();
            data.put("token", token);
            data.put("user", userDTO);

            return new Response(200, "Login successful", data);
        } catch (Exception e) {
            return new Response(500, "Email or Password not correct", null);
        }
    }

    @Override
    public Response registerAdmin(AdminRegisterRequest registerRequest) {
        try {
            // Check if the user already exists
            if (userRepository.findByUsername(registerRequest.getUsername()).isPresent() ||
                    userRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
                return new Response(400, "Username or email already exists", null);
            }

            Admin admin = new Admin();
            admin.setUsername(registerRequest.getUsername());
            admin.setEmail(registerRequest.getEmail());
            admin.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
            admin.setRole(Role.ADMIN);
            admin.setFullName(registerRequest.getFullName());
            admin.setPhoneNumber(registerRequest.getPhoneNumber());


            User savedUser = userRepository.save(admin);
            UserDTO userDTO = Utils.mapUserToDTO(savedUser);

            return new Response(201, "Admin registration successful", userDTO);
        } catch (Exception e) {
            return new Response(500, "Registration failed: " + e.getMessage(), null);
        }
    }

    @Override
    public Response registerAssociation(AssociationRegisterRequest registerRequest) {
        try {
            // Check if the user already exists
            if (userRepository.findByUsername(registerRequest.getUsername()).isPresent() ||
                    userRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
                return new Response(400, "Username or email already exists", null);
            }

            Association association = new Association();
            association.setUsername(registerRequest.getUsername());
            association.setEmail(registerRequest.getEmail());
            association.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
            association.setRole(Role.ASSOCIATION);
            association.setName(registerRequest.getName());
            association.setVille(registerRequest.getVille());
            association.setResponsableName(registerRequest.getResponsableName());
            association.setResponsablePhone(registerRequest.getResponsablePhone());

            User savedUser = userRepository.save(association);
            UserDTO userDTO = Utils.mapUserToDTO(savedUser);

            return new Response(201, "Association registration successful", userDTO);
        } catch (Exception e) {
            return new Response(500, "Registration failed: " + e.getMessage(), null);
        }
    }

    @Override
    public Response registerVolunteer(VolunteerRegisterRequest registerRequest) {
        try {
            // Check if the user already exists
            if (userRepository.findByUsername(registerRequest.getUsername()).isPresent() ||
                    userRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
                return new Response(400, "Username or email already exists", null);
            }

            Volunteer volunteer = new Volunteer();
            volunteer.setUsername(registerRequest.getUsername());
            volunteer.setEmail(registerRequest.getEmail());
            volunteer.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
            volunteer.setRole(Role.BENEVOLE);
            volunteer.setPhoneNumber(registerRequest.getPhoneNumber());
            volunteer.setFullName(registerRequest.getFullName());
            volunteer.setAvailableDays(registerRequest.getAvailableDays());

            User savedUser = userRepository.save(volunteer);
            UserDTO userDTO = Utils.mapUserToDTO(savedUser);

            return new Response(201, "Volunteer registration successful", userDTO);
        } catch (Exception e) {
            return new Response(500, "Registration failed: " + e.getMessage(), null);
        }
    }
}

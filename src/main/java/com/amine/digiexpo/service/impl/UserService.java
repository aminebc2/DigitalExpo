package com.amine.digiexpo.service.impl;

import com.amine.digiexpo.DTO.LoginRequest;
import com.amine.digiexpo.DTO.RegisterRequest;
import com.amine.digiexpo.DTO.Response;
import com.amine.digiexpo.DTO.UserDTO;
import com.amine.digiexpo.Repository.UserRepository;
import com.amine.digiexpo.entity.User;
import com.amine.digiexpo.service.interfac.IUserService;
import com.amine.digiexpo.utils.JWTUtils;
import com.amine.digiexpo.utils.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService implements IUserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JWTUtils jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Override
    public Response register(RegisterRequest registerRequest) {
        // Check if username already exists
        if (userRepository.findByUsername(registerRequest.getUsername()).isPresent()) {
            return new Response(HttpStatus.BAD_REQUEST.value(),"Username already exists",null);
        }

        // Check if email already exists
        if (userRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
            return new Response(HttpStatus.BAD_REQUEST.value(),"Email already exists",null);
        }

        // This should be implemented in specific service implementations
        // for Admin, Association, and Volunteer
        return new Response(HttpStatus.BAD_REQUEST.value(),"Direct registration not supported. Use specific registration endpoints.",null);
    }

    @Override
    public Response login(LoginRequest loginRequest) {

        try {
            // Authenticate the user
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername() != null ? loginRequest.getUsername() : loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );

            // Find the user by username or email
            User user;
            if (loginRequest.getUsername() != null) {
                user = userRepository.findByUsername(loginRequest.getUsername())
                        .orElseThrow(() -> new RuntimeException("User not found"));
            } else {
                user = userRepository.findByEmail(loginRequest.getEmail())
                        .orElseThrow(() -> new RuntimeException("User not found"));
            }

            // Generate JWT token
            String token = jwtService.generateToken(user);

            return new Response(HttpStatus.OK.value(), "Login successful",token,user.getRole(),Utils.mapUserToDTO(user));

        } catch (Exception e) {
            return new Response(401, "Invalid credentials", null);
        }
    }

    @Override
    public Response getAllUsers() {
        try {
            List<User> users = userRepository.findAll();
            List<UserDTO> userDTOs = Utils.mapUserListToDTOList(users);

            return new Response(200, "Users retrieved successfully", userDTOs);
        } catch (Exception e) {
            return new Response(500, "Error retrieving users", null);
        }
    }

    @Override
    public Response getUserById(Long id) {
        try {
            User user = userRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            UserDTO userDTO = Utils.mapUserToDTO(user);
            return new Response(200, "User retrieved successfully", userDTO);
        } catch (RuntimeException e) {
            return new Response(404, e.getMessage(), null);
        }
    }

    @Override
    public Response updateUser(Long id, UserDTO userDTO) {
        return new Response(400, "Direct update not supported. Use specific update endpoints.", null);
    }

    @Override
    public Response deleteUser(Long id) {
        try {
            if (!userRepository.existsById(id)) {
                throw new RuntimeException("User not found");
            }

            userRepository.deleteById(id);
            return new Response(200, "User deleted successfully", null);
        } catch (RuntimeException e) {
            return new Response(404, e.getMessage(), null);
        }
    }

    @Override
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}

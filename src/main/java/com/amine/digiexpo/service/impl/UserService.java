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
        Response response = new Response();

        // Check if username already exists
        if (userRepository.findByUsername(registerRequest.getUsername()).isPresent()) {
            response.setStatusCode(HttpStatus.BAD_REQUEST.value());
            response.setMessage("Username already exists");
            return response;
        }

        // Check if email already exists
        if (userRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
            response.setStatusCode(HttpStatus.BAD_REQUEST.value());
            response.setMessage("Email already exists");
            return response;
        }

        // This should be implemented in specific service implementations
        // for Admin, Association, and Volunteer
        response.setStatusCode(HttpStatus.BAD_REQUEST.value());
        response.setMessage("Direct registration not supported. Use specific registration endpoints.");
        return response;
    }

    @Override
    public Response login(LoginRequest loginRequest) {
        Response response = new Response();

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

            response.setStatusCode(HttpStatus.OK.value());
            response.setMessage("Login successful");
            response.setToken(token);
            response.setRole(user.getRole().name());
            response.setUser(Utils.mapUserEntityToUserDTO(user));

            return response;
        } catch (Exception e) {
            response.setStatusCode(HttpStatus.UNAUTHORIZED.value());
            response.setMessage("Invalid credentials");
            return response;
        }
    }

    @Override
    public Response getAllUsers() {
        Response response = new Response();
        List<User> users = userRepository.findAll();

        response.setStatusCode(HttpStatus.OK.value());
        response.setMessage("Users retrieved successfully");
        response.setUserList(Utils.mapUserListEntityToUserListDTO(users));

        return response;
    }

    @Override
    public Response getUserById(Long id) {
        Response response = new Response();

        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()) {
            response.setStatusCode(HttpStatus.OK.value());
            response.setMessage("User retrieved successfully");
            response.setUser(Utils.mapUserEntityToUserDTO(userOptional.get()));
        } else {
            response.setStatusCode(HttpStatus.NOT_FOUND.value());
            response.setMessage("User not found");
        }

        return response;
    }

    @Override
    public Response updateUser(Long id, UserDTO userDTO) {
        // This should be implemented in specific service implementations
        Response response = new Response();
        response.setStatusCode(HttpStatus.BAD_REQUEST.value());
        response.setMessage("Direct update not supported. Use specific update endpoints.");
        return response;
    }

    @Override
    public Response deleteUser(Long id) {
        Response response = new Response();

        if (!userRepository.existsById(id)) {
            response.setStatusCode(HttpStatus.NOT_FOUND.value());
            response.setMessage("User not found");
            return response;
        }

        userRepository.deleteById(id);
        response.setStatusCode(HttpStatus.OK.value());
        response.setMessage("User deleted successfully");

        return response;
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

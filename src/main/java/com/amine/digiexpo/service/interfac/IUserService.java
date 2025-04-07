package com.amine.digiexpo.service.interfac;

import com.amine.digiexpo.DTO.LoginRequest;
import com.amine.digiexpo.DTO.RegisterRequest;
import com.amine.digiexpo.DTO.Response;
import com.amine.digiexpo.DTO.UserDTO;
import com.amine.digiexpo.entity.User;

import java.util.Optional;

public interface IUserService {
    Response register(RegisterRequest registerRequest);

    Response login(LoginRequest loginRequest);

    Response getAllUsers();

    Response getUserById(Long id);

    Response updateUser(Long id, UserDTO userDTO);

    Response deleteUser(Long id);

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

}


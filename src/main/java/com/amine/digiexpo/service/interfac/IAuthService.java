package com.amine.digiexpo.service.interfac;

import com.amine.digiexpo.DTO.LoginRequest;
import com.amine.digiexpo.DTO.RegisterRequest;
import com.amine.digiexpo.DTO.UserDTO;

public interface IAuthService {
    // Connexion (tous les rôles)
    UserDTO login(LoginRequest loginRequest);

    // Création de compte (tous les rôles)
    UserDTO register(RegisterRequest registerRequest);
}

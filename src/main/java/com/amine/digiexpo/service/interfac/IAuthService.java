package com.amine.digiexpo.service.interfac;

import com.amine.digiexpo.DTO.LoginRequest;
import com.amine.digiexpo.DTO.RegisterRequest;
import com.amine.digiexpo.DTO.Response;
import com.amine.digiexpo.DTO.UserDTO;

public interface IAuthService {
    // Connexion (tous les rôles)
    Response login(LoginRequest loginRequest);

    // Création de compte (tous les rôles)
    Response register(RegisterRequest registerRequest);
}

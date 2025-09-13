package com.amine.digiexpo.service.interfac;

import com.amine.digiexpo.DTO.*;

public interface IAuthService {
    // Connexion (tous les rôles)
    Response login(LoginRequest loginRequest);

    // Création de compte (tous les rôles)
    Response registerAdmin(AdminRegisterRequest registerRequest);
    Response registerAssociation(AssociationRegisterRequest registerRequest);
    Response registerVolunteer(VolunteerRegisterRequest registerRequest);
}

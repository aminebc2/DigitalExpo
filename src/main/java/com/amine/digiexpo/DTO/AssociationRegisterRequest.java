package com.amine.digiexpo.DTO;

import lombok.Data;

@Data
public class AssociationRegisterRequest {
    private String username;
    private String email;
    private String password;
    private String name;
    private String ville;
    private String responsableName;
    private String responsablePhone;
}

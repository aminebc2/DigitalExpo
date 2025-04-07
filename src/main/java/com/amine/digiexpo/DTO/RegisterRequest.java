package com.amine.digiexpo.DTO;

import com.amine.digiexpo.enumeration.Role;
import lombok.Data;

@Data
public class RegisterRequest {
    private String username;
    private String email;
    private String password;
    private Role role;
}

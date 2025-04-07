package com.amine.digiexpo.DTO;

import com.amine.digiexpo.enumeration.Role;
import lombok.Data;

@Data
public class UserDTO {
    private Long id;
    private String username;
    private String email;
    private Role role;
}
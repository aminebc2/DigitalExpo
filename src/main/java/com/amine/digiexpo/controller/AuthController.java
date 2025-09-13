package com.amine.digiexpo.controller;

import com.amine.digiexpo.DTO.*;
import com.amine.digiexpo.service.interfac.IAuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private IAuthService authService;

    @PostMapping("/register/admin-digital-explorers")
    public ResponseEntity<Response> registerAdmin(@RequestBody AdminRegisterRequest registerRequest) {
        Response response = authService.registerAdmin(registerRequest);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/register/association")
    public ResponseEntity<Response> registerAssociation(@RequestBody AssociationRegisterRequest registerRequest) {
        Response response = authService.registerAssociation(registerRequest);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/register/volunteer")
    public ResponseEntity<Response> registerVolunteer(@RequestBody VolunteerRegisterRequest registerRequest) {
        Response response = authService.registerVolunteer(registerRequest);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<Response> login(@RequestBody LoginRequest loginRequest) {
        Response response = authService.login(loginRequest);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
}

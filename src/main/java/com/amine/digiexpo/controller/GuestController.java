package com.amine.digiexpo.controller;

import com.amine.digiexpo.DTO.Response;
import com.amine.digiexpo.service.impl.AssociationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/Guest")
public class GuestController {

    @Autowired
    private AssociationService associationService;


    @GetMapping("/all-associations")
    public ResponseEntity<Response> getAllAssociations() {
        Response response = associationService.getAllAssociations();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }


}

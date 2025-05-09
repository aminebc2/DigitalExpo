package com.amine.digiexpo.controller;

import com.amine.digiexpo.DTO.DateListDTO;
import com.amine.digiexpo.DTO.Response;
import com.amine.digiexpo.service.interfac.IAssociationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/association")
@PreAuthorize("hasRole('ASSOCIATION')")
public class AssociationController {

    @Autowired
    private IAssociationService associationService;

    @PostMapping("/reserve/{associationId}")
    public ResponseEntity<Response> reserveSessions(
            @PathVariable Long associationId,
            @RequestBody DateListDTO dateListDTO) {

        Response response = associationService.reserveSession(associationId, dateListDTO.getDates());
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    // 📋 Get all sessions of the association
    @GetMapping("/sessions/{associationId}")
    public ResponseEntity<Response> getSessions(@PathVariable Long associationId) {
        Response response = associationService.getSessions(associationId);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    // 👥 Get list of volunteers for the association
    @GetMapping("/volunteers/{associationId}")
    public ResponseEntity<Response> getVolunteers(@PathVariable Long associationId) {
        Response response = associationService.getVolunteers(associationId);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    // ℹ️ Get association info
    @GetMapping("/{associationId}")
    public ResponseEntity<Response> getAssociationById(@PathVariable Long associationId) {
        Response response = associationService.getAssociationById(associationId);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/session/{sessionId}")
    @PreAuthorize("hasRole('ASSOCIATION')")
    public ResponseEntity<Response> getSessionById(@PathVariable Long sessionId) {
        Response response = associationService.getSessionById(sessionId);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }


}

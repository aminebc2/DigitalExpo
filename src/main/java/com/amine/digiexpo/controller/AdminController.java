package com.amine.digiexpo.controller;

import com.amine.digiexpo.DTO.AssociationDTO;
import com.amine.digiexpo.DTO.Response;
import com.amine.digiexpo.DTO.SessionStatusUpdateDTO;
import com.amine.digiexpo.DTO.VolunteerDTO;
import com.amine.digiexpo.service.interfac.IAdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private IAdminService adminService;

    // ---------------- Association Endpoints ---------------- //

    @PostMapping("/association")
    public ResponseEntity<Response> createAssociation(@RequestBody AssociationDTO associationDTO) {
        Response response = adminService.createAssociation(associationDTO);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PutMapping("/association/{id}")
    public ResponseEntity<Response> updateAssociation(@PathVariable Long id, @RequestBody AssociationDTO associationDTO) {
        Response response = adminService.updateAssociation(id, associationDTO);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @DeleteMapping("/association/{id}")
    public ResponseEntity<Response> deleteAssociation(@PathVariable Long id) {
        Response response = adminService.deleteAssociation(id);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/associations")
    public ResponseEntity<Response> getAllAssociations() {
        Response response = adminService.getAllAssociations();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    // ---------------- Volunteer Endpoints ---------------- //

    @PostMapping("/volunteer")
    public ResponseEntity<Response> createVolunteer(@RequestBody VolunteerDTO volunteerDTO) {
        Response response = adminService.createVolunteer(volunteerDTO);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PutMapping("/volunteer/{id}")
    public ResponseEntity<Response> updateVolunteer(@PathVariable Long id, @RequestBody VolunteerDTO volunteerDTO) {
        Response response = adminService.updateVolunteer(id, volunteerDTO);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @DeleteMapping("/volunteer/{id}")
    public ResponseEntity<Response> deleteVolunteer(@PathVariable Long id) {
        Response response = adminService.deleteVolunteer(id);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/volunteers")
    public ResponseEntity<Response> getAllVolunteers() {
        Response response = adminService.getAllVolunteers();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    // ---------------- Volunteer Request Validation ---------------- //

    @PostMapping("/validate-request/{requestId}")
    public ResponseEntity<Response> validateVolunteerRequest(@PathVariable Long requestId) {
        Response response = adminService.validateVolunteerRequest(requestId);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    // ---------------- Confirm Session ---------------- //

    @PostMapping("/confirm-session/{sessionId}")
    public ResponseEntity<Response> confirmSession(
            @PathVariable Long sessionId,
            @RequestBody SessionStatusUpdateDTO statusDTO) {

        Response response = adminService.confirmSession(sessionId, statusDTO.getStatus());
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

}

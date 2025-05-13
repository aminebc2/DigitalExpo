package com.amine.digiexpo.controller;

import com.amine.digiexpo.DTO.Response;
import com.amine.digiexpo.DTO.UpdateRequestStatusDTO;
import com.amine.digiexpo.DTO.VolunteerRequestDTO;
import com.amine.digiexpo.enumeration.RequestStatus;
import com.amine.digiexpo.service.interfac.IVolunteerRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/volunteer")
public class VolunteerRequestController {

    @Autowired
    private IVolunteerRequestService requestService;

    @PreAuthorize("hasRole('BENEVOLE')")
    @PostMapping("/create-request")
    public ResponseEntity<Response> createRequest(@RequestBody VolunteerRequestDTO dto) {
        Response response = requestService.createRequest(dto);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }


    /*@PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/update-status")
    public ResponseEntity<Response> updateStatus(@RequestBody UpdateRequestStatusDTO updateRequestStatusDTO) {
        Response response = requestService.updateRequestStatus(updateRequestStatusDTO);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/all")
    public ResponseEntity<Response> getAllRequests() {
        Response response = requestService.getAllRequests();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }*/

    @PreAuthorize("hasRole('ASSOCIATION')")
    @GetMapping("/association/{associationId}")
    public ResponseEntity<Response> getByAssociation(@PathVariable Long associationId) {
        Response response = requestService.getRequestsByAssociation(associationId);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
}

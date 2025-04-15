package com.amine.digiexpo.controller;

import com.amine.digiexpo.DTO.Response;
import com.amine.digiexpo.service.interfac.IVolunteerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.DayOfWeek;
import java.util.List;

@RestController
@RequestMapping("/volunteer")
public class VolunteerController {

    @Autowired
    private IVolunteerService volunteerService;

    // ✅ Update available days
    @PostMapping("/available-days/{volunteerId}")
    @PreAuthorize("hasRole('BENEVOLE')")
    public ResponseEntity<Response> updateAvailableDays(
            @PathVariable Long volunteerId,
            @RequestBody List<DayOfWeek> availableDays) {
        Response response = volunteerService.updateAvailableDays(volunteerId, availableDays);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    // ✅ Get assigned sessions
    @GetMapping("/sessions/{volunteerId}")
    @PreAuthorize("hasRole('BENEVOLE')")
    public ResponseEntity<Response> getSessions(@PathVariable Long volunteerId) {
        Response response = volunteerService.getSessions(volunteerId);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    // ✅ Get volunteer by ID
    @GetMapping("/{volunteerId}")
    @PreAuthorize("hasRole('BENEVOLE')")
    public ResponseEntity<Response> getVolunteerById(@PathVariable Long volunteerId) {
        Response response = volunteerService.getVolunteerById(volunteerId);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
}

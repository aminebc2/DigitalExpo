package com.amine.digiexpo.controller;

import com.amine.digiexpo.DTO.Response;
import com.amine.digiexpo.DTO.SessionDTO;
import com.amine.digiexpo.service.interfac.ISessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/session")
public class SessionController {

    @Autowired
    private ISessionService sessionService;

    // ✅ Create a session
    @PostMapping("/create")
    @PreAuthorize("hasRole('ASSOCIATION')")
    public ResponseEntity<Response> createSession(@RequestBody List<SessionDTO> sessionDTOList) {
        Response response = sessionService.createSession(sessionDTOList);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    /*// ✅ Update a session (Admin only)
    @PutMapping("/update/{sessionId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Response> updateSession(
            @PathVariable Long sessionId,
            @RequestBody SessionDTO sessionDTO) {
        Response response = sessionService.updateSession(sessionId, sessionDTO);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }*/

    // ✅ Get a specific session by ID (Admin, Volunteer, or Association)
    /*@GetMapping("/{sessionId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('VOLUNTEER') or hasRole('ASSOCIATION')")
    public ResponseEntity<Response> getSessionById(@PathVariable Long sessionId) {
        Response response = sessionService.getSessionById(sessionId);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }*/

    /*// ✅ Get all sessions (Admin only)
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Response> getAllSessions() {
        Response response = sessionService.getAllSessions();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }*/
}

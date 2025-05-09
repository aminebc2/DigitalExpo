    package com.amine.digiexpo.controller;

    import com.amine.digiexpo.DTO.*;
    import com.amine.digiexpo.service.interfac.IAdminService;
    import com.amine.digiexpo.service.interfac.IAssociationService;
    import com.amine.digiexpo.service.interfac.ISessionService;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.http.MediaType;
    import org.springframework.http.ResponseEntity;
    import org.springframework.security.access.prepost.PreAuthorize;
    import org.springframework.web.bind.annotation.*;

    @RestController
    @RequestMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public class AdminController {

        @Autowired
        private IAdminService adminService;

        @Autowired
        private IAssociationService associationService;

        @Autowired
        private ISessionService sessionService;
        // --- Associations Endpoints (standard REST naming) --- //

        @PostMapping(value = "/association", consumes = MediaType.APPLICATION_JSON_VALUE)
        public ResponseEntity<Response> createAssociation(@RequestBody AssociationDTO associationDTO) {
            Response response = adminService.createAssociation(associationDTO);
            return ResponseEntity.status(response.getStatusCode()).body(response);
        }

        @PutMapping("/associations/{id}")
        public ResponseEntity<Response> updateAssociation(@PathVariable Long id, @RequestBody AssociationDTO associationDTO) {
            Response response = adminService.updateAssociation(id, associationDTO);
            return ResponseEntity.status(response.getStatusCode()).body(response);
        }

        @DeleteMapping("/associations/{id}")
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

        @PostMapping(value = "/volunteer", consumes = MediaType.APPLICATION_JSON_VALUE)
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

        /*@PostMapping("/validate-request/{requestId}")
        public ResponseEntity<Response> validateVolunteerRequest(@PathVariable Long requestId) {
            Response response = adminService.validateVolunteerRequest(requestId);
            return ResponseEntity.status(response.getStatusCode()).body(response);
        }*/
        @PostMapping("/update-status")
        public ResponseEntity<Response> updateStatus(@RequestBody UpdateRequestStatusDTO updateRequestStatusDTO) {
            Response response = adminService.updateRequestStatus(updateRequestStatusDTO);
            return ResponseEntity.status(response.getStatusCode()).body(response);
        }

        @GetMapping("/all-requests")
        public ResponseEntity<Response> getAllRequests() {
            Response response = adminService.getAllRequests();
            return ResponseEntity.status(response.getStatusCode()).body(response);
        }

        //---------------- Session ---------------------------//

        // ✅ Update a session (Admin only)
        @PutMapping("/update-session/{sessionId}")
        public ResponseEntity<Response> updateSession(
                @PathVariable Long sessionId,
                @RequestBody SessionStatusUpdateDTO sessionStatusUpdateDTO) {
            Response response = adminService.updateSession(sessionId, sessionStatusUpdateDTO);
            return ResponseEntity.status(response.getStatusCode()).body(response);
        }

        // ✅ Get all sessions (Admin only)
        @GetMapping("/sessions")
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<Response> getAllSessions() {
            Response response = adminService.getAllSessions();
            return ResponseEntity.status(response.getStatusCode()).body(response);
        }

        @GetMapping("/session/{sessionId}")
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<Response> getSessionById(@PathVariable Long sessionId) {
            Response response = adminService.getSessionById(sessionId);
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

        // Admin can assign volunteer to a session for their association
        @PostMapping("/assign-volunteer")
        public ResponseEntity<Response> assignVolunteerToSession(@RequestBody VolunteerSessionAssignmentDTO assignmentDTO) {
            Response response = adminService.assignVolunteerToSession(assignmentDTO.getSessionId(), assignmentDTO.getVolunteerId());
            return ResponseEntity.status(response.getStatusCode()).body(response);
        }

        @GetMapping("/asso-volunteers/{associationId}")
        public ResponseEntity<Response> getVolunteers(@PathVariable Long associationId) {
            Response response = associationService.getVolunteers(associationId);
            return ResponseEntity.status(response.getStatusCode()).body(response);
        }


    }

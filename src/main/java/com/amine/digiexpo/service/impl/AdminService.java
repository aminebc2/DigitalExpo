package com.amine.digiexpo.service.impl;

import com.amine.digiexpo.DTO.*;
import com.amine.digiexpo.Repository.*;
import com.amine.digiexpo.entity.*;
import com.amine.digiexpo.enumeration.RequestStatus;
import com.amine.digiexpo.enumeration.SessionStatus;
import com.amine.digiexpo.service.interfac.IAdminService;
import com.amine.digiexpo.utils.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;

@Service
public class AdminService implements IAdminService {

    @Autowired
    private AssociationRepository associationRepository;
    @Autowired
    private VolunteerRepository volunteerRepository;
    @Autowired
    private AdminRepository adminRepository;
    @Autowired
    private VolunteerRequestRepository volunteerRequestRepository;
    @Autowired
    private SessionRepository sessionRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public Response createAdmin(AdminDTO adminDTO) {
        try {
            if (adminRepository.findByUsername(adminDTO.getUsername()).isPresent() ||
                    adminRepository.findByEmail(adminDTO.getEmail()).isPresent()) {
                return new Response(400, "Username or email already exists", null);
            }

            Admin admin = new Admin();
            admin.setUsername(adminDTO.getUsername());
            admin.setEmail(adminDTO.getEmail());
            admin.setPassword(passwordEncoder.encode(adminDTO.getPassword()));
            admin.setRole(adminDTO.getRole());
            admin.setFullName(adminDTO.getFullName());
            admin.setPhoneNumber(adminDTO.getPhoneNumber());

            Admin savedAdmin = adminRepository.save(admin);
            AdminDTO savedAdminDTO = Utils.mapAdminToDTO(savedAdmin);

            return new Response(201, "Admin created successfully", savedAdminDTO);
        } catch (Exception e) {
            Logger.getLogger(getClass().getName()).log(Level.SEVERE, "Error creating admin", e);
            return new Response(500, "Internal server error: " + e.getMessage(), null);
        }
    }

    @Override
    public Response updateAdmin(Long adminId, AdminDTO adminDTO) {
        try {
            Admin admin = adminRepository.findById(adminId)
                    .orElseThrow(() -> new RuntimeException("Admin not found"));

            // Update fields if they are provided
            if (adminDTO.getUsername() != null) admin.setUsername(adminDTO.getUsername());
            if (adminDTO.getEmail() != null) admin.setEmail(adminDTO.getEmail());
            if (adminDTO.getPassword() != null && !adminDTO.getPassword().isEmpty()) {
                admin.setPassword(passwordEncoder.encode(adminDTO.getPassword()));
            }
            if (adminDTO.getFullName() != null) admin.setFullName(adminDTO.getFullName());
            if (adminDTO.getPhoneNumber() != null) admin.setPhoneNumber(adminDTO.getPhoneNumber());

            Admin updatedAdmin = adminRepository.save(admin);
            AdminDTO updatedAdminDTO = Utils.mapAdminToDTO(updatedAdmin);

            return new Response(200, "Admin updated successfully", updatedAdminDTO);
        } catch (RuntimeException e) {
            return new Response(404, e.getMessage(), null);
        } catch (Exception e) {
            return new Response(500, "Error updating admin: " + e.getMessage(), null);
        }
    }

    @Override
    public Response deleteAdmin(Long adminId) {
        try {
            Admin admin = adminRepository.findById(adminId)
                    .orElseThrow(() -> new RuntimeException("Admin not found"));

            adminRepository.delete(admin);
            return new Response(200, "Admin deleted successfully", null);
        } catch (RuntimeException e) {
            return new Response(404, e.getMessage(), null);
        } catch (Exception e) {
            return new Response(500, "Error deleting admin: " + e.getMessage(), null);
        }
    }

    @Override
    public Response getAllAdmins() {
        try {
            List<Admin> admins = adminRepository.findAll();
            List<AdminDTO> adminDTOs = admins.stream()
                    .map(Utils::mapAdminToDTO)
                    .collect(Collectors.toList());

            return new Response(200, "Admins retrieved successfully", adminDTOs);
        } catch (Exception e) {
            return new Response(500, "Error retrieving admins: " + e.getMessage(), null);
        }
    }

    @Override
    public Response getAdminById(Long adminId) {
        try {
            Admin admin = adminRepository.findById(adminId)
                    .orElseThrow(() -> new RuntimeException("Admin not found"));

            AdminDTO adminDTO = Utils.mapAdminToDTO(admin);
            return new Response(200, "Admin retrieved successfully", adminDTO);
        } catch (RuntimeException e) {
            return new Response(404, e.getMessage(), null);
        } catch (Exception e) {
            return new Response(500, "Error retrieving admin: " + e.getMessage(), null);
        }
    }

    @Override
    public Response getAdminByUsername(String username) {
        try {
            Admin admin = adminRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Admin not found"));

            AdminDTO adminDTO = Utils.mapAdminToDTO(admin);
            return new Response(200, "Admin retrieved successfully", adminDTO);
        } catch (RuntimeException e) {
            return new Response(404, e.getMessage(), null);
        } catch (Exception e) {
            return new Response(500, "Error retrieving admin: " + e.getMessage(), null);
        }
    }

    @Override
    public Response createAssociation(AssociationDTO associationDTO, MultipartFile imageFile) {
        try {
            if (associationRepository.findByUsername(associationDTO.getUsername()).isPresent() ||
                    associationRepository.findByEmail(associationDTO.getEmail()).isPresent()) {
                return new Response(400, "Username or email already exists", null);
            }

            Association association = new Association();
            association.setUsername(associationDTO.getUsername());
            association.setEmail(associationDTO.getEmail());
            association.setPassword(passwordEncoder.encode(associationDTO.getPassword()));
            association.setRole(associationDTO.getRole());
            association.setName(associationDTO.getName());
            association.setVille(associationDTO.getVille());
            association.setResponsableName(associationDTO.getResponsableName());
            association.setResponsablePhone(associationDTO.getResponsablePhone());
            association.setImageFileName(associationDTO.getImageFileName());

            // Save image
            String fileName = saveImageFile(imageFile);
            association.setImageFileName(fileName);

            Association savedAssociation = associationRepository.save(association);
            AssociationDTO savedAssociationDTO = Utils.mapAssociationToDTOWithRelations(savedAssociation);

            return new Response(201, "Association created successfully", savedAssociationDTO);
        } catch (Exception e) {
            // Logging error for debugging and improving error response.
            Logger.getLogger(getClass().getName()).log(Level.SEVERE, "Error creating association", e);
            return new Response(500, "Internal server error: " + e.getMessage(), null);
        }
    }



    @Override
    public Response updateAssociation(Long associationId, AssociationDTO associationDTO, MultipartFile imageFile) {
        try {
            Association association = associationRepository.findById(associationId)
                    .orElseThrow(() -> new RuntimeException("Association not found"));

            if (associationDTO.getUsername() != null) association.setUsername(associationDTO.getUsername());
            if (associationDTO.getEmail() != null) association.setEmail(associationDTO.getEmail());
            if (associationDTO.getPassword() != null) association.setPassword(passwordEncoder.encode(associationDTO.getPassword()));
            if (associationDTO.getName() != null) association.setName(associationDTO.getName());
            if (associationDTO.getVille() != null) association.setVille(associationDTO.getVille());
            if (associationDTO.getResponsableName() != null)
                association.setResponsableName(associationDTO.getResponsableName());
            if (associationDTO.getResponsablePhone() != null)
                association.setResponsablePhone(associationDTO.getResponsablePhone());
            if (associationDTO.getImageFileName() != null)
                association.setImageFileName(associationDTO.getImageFileName());

            if (imageFile != null && !imageFile.isEmpty()) {
                String fileName = saveImageFile(imageFile);
                association.setImageFileName(fileName);
            }

            Association updatedAssociation = associationRepository.save(association);
            AssociationDTO updatedAssociationDTO = Utils.mapAssociationToDTOWithRelations(updatedAssociation);

            return new Response(200, "Association updated successfully", updatedAssociationDTO);
        } catch (RuntimeException e) {
            return new Response(404, e.getMessage(), null);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private String saveImageFile(MultipartFile file) throws IOException {
        String uploadDir = "uploads/associations/";
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path uploadPath = Paths.get(uploadDir);

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        return fileName;
    }


    @Override
    @Transactional
    public Response deleteAssociation(Long associationId) {
        try {
            Association association = associationRepository.findById(associationId)
                    .orElseThrow(() -> new RuntimeException("Association not found"));

            // Remove all sessions related to this association
            List<Session> sessions = sessionRepository.findByAssociationId(associationId);
            for (Session session : sessions) {
                session.setVolunteer(null); // Remove volunteer reference first
                sessionRepository.delete(session);
            }

            // Remove all volunteer requests for this association
            volunteerRequestRepository.deleteByAssociationId(associationId);

            // Remove association from all volunteers' associations list
            for (Volunteer volunteer : association.getVolunteers()) {
                volunteer.getAssociations().remove(association);
                volunteerRepository.save(volunteer);
            }

            // Clear the volunteers set in the association
            association.getVolunteers().clear();
            associationRepository.save(association);

            // Finally, delete the association
            associationRepository.delete(association);

            return new Response(200, "Association deleted successfully", null);
        } catch (RuntimeException e) {
            return new Response(404, e.getMessage(), null);
        } catch (Exception e) {
            return new Response(500, "Error deleting association: " + e.getMessage(), null);
        }
    }

    @Override
    public Response getAllAssociations() {
        List<Association> associations = associationRepository.findAll();
        List<AssociationDTO> associationDTOs = associations.stream()
                .map(Utils::mapAssociationToDTOWithRelations)
                .toList();

        return new Response(200, "Associations retrieved successfully", associationDTOs);
    }

    public Response createVolunteer(VolunteerDTO volunteerDTO) {
        try {
            if (volunteerRepository.findByUsername(volunteerDTO.getUsername()).isPresent() ||
                    volunteerRepository.findByEmail(volunteerDTO.getEmail()).isPresent()) {
                return new Response(400, "Username or email already exists", null);
            }

            Volunteer volunteer = new Volunteer();
            volunteer.setUsername(volunteerDTO.getUsername());
            volunteer.setEmail(volunteerDTO.getEmail());
            volunteer.setPassword(passwordEncoder.encode(volunteerDTO.getPassword()));
            volunteer.setRole(volunteerDTO.getRole());
            volunteer.setPhoneNumber(volunteerDTO.getPhoneNumber());
            volunteer.setFullName(volunteerDTO.getFullName());
            volunteer.setAvailableDays(volunteerDTO.getAvailableDays());

            Volunteer savedVolunteer = volunteerRepository.save(volunteer);
            VolunteerDTO savedVolunteerDTO = Utils.mapVolunteerToDTOWithRelations(savedVolunteer);

            return new Response(201, "Volunteer created successfully", savedVolunteerDTO);
        } catch (Exception e) {
            // Logging error for debugging and improving error response.
            Logger.getLogger(getClass().getName()).log(Level.SEVERE, "Error creating volunteer", e);
            return new Response(500, "Internal server error: " + e.getMessage(), null);
        }
    }


    @Override
    public Response updateVolunteer(Long volunteerId, VolunteerDTO volunteerDTO) {
        try {
            Volunteer volunteer = volunteerRepository.findById(volunteerId)
                    .orElseThrow(() -> new RuntimeException("Volunteer not found"));

            if (volunteerDTO.getUsername() != null) volunteer.setUsername(volunteerDTO.getUsername());
            if (volunteerDTO.getEmail() != null) volunteer.setEmail(volunteerDTO.getEmail());
            if (volunteerDTO.getPassword() != null) volunteer.setPassword(passwordEncoder.encode(volunteerDTO.getPassword()));
            if (volunteerDTO.getPhoneNumber() != null) volunteer.setPhoneNumber(volunteerDTO.getPhoneNumber());
            if (volunteerDTO.getFullName() != null) volunteer.setFullName(volunteerDTO.getFullName());
            if (volunteerDTO.getAvailableDays() != null) volunteer.setAvailableDays(volunteerDTO.getAvailableDays());

            Volunteer updatedVolunteer = volunteerRepository.save(volunteer);
            VolunteerDTO updatedVolunteerDTO = Utils.mapVolunteerToDTO(updatedVolunteer);

            return new Response(200, "Volunteer updated successfully", updatedVolunteerDTO);
        } catch (RuntimeException e) {
            return new Response(404, e.getMessage(), null);
        }
    }

    @Override
    @Transactional
    public Response deleteVolunteer(Long volunteerId) {
        try {
            Volunteer volunteer = volunteerRepository.findById(volunteerId)
                    .orElseThrow(() -> new RuntimeException("Volunteer not found"));

            // First, remove volunteer from all sessions
            List<Session> sessions = sessionRepository.findByVolunteerId(volunteerId);
            for (Session session : sessions) {
                session.setVolunteer(null);
                sessionRepository.save(session);
            }

            // Remove volunteer from all associations
            for (Association association : volunteer.getAssociations()) {
                association.getVolunteers().remove(volunteer);
                associationRepository.save(association);
            }

            // Remove all volunteer requests
            volunteerRequestRepository.deleteByVolunteerId(volunteerId);

            // Finally, delete the volunteer
            volunteerRepository.delete(volunteer);

            return new Response(200, "Volunteer deleted successfully", null);
        } catch (RuntimeException e) {
            return new Response(404, e.getMessage(), null);
        } catch (Exception e) {
            return new Response(500, "Error deleting volunteer: " + e.getMessage(), null);
        }
    }

    @Override
    public Response getAllVolunteers() {
        List<Volunteer> volunteers = volunteerRepository.findAll();

        // Validate if data exists in the database
        if (volunteers.isEmpty()) {
            return new Response(200, "No volunteers found", null);
        }

        List<VolunteerDTO> volunteerDTOs = volunteers.stream()
                .map(Utils::mapVolunteerToDTO)
                .collect(Collectors.toList());

        // Ensure data is wrapped in the "data" field
        return new Response(200, "Volunteers retrieved successfully", volunteerDTOs);
    }

    @Override
    public Response updateRequestStatus(UpdateRequestStatusDTO updateRequestStatusDTO) {
        try {
            Long requestId = updateRequestStatusDTO.getRequestId();
            RequestStatus status = updateRequestStatusDTO.getStatus();

            // Retrieve the request by ID
            VolunteerRequest request = volunteerRequestRepository.findById(requestId)
                    .orElseThrow(() -> new RuntimeException("Request not found"));

            request.setStatus(status);

            Volunteer volunteer = request.getVolunteer();
            Association association = request.getAssociation();

            // If approved, add volunteer to the association
            if (status == RequestStatus.APPROVED) {
                if (!association.getVolunteers().contains(volunteer)) {
                    association.getVolunteers().add(volunteer);
                    volunteer.getAssociations().add(association);
                    associationRepository.save(association);
                    volunteerRepository.save(volunteer);
                }
            }

            // If REJECTED or CANCELED, remove the volunteer from association and sessions
            if (status == RequestStatus.REJECTED || status == RequestStatus.PENDING) {
                association.getVolunteers().remove(volunteer);
                volunteer.getAssociations().remove(association);
                associationRepository.save(association);
                volunteerRepository.save(volunteer);

                // Remove volunteer from sessions of this association
                List<Session> sessions = sessionRepository.findByAssociationIdAndVolunteerId(
                        association.getId(), volunteer.getId()
                );
                for (Session session : sessions) {
                    session.setVolunteer(null); // or remove from list if @ManyToMany
                    sessionRepository.save(session);
                }
            }

            // Save the updated request
            VolunteerRequest updatedRequest = volunteerRequestRepository.save(request);

            return new Response(200, "Request status updated", Utils.mapVolunteerRequestToDTOWithRelations(updatedRequest));
        } catch (Exception e) {
            return new Response(500, "Error updating request status: " + e.getMessage(), null);
        }
    }



    @Override
    public Response getAllRequests() {
        try {
            // Retrieve all requests
            List<VolunteerRequest> list = volunteerRequestRepository.findAll();
            return new Response(200, "List of requests retrieved", Utils.mapVolunteerRequestListToDTOList(list));
        } catch (Exception e) {
            return new Response(500, "Error retrieving requests: " + e.getMessage(), null);
        }
    }

    @Override
    @Transactional
    public Response deleteVolunteerRequest(Long requestId) {
        try {
            // Find the request by ID
            VolunteerRequest request = volunteerRequestRepository.findById(requestId)
                    .orElseThrow(() -> new RuntimeException("Volunteer request not found"));

            // If the request is APPROVED, we need to remove the volunteer from the association
            if (request.getStatus() == RequestStatus.APPROVED) {
                Volunteer volunteer = request.getVolunteer();
                Association association = request.getAssociation();

                if (volunteer != null && association != null) {
                    // Remove the association from volunteer's associations
                    volunteer.getAssociations().remove(association);
                    volunteerRepository.save(volunteer);

                    // Remove the volunteer from association's volunteers
                    association.getVolunteers().remove(volunteer);
                    associationRepository.save(association);

                    // Remove volunteer from any sessions with this association
                    List<Session> sessions = sessionRepository.findByAssociationIdAndVolunteerId(
                            association.getId(), volunteer.getId()
                    );
                    for (Session session : sessions) {
                        session.setVolunteer(null);
                        sessionRepository.save(session);
                    }
                }
            }

            // Delete the request
            volunteerRequestRepository.delete(request);

            return new Response(200, "Volunteer request deleted successfully", null);
        } catch (RuntimeException e) {
            return new Response(404, e.getMessage(), null);
        } catch (Exception e) {
            return new Response(500, "Error deleting volunteer request: " + e.getMessage(), null);
        }
    }

    @Override
    public Response confirmSession(Long sessionId, SessionStatus status) {
        try {
            Session session = sessionRepository.findById(sessionId)
                    .orElseThrow(() -> new RuntimeException("Session not found"));

            session.setStatus(status);
            Session updatedSession = sessionRepository.save(session);
            SessionDTO sessionDTO = Utils.mapSessionToDTO(updatedSession);

            return new Response(200, "Session " + status.name().toLowerCase() + " successfully", sessionDTO);
        } catch (RuntimeException e) {
            return new Response(404, e.getMessage(), null);
        }
    }

    @Override
    public Response updateSession(Long sessionId, SessionStatusUpdateDTO sessionStatusUpdateDTO) {
        try {
            if (sessionId == null) {
                return new Response(400, "Session ID is required", null);
            }

            Session session = sessionRepository.findById(sessionId)
                    .orElseThrow(() -> new RuntimeException("Session not found with ID: " + sessionId));

            // ✅ Only update status (we're only passing status in the DTO)
            if (sessionStatusUpdateDTO.getStatus() != null) {
                session.setStatus(sessionStatusUpdateDTO.getStatus());
            } else {
                return new Response(400, "Status is required", null);
            }

            Session updatedSession = sessionRepository.save(session);
            return new Response(200, "Session updated successfully", Utils.mapSessionToDTOWithRelations(updatedSession));

        } catch (RuntimeException e) {
            return new Response(400, "Failed to update session: " + e.getMessage(), null);
        } catch (Exception e) {
            return new Response(500, "Unexpected error while updating session: " + e.getMessage(), null);
        }
    }


    @Override
    public Response getAllSessions() {
        try {
            // Retrieve all sessions
            List<Session> sessions = sessionRepository.findAll();

            // Return successful response
            return new Response(200, "Sessions retrieved successfully", Utils.mapSessionListToDTOList(sessions));
        } catch (Exception e) {
            // Handle exceptions and return error response
            return new Response(500, "Failed to retrieve sessions: " + e.getMessage(), null);
        }
    }

    @Override
    public Response getSessionById(Long sessionId) {
        try {
            // Find the session by ID
            Session session = sessionRepository.findById(sessionId)
                    .orElseThrow(() -> new RuntimeException("Session not found"));

            // Return successful response
            return new Response(200, "Session retrieved successfully", Utils.mapSessionToDTOWithRelations(session));
        } catch (Exception e) {
            // Handle exceptions and return error response
            return new Response(500, "Failed to retrieve session: " + e.getMessage(), null);
        }
    }

    @Override
    @Transactional
    public Response deleteSession(Long sessionId) {
        try {
            // Find the session by ID
            Session session = sessionRepository.findById(sessionId)
                    .orElseThrow(() -> new RuntimeException("Session not found"));

            // Remove volunteer reference if exists
            if (session.getVolunteer() != null) {
                session.setVolunteer(null);
            }

            // Delete the session
            sessionRepository.delete(session);

            return new Response(200, "Session deleted successfully", null);
        } catch (RuntimeException e) {
            return new Response(404, e.getMessage(), null);
        } catch (Exception e) {
            return new Response(500, "Error deleting session: " + e.getMessage(), null);
        }
    }

    @Override
    public Response assignVolunteerToSession(Long sessionId, Long volunteerId) {
        try {
            // Fetch the session by ID
            Session session = sessionRepository.findById(sessionId)
                    .orElseThrow(() -> new RuntimeException("Session not found"));

            // Fetch the volunteer by ID
            Volunteer volunteer = volunteerRepository.findById(volunteerId)
                    .orElseThrow(() -> new RuntimeException("Volunteer not found"));

            // Check if the session belongs to an association
            Association sessionAssociation = session.getAssociation();
            if (sessionAssociation == null) {
                return new Response(400, "Session does not belong to any association", null);
            }

            // Ensure the volunteer is part of the association
            boolean isVolunteerInAssociation = volunteer.getAssociations().contains(sessionAssociation);
            if (!isVolunteerInAssociation) {
                return new Response(400, "This volunteer is not part of the association for this session", null);
            }

            // Assign the volunteer to the session
            session.setVolunteer(volunteer);

            // Save the updated session
            sessionRepository.save(session);

            return new Response(200, "Volunteer successfully assigned to the session", null);

        } catch (RuntimeException e) {
            return new Response(400, "Failed to assign volunteer: " + e.getMessage(), null);
        } catch (Exception e) {
            return new Response(500, "Unexpected error while updating session: " + e.getMessage(), null);
        }
    }

    @Override
    public Response getVolunteers(Long associationId) {
        try {
            // Fetching the association by ID
            Association association = associationRepository.findById(associationId)
                    .orElseThrow(() -> new RuntimeException("Association not found"));

            // Prepare response
            Response response = new Response();
            response.setStatusCode(200);
            response.setMessage("Volunteer list retrieved");

            // ✅ Deduplicate volunteers and map to DTOs
            response.setVolunteerList(
                    association.getVolunteers().stream()
                            .distinct() // Remove duplicate volunteers
                            .map(Utils::mapVolunteerToDTOWithRelations)
                            .collect(Collectors.toList())
            );

            return response;
        } catch (Exception e) {
            return new Response(500, "Failed to retrieve volunteers: " + e.getMessage(), null);
        }
    }



}
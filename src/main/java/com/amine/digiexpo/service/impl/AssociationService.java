package com.amine.digiexpo.service.impl;

import com.amine.digiexpo.DTO.AssociationDTO;
import com.amine.digiexpo.DTO.Response;
import com.amine.digiexpo.DTO.SessionDTO;
import com.amine.digiexpo.DTO.VolunteerDTO;
import com.amine.digiexpo.Repository.AssociationRepository;
import com.amine.digiexpo.Repository.SessionRepository;
import com.amine.digiexpo.Repository.VolunteerRepository;
import com.amine.digiexpo.entity.Association;
import com.amine.digiexpo.entity.Session;
import com.amine.digiexpo.entity.Volunteer;
import com.amine.digiexpo.enumeration.SessionStatus;
import com.amine.digiexpo.service.interfac.IAssociationService;
import com.amine.digiexpo.utils.Utils;
import org.apache.commons.io.FilenameUtils;
import org.hibernate.service.spi.ServiceException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import static com.amine.digiexpo.utils.Utils.mapSessionListToDTOListWithAssociationDetails;

@Service
public class AssociationService implements IAssociationService {

    @Autowired
    private AssociationRepository associationRepository;

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private static final Logger logger = LoggerFactory.getLogger(AssociationService.class);

    private static final String UPLOAD_DIR = "uploads/associations/";


    @Override
    public Response reserveSession(Long associationId, List<LocalDate> dates) {
        try {
            Association association = associationRepository.findById(associationId)
                    .orElseThrow(() -> new RuntimeException("Association not found"));

            // Check for ANY existing sessions on the requested dates
            List<String> conflictDetails = new ArrayList<>();
            for (LocalDate date : dates) {
                // Find any existing session for this date
                Session existingSession = sessionRepository.findByDate(date);
                if (existingSession != null) {
                    String associationName = existingSession.getAssociation().getName();
                    conflictDetails.add(date.toString() + " (reserved by " + associationName + ")");
                }
            }

            // If there are conflicting dates, return error response with details
            if (!conflictDetails.isEmpty()) {
                String conflictMessage = conflictDetails.stream()
                        .reduce((a, b) -> a + ", " + b)
                        .orElse("");
                return new Response(400, "Cannot reserve: The following dates are already booked: " + conflictMessage, null);
            }

            List<Session> savedSessions = new ArrayList<>();
            for (LocalDate date : dates) {
                Session session = new Session();
                session.setDate(date);
                session.setStatus(SessionStatus.PENDING);
                session.setAssociation(association);
                Session saved = sessionRepository.save(session);
                savedSessions.add(saved);
            }

            Response response = new Response();
            response.setStatusCode(200);
            response.setMessage("Sessions reserved successfully");
            response.setSessionList(Utils.mapSessionListToDTOList(savedSessions));
            return response;
        } catch (Exception e) {
            return new Response(500, "Failed to reserve sessions: " + e.getMessage(), null);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Response getAllReservedSessions() {
        try {
            List<Session> sessions = sessionRepository.findAll();
            List<SessionDTO> dtos = Utils.convertSessionListToDTO(sessions);
            List<SessionDTO> sessionDTOs = Utils.convertSessionListToDTO(sessions);

            // Return the response with the session data
            return new Response(200, "Sessions retrieved successfully", dtos);

        } catch (Exception e) {
            logger.error("Error fetching all reserved sessions: {}", e.getMessage());
            return new Response(500, "Failed to fetch reserved sessions", null);
        }
    }

    @Transactional
    public Response updateAssociation(Long associationId, AssociationDTO updatedAssociationDTO, MultipartFile picture) {
        try {
            Association existing = associationRepository.findById(associationId)
                    .orElseThrow(() -> new RuntimeException("Association not found"));

            // Update basic information
            existing.setUsername(updatedAssociationDTO.getUsername());
            existing.setEmail(updatedAssociationDTO.getEmail());
            existing.setName(updatedAssociationDTO.getName());
            existing.setVille(updatedAssociationDTO.getVille());
            existing.setResponsableName(updatedAssociationDTO.getResponsableName());
            existing.setResponsablePhone(updatedAssociationDTO.getResponsablePhone());

            // Update password if provided
            if (updatedAssociationDTO.getPassword() != null && !updatedAssociationDTO.getPassword().isEmpty()) {
                existing.setPassword(passwordEncoder.encode(updatedAssociationDTO.getPassword()));
            }

            // Handle picture upload if provided
            if (picture != null && !picture.isEmpty()) {
                // Delete old image if exists
                deleteOldImage(existing.getImageFileName());

                // Save new image and update filename
                String newFileName = saveImageFile(picture);
                existing.setImageFileName(newFileName);
            }

            Association saved = associationRepository.save(existing);
            AssociationDTO responseDTO = Utils.mapAssociationToDTO(saved);

            // Set the image filename in the DTO if image exists
            if (saved.getImageFileName() != null) {
                responseDTO.setImageFileName("/images/" + saved.getImageFileName());
            }

            return new Response(200, "Association updated successfully", responseDTO);
        } catch (IOException e) {
            logger.error("Failed to process image upload: {}", e.getMessage());
            return new Response(500, "Failed to process image upload: " + e.getMessage(), null);
        } catch (Exception e) {
            logger.error("Failed to update association: {}", e.getMessage());
            return new Response(500, "Failed to update association: " + e.getMessage(), null);
        }
    }

    private String saveImageFile(MultipartFile file) throws IOException {
        // Create the upload directory if it doesn't exist
        File uploadDir = new File(UPLOAD_DIR);
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }

        // Generate a unique filename
        String originalFileName = file.getOriginalFilename();
        String fileExtension = originalFileName != null ?
                FilenameUtils.getExtension(originalFileName) : "jpg";
        String newFileName = UUID.randomUUID().toString() + "." + fileExtension;

        // Save the file
        Path filePath = Paths.get(UPLOAD_DIR, newFileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return newFileName;
    }

    private void deleteOldImage(String fileName) {
        if (fileName != null && !fileName.isEmpty()) {
            try {
                Path filePath = Paths.get(UPLOAD_DIR, fileName);
                Files.deleteIfExists(filePath);
            } catch (IOException e) {
                // Log the error but don't throw it
                e.printStackTrace();
            }
        }
    }

    @Override
    public Response getSessions(Long associationId) {
        try {
            if (!associationRepository.existsById(associationId)) {
                return new Response(404, "Association not found", null);
            }

            List<Session> sessions = sessionRepository.findByAssociationId(associationId);

            // Use the new utility function to map sessions with volunteer details
            List<SessionDTO> sessionDTOList = Utils.mapSessionListToDTOListWithVolunteerDetails(sessions);

            Response response = new Response();
            response.setStatusCode(200);
            response.setMessage("Session list retrieved");
            response.setSessionList(sessionDTOList);

            return response;
        } catch (Exception e) {
            return new Response(500, "Failed to retrieve sessions: " + e.getMessage(), null);
        }
    }

    @Override
    public Response getVolunteers(Long associationId) {
        try {
            Association association = associationRepository.findById(associationId)
                    .orElseThrow(() -> new RuntimeException("Association not found"));

            Response response = new Response();
            response.setStatusCode(200);
            response.setMessage("Volunteer list retrieved");
            response.setVolunteerList(Utils.mapVolunteerListToDTOList(association.getVolunteers()));
            return response;
        } catch (Exception e) {
            return new Response(500, "Failed to retrieve volunteers: " + e.getMessage(), null);
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
    public Response getAssociationById(Long associationId) {
        try {
            Association association = associationRepository.findById(associationId)
                    .orElseThrow(() -> new RuntimeException("Association not found"));

            Response response = new Response();
            response.setStatusCode(200);
            response.setMessage("Association found");
            response.setAssociation(Utils.mapAssociationToDTO(association));
            return response;
        } catch (Exception e) {
            return new Response(500, "Failed to retrieve association: " + e.getMessage(), null);
        }
    }

    @Override
    public Response getAllAssociations() {
        List<Association> associations = associationRepository.findAll();
        List<AssociationDTO> dtos = Utils.mapAssociationListToDTOList(associations);

        Response response = new Response();
        response.setStatusCode(200);
        response.setMessage("Associations fetched successfully");
        response.setAssociationList(dtos);
        return response;
    }

}
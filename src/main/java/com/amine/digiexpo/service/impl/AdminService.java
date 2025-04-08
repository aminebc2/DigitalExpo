package com.amine.digiexpo.service.impl;

import com.amine.digiexpo.DTO.AssociationDTO;
import com.amine.digiexpo.DTO.Response;
import com.amine.digiexpo.DTO.SessionDTO;
import com.amine.digiexpo.DTO.VolunteerDTO;
import com.amine.digiexpo.Repository.AssociationRepository;
import com.amine.digiexpo.Repository.SessionRepository;
import com.amine.digiexpo.Repository.VolunteerRepository;
import com.amine.digiexpo.Repository.VolunteerRequestRepository;
import com.amine.digiexpo.entity.Association;
import com.amine.digiexpo.entity.Session;
import com.amine.digiexpo.entity.Volunteer;
import com.amine.digiexpo.entity.VolunteerRequest;
import com.amine.digiexpo.enumeration.RequestStatus;
import com.amine.digiexpo.enumeration.SessionStatus;
import com.amine.digiexpo.service.interfac.IAdminService;
import com.amine.digiexpo.utils.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class AdminService implements IAdminService {

    @Autowired
    private AssociationRepository associationRepository;
    @Autowired
    private VolunteerRepository volunteerRepository;
    @Autowired
    private VolunteerRequestRepository volunteerRequestRepository;
    @Autowired
    private SessionRepository sessionRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public Response createAssociation(AssociationDTO associationDTO) {
        if (associationRepository.findByUsername(associationDTO.getUsername()).isPresent() ||
                associationRepository.findByEmail(associationDTO.getEmail()).isPresent()) {
            return new Response(400, "Username or email already exists", null);
        }

        Association association = new Association();
        association.setUsername(associationDTO.getUsername());
        association.setEmail(associationDTO.getEmail());
        association.setPassword(passwordEncoder.encode("defaultPassword"));
        association.setRole(associationDTO.getRole());
        association.setName(associationDTO.getName());
        association.setVille(associationDTO.getVille());
        association.setResponsableName(associationDTO.getResponsableName());
        association.setResponsablePhone(associationDTO.getResponsablePhone());

        Association savedAssociation = associationRepository.save(association);
        AssociationDTO savedAssociationDTO = Utils.mapAssociationToDTOWithRelations(savedAssociation);

        return new Response(201, "Association created successfully", savedAssociationDTO);

    }

    @Override
    public Response updateAssociation(Long associationId, AssociationDTO associationDTO) {
        try {
            Association association = associationRepository.findById(associationId)
                    .orElseThrow(() -> new RuntimeException("Association not found"));

            if (associationDTO.getUsername() != null) association.setUsername(associationDTO.getUsername());
            if (associationDTO.getEmail() != null) association.setEmail(associationDTO.getEmail());
            if (associationDTO.getName() != null) association.setName(associationDTO.getName());
            if (associationDTO.getVille() != null) association.setVille(associationDTO.getVille());
            if (associationDTO.getResponsableName() != null)
                association.setResponsableName(associationDTO.getResponsableName());
            if (associationDTO.getResponsablePhone() != null)
                association.setResponsablePhone(associationDTO.getResponsablePhone());

            Association updatedAssociation = associationRepository.save(association);
            AssociationDTO updatedAssociationDTO = Utils.mapAssociationToDTOWithRelations(updatedAssociation);

            return new Response(200, "Association updated successfully", updatedAssociationDTO);
        } catch (RuntimeException e) {
            return new Response(404, e.getMessage(), null);
        }
    }

    @Override
    public Response deleteAssociation(Long associationId) {
        try {
            if (!associationRepository.existsById(associationId)) {
                throw new RuntimeException("Association not found");
            }
            associationRepository.deleteById(associationId);
            return new Response(200, "Association deleted successfully", null);
        } catch (RuntimeException e) {
            return new Response(404, e.getMessage(), null);
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

    @Override
    public Response createVolunteer(VolunteerDTO volunteerDTO) {
        try {
            if (volunteerRepository.findByUsername(volunteerDTO.getUsername()).isPresent() ||
                    volunteerRepository.findByEmail(volunteerDTO.getEmail()).isPresent()) {
                throw new RuntimeException("Username or email already exists");
            }

            Volunteer volunteer = new Volunteer();
            volunteer.setUsername(volunteerDTO.getUsername());
            volunteer.setEmail(volunteerDTO.getEmail());
            volunteer.setPassword(passwordEncoder.encode("defaultPassword"));
            volunteer.setRole(volunteerDTO.getRole());
            volunteer.setPhoneNumber(volunteerDTO.getPhoneNumber());
            volunteer.setAvailableDays(volunteerDTO.getAvailableDays());

            Volunteer savedVolunteer = volunteerRepository.save(volunteer);
            VolunteerDTO savedVolunteerDTO = Utils.mapVolunteerToDTO(savedVolunteer);

            return new Response(201, "Volunteer created successfully", savedVolunteerDTO);
        } catch (RuntimeException e) {
            return new Response(400, e.getMessage(), null);
        }
    }

    @Override
    public Response updateVolunteer(Long volunteerId, VolunteerDTO volunteerDTO) {
        try {
            Volunteer volunteer = volunteerRepository.findById(volunteerId)
                    .orElseThrow(() -> new RuntimeException("Volunteer not found"));

            if (volunteerDTO.getUsername() != null) volunteer.setUsername(volunteerDTO.getUsername());
            if (volunteerDTO.getEmail() != null) volunteer.setEmail(volunteerDTO.getEmail());
            if (volunteerDTO.getPhoneNumber() != null) volunteer.setPhoneNumber(volunteerDTO.getPhoneNumber());
            if (volunteerDTO.getAvailableDays() != null) volunteer.setAvailableDays(volunteerDTO.getAvailableDays());

            Volunteer updatedVolunteer = volunteerRepository.save(volunteer);
            VolunteerDTO updatedVolunteerDTO = Utils.mapVolunteerToDTO(updatedVolunteer);

            return new Response(200, "Volunteer updated successfully", updatedVolunteerDTO);
        } catch (RuntimeException e) {
            return new Response(404, e.getMessage(), null);
        }
    }

    @Override
    public Response deleteVolunteer(Long volunteerId) {
        try {
            if (!volunteerRepository.existsById(volunteerId)) {
                throw new RuntimeException("Volunteer not found");
            }
            volunteerRepository.deleteById(volunteerId);
            return new Response(200, "Volunteer deleted successfully", null);
        } catch (RuntimeException e) {
            return new Response(404, e.getMessage(), null);
        }
    }

    @Override
    public Response getAllVolunteers() {
        List<Volunteer> volunteers = volunteerRepository.findAll();
        List<VolunteerDTO> volunteerDTOs = volunteers.stream()
                .map(Utils::mapVolunteerToDTO)
                .toList();

        return new Response(200, "Volunteers retrieved successfully", volunteerDTOs);
    }

    @Override
    public Response validateVolunteerRequest(Long requestId) {
        try {
            VolunteerRequest volunteerRequest = volunteerRequestRepository.findById(requestId)
                    .orElseThrow(() -> new RuntimeException("Volunteer request not found"));

            volunteerRequest.setStatus(RequestStatus.APPROVED);
            Volunteer volunteer = volunteerRequest.getVolunteer();
            Association association = volunteerRequest.getAssociation();
            association.getVolunteers().add(volunteer);
            volunteer.getAssociations().add(association);

            volunteerRequestRepository.save(volunteerRequest);
            associationRepository.save(association);
            volunteerRepository.save(volunteer);

            return new Response(200, "Volunteer request approved successfully", volunteerRequest);
        } catch (RuntimeException e) {
            return new Response(404, e.getMessage(), null);
        }
    }

    @Override
    public Response confirmSession(Long sessionId) {
        try {
            Session session = sessionRepository.findById(sessionId)
                    .orElseThrow(() -> new RuntimeException("Session not found"));

            session.setStatus(SessionStatus.CONFIRMED);
            Session updatedSession = sessionRepository.save(session);
            SessionDTO sessionDTO = Utils.mapSessionToDTO(updatedSession);

            return new Response(200, "Session confirmed successfully", sessionDTO);
        } catch (RuntimeException e) {
            return new Response(404, e.getMessage(), null);
        }
    }
}
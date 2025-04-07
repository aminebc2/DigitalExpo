package com.amine.digiexpo.service.impl;

import com.amine.digiexpo.DTO.AssociationDTO;
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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService implements IAdminService {

    private final AssociationRepository associationRepository;
    private final VolunteerRepository volunteerRepository;
    private final VolunteerRequestRepository volunteerRequestRepository;
    private final SessionRepository sessionRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AdminService(AssociationRepository associationRepository,
                            VolunteerRepository volunteerRepository,
                            VolunteerRequestRepository volunteerRequestRepository,
                            SessionRepository sessionRepository,
                            PasswordEncoder passwordEncoder) {
        this.associationRepository = associationRepository;
        this.volunteerRepository = volunteerRepository;
        this.volunteerRequestRepository = volunteerRequestRepository;
        this.sessionRepository = sessionRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public AssociationDTO createAssociation(AssociationDTO associationDTO) {
        if (associationRepository.findByUsername(associationDTO.getUsername()).isPresent() ||
                associationRepository.findByEmail(associationDTO.getEmail()).isPresent()) {
            throw new RuntimeException("Username or email already exists");
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
        return Utils.mapAssociationEntityToAssociationDTOWithRelations(savedAssociation);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public AssociationDTO updateAssociation(Long associationId, AssociationDTO associationDTO) {
        Association association = associationRepository.findById(associationId)
                .orElseThrow(() -> new RuntimeException("Association not found"));

        if (associationDTO.getUsername() != null) association.setUsername(associationDTO.getUsername());
        if (associationDTO.getEmail() != null) association.setEmail(associationDTO.getEmail());
        if (associationDTO.getName() != null) association.setName(associationDTO.getName());
        if (associationDTO.getVille() != null) association.setVille(associationDTO.getVille());
        if (associationDTO.getResponsableName() != null) association.setResponsableName(associationDTO.getResponsableName());
        if (associationDTO.getResponsablePhone() != null) association.setResponsablePhone(associationDTO.getResponsablePhone());

        Association updatedAssociation = associationRepository.save(association);
        return Utils.mapAssociationEntityToAssociationDTOWithRelations(updatedAssociation);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteAssociation(Long associationId) {
        if (!associationRepository.existsById(associationId)) {
            throw new RuntimeException("Association not found");
        }
        associationRepository.deleteById(associationId);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public List<AssociationDTO> getAllAssociations() {
        List<Association> associations = associationRepository.findAll();
        return Utils.mapAssociationListEntityToAssociationListDTO(associations);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public VolunteerDTO createVolunteer(VolunteerDTO volunteerDTO) {
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
        return Utils.mapVolunteerEntityToVolunteerDTOWithRelations(savedVolunteer);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public VolunteerDTO updateVolunteer(Long volunteerId, VolunteerDTO volunteerDTO) {
        Volunteer volunteer = volunteerRepository.findById(volunteerId)
                .orElseThrow(() -> new RuntimeException("Volunteer not found"));

        if (volunteerDTO.getUsername() != null) volunteer.setUsername(volunteerDTO.getUsername());
        if (volunteerDTO.getEmail() != null) volunteer.setEmail(volunteerDTO.getEmail());
        if (volunteerDTO.getPhoneNumber() != null) volunteer.setPhoneNumber(volunteerDTO.getPhoneNumber());
        if (volunteerDTO.getAvailableDays() != null) volunteer.setAvailableDays(volunteerDTO.getAvailableDays());

        Volunteer updatedVolunteer = volunteerRepository.save(volunteer);
        return Utils.mapVolunteerEntityToVolunteerDTOWithRelations(updatedVolunteer);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteVolunteer(Long volunteerId) {
        if (!volunteerRepository.existsById(volunteerId)) {
            throw new RuntimeException("Volunteer not found");
        }
        volunteerRepository.deleteById(volunteerId);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public List<VolunteerDTO> getAllVolunteers() {
        List<Volunteer> volunteers = volunteerRepository.findAll();
        return Utils.mapVolunteerListEntityToVolunteerListDTO(volunteers);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public void validateVolunteerRequest(Long requestId) {
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
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public SessionDTO confirmSession(Long sessionId) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        session.setStatus(SessionStatus.CONFIRMED);
        Session updatedSession = sessionRepository.save(session);
        return Utils.mapSessionEntityToSessionDTOWithRelations(updatedSession);
    }
}
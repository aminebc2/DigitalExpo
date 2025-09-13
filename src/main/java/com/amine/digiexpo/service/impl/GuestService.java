package com.amine.digiexpo.service.impl;

import com.amine.digiexpo.DTO.AssociationDTO;
import com.amine.digiexpo.DTO.PlanningDTO;
import com.amine.digiexpo.DTO.Response;
import com.amine.digiexpo.Repository.AssociationRepository;
import com.amine.digiexpo.Repository.SessionRepository;
import com.amine.digiexpo.entity.Association;
import com.amine.digiexpo.entity.Session;
import com.amine.digiexpo.service.interfac.IGuestService;
import com.amine.digiexpo.utils.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GuestService implements IGuestService {

    @Autowired
    private AssociationRepository associationRepository;

    @Autowired
    private SessionRepository sessionRepository;

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

    public Response getPlanning() {
        List<Session> sessions = sessionRepository.findAll();
        List<PlanningDTO> planningList = Utils.generatePlanning(sessions);

        Response response = new Response();
        response.setStatusCode(200);
        response.setMessage("Planning fetched successfully");
        response.setPlanningList(planningList);
        return response;
    }
}

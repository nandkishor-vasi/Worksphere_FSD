package com.example.Worksphere.service;

import com.example.Worksphere.dto.MemberDTO;
import com.example.Worksphere.dto.ProjectDTO;
import com.example.Worksphere.model.ProjectModel;
import com.example.Worksphere.model.UserModel;
import com.example.Worksphere.repo.AnalyticsRepo;
import com.example.Worksphere.repo.ProjectRepo;
import com.example.Worksphere.repo.UserRepo;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class ProjectService {
    @Autowired
    private ProjectRepo projectRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private AnalyticsRepo analyticsRepo;

    public ProjectModel getProjectById(Long id) {
        return projectRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Project not found"));
    }

    @Transactional
    public ProjectModel createProject(ProjectModel project, List<Long> memberIds) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();

        UserModel user = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        project.setCreatedBy(user);

        project.setCreatedAt(new Date());
        project.setUpdatedAt(new Date());

        Set<UserModel> members = new HashSet<>(userRepo.findAllById(memberIds));
        project.setMembers(members);

        return projectRepo.save(project);
    }

    public List<UserModel> getAssignedMembersForProject(Long projectId) {
        ProjectModel project = getProjectById(projectId);
        return new ArrayList<>(project.getMembers());
    }

    public Map<String, Object> getProjectTimeline(Long projectId) {
        return analyticsRepo.getProjectTimeline(projectId); // keep as-is
    }

    @Transactional
    public ProjectModel updateProject(Long id, ProjectModel updatedProject) {

        ProjectModel existing = getProjectById(id);

        existing.setTitle(updatedProject.getTitle());
        existing.setDescription(updatedProject.getDescription());
        existing.setStatus(updatedProject.getStatus());
        existing.setUpdatedAt(new Date());

        return projectRepo.save(existing);
    }

    public void deleteProject(Long id) {
        projectRepo.deleteById(id);
    }

    public List<ProjectDTO> getProjectsByUserId(Long userId) {
        return projectRepo.findByCreatedById(userId)
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    public List<ProjectDTO> getProjectsByMemberId(Long userId) {
        return projectRepo.findByMemberId(userId)
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    private ProjectDTO mapToDTO(ProjectModel project) {

        ProjectDTO dto = new ProjectDTO();

        dto.setId(project.getId());
        dto.setTitle(project.getTitle());
        dto.setDescription(project.getDescription());
        dto.setStatus(project.getStatus().name());
        dto.setCreatedAt(project.getCreatedAt());
        dto.setUpdatedAt(project.getUpdatedAt());
        dto.setStartDate(project.getStartDate());
        dto.setEndDate(project.getEndDate());

        if (project.getCreatedBy() != null) {
            dto.setCreatedById(project.getCreatedBy().getId());
            dto.setCreatedByName(project.getCreatedBy().getName());
        }

        if (project.getMembers() != null) {
            List<MemberDTO> members = project.getMembers().stream().map(user -> {
                MemberDTO m = new MemberDTO();
                m.setId(user.getId());
                m.setName(user.getName());
                m.setEmail(user.getEmail());
                return m;
            }).toList();

            dto.setMembers(members);
        }

        return dto;
    }

}

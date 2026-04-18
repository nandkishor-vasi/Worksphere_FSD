package com.example.Worksphere.service;

import com.example.Worksphere.dto.ActivityDTO;
import com.example.Worksphere.model.ActivityModel;
import com.example.Worksphere.model.ProjectModel;
import com.example.Worksphere.repo.ActivityRepo;
import com.example.Worksphere.repo.ProjectRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

import static com.example.Worksphere.model.Action.COMPLETED;

@Service
public class ActivityService {
    @Autowired
    private ActivityRepo activityRepo;

    @Autowired
    private ProjectRepo projectRepo;

    public List<ActivityDTO> getAllActivities() {
        return activityRepo.findAll()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    private ActivityDTO mapToDTO(ActivityModel activity) {

        ActivityDTO dto = new ActivityDTO();

        dto.setId(activity.getId());
        dto.setAction(activity.getAction().name());
        dto.setDetail(activity.getDetail());
        dto.setProjectStatus(activity.getProject().getStatus().name());
        dto.setProjectTitle(activity.getProject().getTitle());

        if (activity.getProject() != null && activity.getProject().getStatus() != null) {
            dto.setProjectStatus(activity.getProject().getStatus().name());
        }

        if (activity.getTimestamp() != null) {
            dto.setTimestamp(activity.getTimestamp().getTime());
        }

        dto.setFileUrl(activity.getFileUrl());

        if (activity.getProject() != null) {
            dto.setProjectId(activity.getProject().getId());
        }

        if (activity.getCreatedBy() != null) {
            dto.setCreatedByName(activity.getCreatedBy().getName());
        }

        if (activity.getHandledBy() != null) {
            dto.setHandledByName(activity.getHandledBy().getName());
        }

        return dto;
    }

    public ActivityDTO getActivityById(Long id) {
        ActivityModel activity = activityRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Activity not found"));

        return mapToDTO(activity);
    }

    @Transactional
    public ActivityModel createActivity(ActivityModel activity) {
        ActivityModel saved = activityRepo.save(activity);
        ProjectModel project = projectRepo.findById(activity.getProject().getId())
                .orElseThrow(() -> new RuntimeException("Project not found"));

        project.setStatus(ProjectModel.Status.IN_PROGRESS);

        activity.setProject(project);
        project.setStatus(ProjectModel.Status.IN_PROGRESS);
        projectRepo.save(project);

        return saved;
    }

    @Transactional
    public ActivityModel updateActivity(Long id, ActivityModel updatedActivity) {
        ActivityModel existing = activityRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Activity not found with ID: " + id));

        existing.setAction(updatedActivity.getAction());

        if (updatedActivity.getFileUrl() != null) {
            existing.setFileUrl(updatedActivity.getFileUrl());
        }

        ProjectModel project = projectRepo.findById(existing.getProject().getId())
                .orElseThrow(() -> new RuntimeException("Project not found"));

        if (updatedActivity.getAction() == COMPLETED) {
            project.setStatus(ProjectModel.Status.COMPLETED);
        } else {
            project.setStatus(ProjectModel.Status.IN_PROGRESS);
        }

        return activityRepo.save(existing);
    }

    public void deleteActivity(Long id) {
        if (!activityRepo.existsById(id)) {
            throw new RuntimeException("Activity not found with ID: " + id);
        }
        activityRepo.deleteById(id);
    }

    public boolean existsById(Long id) {
        return activityRepo.existsById(id);
    }

    public List<ActivityDTO> getActivitiesByAdminId(Long adminId) {
        return activityRepo.findByCreatedById(adminId)
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    public List<ActivityDTO> getActivitiesWithMemberAndProjectDetails(Long memberId) {
        return activityRepo.findActivitiesForMember(memberId)
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    public List<ActivityDTO> getActivitiesByProjectId(Long projectId) {
        return activityRepo.findByProjectId(projectId)
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    public void updateFileUrl(Long id, String fileUrl) {
        ActivityModel activity = activityRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Activity not found"));

        activity.setFileUrl(fileUrl);
        activityRepo.save(activity);
    }
}

package com.example.Worksphere.controller;

import com.example.Worksphere.dto.ProjectDTO;
import com.example.Worksphere.model.ProjectModel;
import com.example.Worksphere.model.UserModel;
import com.example.Worksphere.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "http://localhost:3000")
public class ProjectController {
    @Autowired
    private ProjectService projectService;

    @GetMapping("/projectByAdmin/{userId}")
    public ResponseEntity<List<ProjectDTO>> getProjectsWithUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(projectService.getProjectsByUserId(userId));
    }

    @GetMapping("/projectByMember/{userId}")
    public ResponseEntity<List<ProjectDTO>> getProjectsWithMemberId(@PathVariable Long userId) {
        return ResponseEntity.ok(projectService.getProjectsByMemberId(userId));
    }

    @GetMapping("/availableMembers/{projectId}")
    public List<UserModel> getAvailableMembersForProject(@PathVariable Long projectId) {
        return projectService.getAssignedMembersForProject(projectId);
    }

    @PostMapping
    public ProjectModel createProject(@RequestBody ProjectModel project) {
        project.setCreatedAt(new Date());
        project.setUpdatedAt(new Date());

        List<Long> memberIds = project.getMembers().stream()
                .map(UserModel::getId)
                .collect(Collectors.toList());


        return projectService.createProject(project, memberIds);
    }

    @PutMapping("/{id}")
    public ProjectModel updateProject(@PathVariable Long id, @RequestBody ProjectModel project) {
        return projectService.updateProject(id, project);
    }

    @DeleteMapping("/{id}")
    public void deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
    }

}

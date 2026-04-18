package com.example.Worksphere.controller;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.Worksphere.dto.ActivityDTO;
import com.example.Worksphere.model.ActivityModel;
import com.example.Worksphere.service.ActivityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/activities")
@CrossOrigin(origins = "http://localhost:3000")
public class ActivityController {

    @Autowired
    private ActivityService activityService;

    @Autowired
    private Cloudinary cloudinary;

    @GetMapping("/{id}")
    public ResponseEntity<List<ActivityDTO>> getAllActivities() {
        return ResponseEntity.ok(activityService.getAllActivities());
    }
    @GetMapping("/admin/{adminId}")
    public List<ActivityDTO> getActivitiesByAdminId(@PathVariable Long adminId) {
        return activityService.getActivitiesByAdminId(adminId);
    }

    @GetMapping("/member/{memberId}")
    public List<ActivityDTO> getActivitiesWithMemberAndProjectDetails(@PathVariable Long memberId) {
        return activityService.getActivitiesWithMemberAndProjectDetails(memberId);
    }

    @GetMapping("/project/{projectId}")
    public List<ActivityDTO> getActivitiesByProjectId(@PathVariable Long projectId) {
        return activityService.getActivitiesByProjectId(projectId);
    }

    @PostMapping
    public ActivityModel createActivity(@RequestBody ActivityModel activity) {
        return activityService.createActivity(activity);
    }

    @PutMapping("/{id}")
    public ActivityModel updateActivity(@PathVariable Long id, @RequestBody ActivityModel activity) {
        return activityService.updateActivity(id, activity);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteActivity(@PathVariable Long id) {

        activityService.deleteActivity(id);
        return ResponseEntity.noContent().build();
    }


    @PostMapping("/{id}/upload")
    public ResponseEntity<?> uploadFile(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {

        try {
            Map uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap("resource_type", "raw")
            );

            String fileUrl = uploadResult.get("secure_url").toString();

            activityService.updateFileUrl(id, fileUrl);

            return ResponseEntity.ok(fileUrl);

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Upload failed");
        }
    }

}

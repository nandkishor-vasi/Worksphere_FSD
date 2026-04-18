package com.example.Worksphere.controller;

import com.example.Worksphere.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "http://localhost:3000")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/activities/{projectId}/count-per-project")
    public List<Map<String, Object>> countActivitiesPerProject(@PathVariable Long projectId) {
        return analyticsService.countActivitiesPerProject(projectId);
    }

    @GetMapping("/projects/{projectId}/timeline")
    public Map<String, Object> getProjectTimeline(@PathVariable Long projectId) {
        return analyticsService.getProjectTimeline(projectId);
    }
}

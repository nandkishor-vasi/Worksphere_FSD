package com.example.Worksphere.service;

import com.example.Worksphere.repo.AnalyticsRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class AnalyticsService {

    @Autowired
    private AnalyticsRepo analyticsRepo;

    public List<Map<String, Object>> countActivitiesPerProject(Long projectId) {
        return analyticsRepo.countActivitiesPerProject(projectId);
    }

    public Map<String, Object> getProjectTimeline(Long projectId) {
        return analyticsRepo.getProjectTimeline(projectId);
    }
}

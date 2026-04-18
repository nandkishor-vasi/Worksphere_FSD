package com.example.Worksphere.repo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public class AnalyticsRepo  {

    @Autowired
    private JdbcTemplate jdbcTemplate;


    public List<Map<String, Object>> countActivitiesPerProject(Long projectId) {
        String sql = "SELECT project_id, COUNT(*) AS total_activities " +
                "FROM activities " +
                "WHERE (? IS NULL OR project_id = ?) " +
                "GROUP BY project_id";
        return jdbcTemplate.queryForList(sql, projectId, projectId);
    }

    public Map<String, Object> getProjectTimeline(Long projectId) {
        String sql = """
            SELECT
                title,
                start_date,
                end_date,
                created_at,
                status,
                (end_date - start_date) AS duration_days
            FROM projects
            WHERE id = ?;
            """;

        return jdbcTemplate.queryForMap(sql, projectId);
    }

}

package com.example.Worksphere.repo;
import com.example.Worksphere.model.ActivityModel;
import com.example.Worksphere.model.ProjectModel;
import com.example.Worksphere.model.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ActivityRepo extends JpaRepository<ActivityModel, Long> {

    List<ActivityModel> findByCreatedById(Long adminId);

    List<ActivityModel> findByProjectId(Long projectId);

    @Query("""
    SELECT a FROM ActivityModel a
    JOIN FETCH a.project p
    WHERE a.handledBy.id = :memberId
    ORDER BY a.timestamp DESC
""")
    List<ActivityModel> findActivitiesForMember(@Param("memberId") Long memberId);

    @Query("SELECT a.createdBy FROM ActivityModel a WHERE a.id = :id")
    UserModel getAdminForActivity(@Param("id") Long id);

    @Query("SELECT a.handledBy FROM ActivityModel a WHERE a.id = :id")
    UserModel getMemberForActivity(@Param("id") Long id);

    @Query("SELECT a.project FROM ActivityModel a WHERE a.id = :id")
    ProjectModel getProjectDetailsForActivity(@Param("id") Long id);

    @Query("""
    SELECT a FROM ActivityModel a
    JOIN FETCH a.createdBy
    JOIN FETCH a.handledBy
    JOIN FETCH a.project
    WHERE a.id = :id
""")
    Optional<ActivityModel> findByIdWithRelations(Long id);

}
